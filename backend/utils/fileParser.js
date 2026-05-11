const csv = require('csv-parser');
const XLSX = require('xlsx');

function isValidEmail(email) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  if (!valid) {
    console.log(`[FILEPARSER] isValidEmail rejected: ${JSON.stringify(email)}`);
  }
  return valid;
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return { email: '', name: '', company: '' };
  // Case-insensitive key lookup.
  // Strip BOM (﻿) before trimming — XLSX sometimes injects BOM on the first
  // header key, which causes r.trim().toLowerCase() to produce '﻿email'
  // instead of 'email', silently breaking every lookup on that column.
  const get = (keys) => {
    for (const k of keys) {
      const found = Object.keys(row).find(
        (r) => r.replace(/^﻿/, '').trim().toLowerCase() === k
      );
      if (found !== undefined) {
        const val = row[found];
        return (val !== undefined && val !== null) ? String(val).trim() : '';
      }
    }
    return '';
  };
  return {
    email:   get(['email', 'e-mail', 'mail']),
    name:    get(['name', 'full name', 'fullname', 'lead name']),
    company: get(['company', 'company name', 'organisation', 'organization']),
  };
}

function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    try {
      if (!buffer || buffer.length === 0) {
        return reject(new Error('Empty file'));
      }
      const results = [];
      const { Readable } = require('stream');
      Readable.from(buffer.toString())
        .pipe(csv())
        .on('data', (row) => results.push(normalizeRow(row)))
        .on('end', () => {
          console.log(`[FILEPARSER] CSV parsed: ${results.length} rows`);
          if (results.length > 0) {
            console.log(`[FILEPARSER] CSV sample:`, JSON.stringify(results[0]));
          }
          resolve(results);
        })
        .on('error', (err) => reject(new Error(`CSV parsing failed: ${err.message}`)));
    } catch (err) {
      reject(new Error(`CSV parsing failed: ${err.message}`));
    }
  });
}

function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const firstSheet = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheet];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  console.log('[FILEPARSER] Excel raw rows:', rows.length);

  if (!rows.length) return [];

  const headers = rows[0].map(h =>
    String(h || '')
      .replace(/^﻿/, '')
      .trim()
      .toLowerCase()
  );

  console.log('[FILEPARSER] Parsed headers:', headers);

  const mappedRows = rows
    .slice(1)
    .filter(row => row.some(cell => String(cell || '').trim()))
    .map(row => {
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = String(row[index] || '').trim();
      });

      return normalizeRow(obj);
    });

  console.log('[FILEPARSER] First mapped row:', mappedRows[0]);
  console.log('[FILEPARSER] Valid row count:', mappedRows.length);

  return mappedRows.filter(r => isValidEmail(r.email));
}

module.exports = { isValidEmail, normalizeRow, parseCSV, parseExcel };
