import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    const schemaPath = join(dirname(fileURLToPath(import.meta.url)), 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('🔄 Running schema migration...');
    await client.query(schema);
    console.log('✅ Schema migration complete.');

    // Check if we should seed
    const arg = process.argv[2];
    if (arg === '--seed') {
      const seedPath = join(dirname(fileURLToPath(import.meta.url)), 'seed.sql');
      const seed = readFileSync(seedPath, 'utf-8');
      console.log('🌱 Running seed data...');
      await client.query(seed);
      console.log('✅ Seed data inserted.');
    }
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
