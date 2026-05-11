const fs = require('fs');
let t = fs.readFileSync('c:/automate mail/Theme/THEME/tailux/js/demo/backend/server.js', 'utf8');

// The corruption is char 96 (backtick) + char 110 (n) + spaces
// appearing where a real newline should be.
// These occur in 3 specific places in the INSERT statement.

// Fix 1: after gmail_accounts_json) before VALUES
// Fix 2: after $7)` before the array [
// Fix 3: any remaining `n sequences that are NOT inside a JS template literal
// (i.e., preceded by ) or ` and followed by spaces)

let fixCount = 0;
let result = '';
for (let i = 0; i < t.length; i++) {
  const c = t.charCodeAt(i);
  const next = t.charCodeAt(i + 1);
  const next2 = t.charCodeAt(i + 2);

  // backtick (96) + n (110) + space (32) or tab (9)
  if (c === 96 && next === 110 && (next2 === 32 || next2 === 9)) {
    // Only fix if this backtick is NOT the start of a template literal
    // i.e., the char before it is ) or ` (closing a template)
    const prev = i > 0 ? t.charCodeAt(i - 1) : 0;
    // prev is ) = 41, or ` = 96 (end of template), or ; = 59
    if (prev === 41 || prev === 96 || prev === 59 || prev === 44) {
      result += '\n';
      fixCount++;
      continue;
    }
  }
  result += t[i];
}

console.log('Fixes applied:', fixCount);
fs.writeFileSync('c:/automate mail/Theme/THEME/tailux/js/demo/backend/server.js', result, 'utf8');
console.log('Done, new length:', result.length);
