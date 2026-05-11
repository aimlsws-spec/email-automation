const http = require('http');

const BASE_URL = 'http://localhost:4000';

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: data,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 0,
        success: false,
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        success: false,
        error: 'Request timeout',
      });
    });

    req.end();
  });
}

async function diagnose() {
  console.log('🔍 Diagnosing API Endpoints...\n');
  console.log('Backend URL:', BASE_URL);
  console.log('─'.repeat(80));
  console.log();

  const endpoints = [
    { path: '/api/dashboard', name: 'Dashboard Data' },
    { path: '/api/leads/pending', name: 'Pending Leads' },
    { path: '/api/template-preview', name: 'Template Preview' },
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.name.padEnd(30)} `);
    
    const result = await testEndpoint(endpoint.path);
    
    if (result.success) {
      console.log('✅ PASS');
      if (endpoint.path === '/api/leads/pending') {
        try {
          const json = JSON.parse(result.data);
          console.log(`   → Pending leads: ${json.count}`);
        } catch (e) {
          // ignore
        }
      }
      if (endpoint.path === '/api/dashboard') {
        try {
          const json = JSON.parse(result.data);
          console.log(`   → Leads imported: ${json.metrics?.leadsImported || 0}`);
          console.log(`   → Emails sent: ${json.metrics?.emailsSent || 0}`);
        } catch (e) {
          // ignore
        }
      }
    } else {
      console.log('❌ FAIL');
      if (result.error) {
        console.log(`   → Error: ${result.error}`);
      } else {
        console.log(`   → Status: ${result.status}`);
      }
      allPassed = false;
    }
  }

  console.log();
  console.log('─'.repeat(80));
  console.log();

  if (!allPassed) {
    console.log('❌ Some endpoints failed\n');
    console.log('Possible causes:');
    console.log('1. Backend server is not running');
    console.log('   → Run: cd backend && npm start');
    console.log();
    console.log('2. Backend is running on different port');
    console.log('   → Check backend/.env PORT setting');
    console.log('   → Check vite.config.js proxy setting');
    console.log();
    console.log('3. Database connection issue');
    console.log('   → Run: cd backend && node test-db.js');
    console.log();
  } else {
    console.log('✅ All endpoints working!\n');
    console.log('If frontend shows "Failed to fetch":');
    console.log('1. Check browser console (F12) for CORS errors');
    console.log('2. Verify vite.config.js has proxy: { "/api": "http://localhost:4000" }');
    console.log('3. Make sure frontend dev server is running: npm run dev');
    console.log('4. Try hard refresh: Ctrl+Shift+R');
    console.log();
  }
}

diagnose();
