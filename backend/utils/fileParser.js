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
    email:   get(['email', 'e-mail', 'mail', 'email address', 'emailaddress', 'email_address', 'work email', 'business email', 'contact email', 'primary email', 'email id']),
    name:    get(['name', 'full name', 'fullname', 'lead name', 'first name', 'firstname', 'contact name', 'contact']),
    company: get(['company', 'company name', 'organisation', 'organization', 'org', 'firm', 'business']),
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
  const bufLen = buffer?.length ?? 0;
  console.log('[FILEPARSER] Buffer type:', buffer?.constructor?.name, '| Buffer size:', bufLen, 'bytes');

  if (bufLen >= 4) {
    const isZip = buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
    const magic = [buffer[0], buffer[1], buffer[2], buffer[3]].map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log('[FILEPARSER] Magic bytes:', magic, isZip ? '(valid XLSX/ZIP)' : '⚠ NOT a valid ZIP — expected 50 4b 03 04');
  } else {
    console.log('[FILEPARSER] ⚠ Buffer too small or empty — cannot be a valid XLSX file');
  }

  // Try buffer read first; fall back to base64 path which handles some edge cases in xlsx@0.18
  let workbook = XLSX.read(buffer, { type: 'buffer' });
  if (!workbook.SheetNames.length) {
    console.log('[FILEPARSER] Primary read returned no sheets — retrying via base64 path');
    workbook = XLSX.read(buffer.toString('base64'), { type: 'base64' });
  }

  console.log('[FILEPARSER] Sheet names:', workbook.SheetNames);
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

  console.log('[FILEPARSER] First mapped row:', JSON.stringify(mappedRows[0] ?? null));
  console.log('[FILEPARSER] Non-empty rows (pre-email-filter):', mappedRows.length);

  const filtered = mappedRows.filter(r => isValidEmail(r.email));
  console.log('[FILEPARSER] Rows with valid email (post-filter):', filtered.length);
  return filtered;
}


module.exports = { isValidEmail, normalizeRow, parseCSV, parseExcel };
