import pkg from 'pg';
const { Pool } = pkg;


// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost", // e.g., "localhost" or your database host
  database: "livkitdb",
  password: "postgres",
  port: 5433, // Default PostgreSQL port
});

export const query = (text, params) => pool.query(text, params);