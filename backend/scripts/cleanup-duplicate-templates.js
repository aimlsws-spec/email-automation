/**
 * STEP 1: CLEANUP DUPLICATE/WRONG TEMPLATES
 * 
 * Removes:
 * - Duplicate follow-up templates
 * - Generic/sample templates (Acme Corp, Seawind Team, etc.)
 * - Preview/demo HTML accidentally saved
 * - Non-Viralkar follow-up templates
 * 
 * Keeps ONLY:
 * - final templete
 * - FOLLOW UP (VIRALKAR)
 * - FOLLOW UP 2 (VIRALKAR)
 */

const pool = require('../db');

const VALID_TEMPLATES = [
  'final templete',
  'FOLLOW UP (VIRALKAR)',
  'FOLLOW UP 2 (VIRALKAR)',
];

const INVALID_PATTERNS = [
  /acme\s+corp/i,
  /seawind\s+team/i,
  /demo/i,
  /sample/i,
  /test/i,
  /preview/i,
  /placeholder/i,
  /IT\s+solutions/i,
];

async function cleanupTemplates() {
  console.log('[CLEANUP] Starting template cleanup...\n');

  try {
    // 1. Get all templates
    const { rows: allTemplates } = await pool.query(
      `SELECT id, name, html_content, created_at FROM email_templates ORDER BY created_at DESC`
    );

    console.log(`[CLEANUP] Found ${allTemplates.length} total templates\n`);

    // 2. Identify templates to delete
    const toDelete = [];
    const toKeep = [];

    for (const t of allTemplates) {
      const isValid = VALID_TEMPLATES.includes(t.name);
      const hasInvalidPattern = INVALID_PATTERNS.some(p => p.test(t.name) || p.test(t.html_content || ''));

      if (!isValid || hasInvalidPattern) {
        toDelete.push(t);
      } else {
        toKeep.push(t);
      }
    }

    console.log(`[CLEANUP] Templates to KEEP (${toKeep.length}):`);
    toKeep.forEach(t => console.log(`  ✓ [${t.id}] ${t.name}`));
    console.log();

    console.log(`[CLEANUP] Templates to DELETE (${toDelete.length}):`);
    toDelete.forEach(t => console.log(`  ✗ [${t.id}] ${t.name}`));
    console.log();

    // 3. Handle duplicates - keep latest only
    const nameGroups = {};
    for (const t of toKeep) {
      if (!nameGroups[t.name]) nameGroups[t.name] = [];
      nameGroups[t.name].push(t);
    }

    for (const [name, templates] of Object.entries(nameGroups)) {
      if (templates.length > 1) {
        console.log(`[CLEANUP] Found ${templates.length} duplicates of "${name}"`);
        // Sort by created_at DESC, keep first (latest), delete rest
        templates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const [latest, ...duplicates] = templates;
        console.log(`  ✓ Keeping latest: [${latest.id}] created ${latest.created_at}`);
        duplicates.forEach(d => {
          console.log(`  ✗ Deleting duplicate: [${d.id}] created ${d.created_at}`);
          toDelete.push(d);
        });
      }
    }

    console.log();

    // 4. Execute deletions
    if (toDelete.length === 0) {
      console.log('[CLEANUP] ✓ No templates to delete. Database is clean!\n');
      return;
    }

    console.log(`[CLEANUP] Deleting ${toDelete.length} template(s)...`);
    for (const t of toDelete) {
      await pool.query(`DELETE FROM email_templates WHERE id = ?`, [t.id]);
      console.log(`  ✓ Deleted [${t.id}] ${t.name}`);
    }

    console.log();
    console.log('[CLEANUP] ✓ Cleanup complete!\n');

    // 5. Verify final state
    const { rows: finalTemplates } = await pool.query(
      `SELECT id, name FROM email_templates ORDER BY name`
    );

    console.log(`[CLEANUP] Final template count: ${finalTemplates.length}`);
    finalTemplates.forEach(t => console.log(`  • [${t.id}] ${t.name}`));
    console.log();

    // 6. Verify required templates exist
    const missing = VALID_TEMPLATES.filter(
      name => !finalTemplates.some(t => t.name === name)
    );

    if (missing.length > 0) {
      console.warn('[CLEANUP] ⚠ WARNING: Missing required templates:');
      missing.forEach(name => console.warn(`  ✗ ${name}`));
      console.warn('\nRun migration 006_insert_followup_templates.sql to create them.\n');
    } else {
      console.log('[CLEANUP] ✓ All required templates present!\n');
    }

  } catch (err) {
    console.error('[CLEANUP] Error:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  cleanupTemplates().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { cleanupTemplates };
