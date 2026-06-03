import { pool } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql')).toString();
  try {
    await pool.query(schema);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    pool.end();
  }
};

init();
