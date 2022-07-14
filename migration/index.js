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

  try {
    const folders = fs.readdirSync('migration/table/')
    for (const folder of folders) {
      const files = fs.readdirSync(`migration/table/${folder}`)
      for (const file of files) {
        console.log(`migration/table/${folder}/${file}`)
        const sql = fs.readFileSync(`migration/table/${folder}/${file}`, "utf8")
        await client.query(sql)
      }
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }

  console.log("Done");
  process.exit();
});