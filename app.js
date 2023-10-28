const fs = require("fs");
const readline = require("readline");
const sql = require("mssql");
const file = "output_file_1.sql";

const sqlConfig = {
  user: "admin",
  password: "admin",
  database: "TEST",
  server: "localhost",
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

async function processLineByLine() {
  try {
    await sql.connect(sqlConfig);

    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let lineCount = 0;
    for await (const line of rl) {
      await sql.query(`${line}`);
      console.log(`Line count: ${++lineCount}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await sql.close();
  }
}

processLineByLine();
