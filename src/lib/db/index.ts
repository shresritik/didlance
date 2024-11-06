import { Pool } from '@neondatabase/serverless';

let pool: Pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error('Database connection string not found');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}
