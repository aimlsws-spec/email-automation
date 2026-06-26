const pool = require('../db');

(async () => {
  try {
    console.log('DESCRIBE email_logs');
    try { const el = await pool.query('DESCRIBE email_logs'); console.log(el.rows.map(r => ({Field: r.Field, Type: r.Type}))); } catch (e) { console.log('email_logs error:', e.message); }

    console.log('\nDESCRIBE email_queue');
    try { const eq = await pool.query('DESCRIBE email_queue'); console.log(eq.rows.map(r => ({Field: r.Field, Type: r.Type}))); } catch (e) { console.log('email_queue error:', e.message); }

    console.log('\nDESCRIBE followup_queue');
    try { const fq = await pool.query('DESCRIBE followup_queue'); console.log(fq.rows.map(r => ({Field: r.Field, Type: r.Type}))); } catch (e) { console.log('followup_queue error:', e.message); }

    console.log('\nDESCRIBE followup_logs');
    try { const fl = await pool.query('DESCRIBE followup_logs'); console.log(fl.rows.map(r => ({Field: r.Field, Type: r.Type}))); } catch (e) { console.log('followup_logs error:', e.message); }

  } catch (err) {
    console.error('Error describing tables:', err.message);
  } finally {
    process.exit(0);
  }
})();
