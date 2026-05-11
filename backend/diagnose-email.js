const path = require("path");
const fs = require("fs");

require("dotenv").config();

function findProjectDir() {
  if (process.env.PYTHON_PROJECT_DIR) return process.env.PYTHON_PROJECT_DIR;

  let current = __dirname;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, "gmail_oauth.py"))) {
      return current;
    }
    current = path.dirname(current);
  }

  return path.resolve(__dirname, "../../../../../..");
}

const pythonProjectDir = findProjectDir();
require("dotenv").config({ path: path.join(pythonProjectDir, ".env"), override: false });

const { transporter } = require("./config/gmail");

console.log("Diagnosing Gmail sending configuration...\n");

const envPath = path.join(pythonProjectDir, ".env");
console.log("Checking project env:", envPath);

if (!fs.existsSync(envPath)) {
  console.log("FAIL: .env file not found.");
  process.exit(1);
}

const missing = [];
if (!process.env.GMAIL_USER) missing.push("GMAIL_USER");
if (!process.env.GMAIL_APP_PASSWORD) missing.push("GMAIL_APP_PASSWORD");

if (missing.length > 0) {
  console.log("Configuration issues found:");
  missing.forEach((name) => console.log(`- ${name} is not set`));
  console.log(`\nSet these in ${path.join(pythonProjectDir, ".env")}:`);
  console.log("GMAIL_USER=your_email@gmail.com");
  console.log("GMAIL_APP_PASSWORD=your_gmail_app_password");
  process.exit(1);
}

console.log("PASS: Gmail credentials are present");
console.log("Verifying Gmail transporter...");

transporter.verify()
  .then(() => {
    console.log("PASS: Gmail transporter verified");
  })
  .catch((err) => {
    console.log("FAIL: Gmail transporter verification failed");
    console.log(err.message);
    process.exit(1);
  });
