import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

async function runMigration() {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    console.error('❌ Usage: tsx scripts/run-migration.ts <migration-file>');
    process.exit(1);
  }

  const migrationPath = path.join(process.cwd(), migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log(`📄 Running migration: ${migrationFile}`);
  console.log('🔗 Connecting to database...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
  });

  try {
    console.log('✅ Connected to database');
    console.log('🚀 Executing migration...');

    await connection.query(sql);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
    console.log('🔌 Database connection closed');
  }
}

runMigration();
