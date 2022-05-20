const { Client } = require('pg');
const { env } = require('../config');
const fs = require('fs')

const client = new Client({
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DATABASE,
  port: env.POSTGRES_PORT
})

client.connect(async err => {
  if (err) throw err;
  console.log("Connected!");

  const files = fs.readdirSync('migration/table_sql/')
  for (const file of files) {
    const sql = fs.readFileSync(`migration/table_sql/${file}`, "utf8")
    await client.query(sql)
  }

  console.log("Done");
  process.exit();
});