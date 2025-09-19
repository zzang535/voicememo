import { NextResponse } from 'next/server';
import { connectDB, executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    await connectDB();

    // Test simple query
    const result = await executeQuery('SELECT 1 as test');

    // Test database and table existence
    const databases = await executeQuery('SHOW DATABASES');
    const tables = await executeQuery('SHOW TABLES');

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        testQuery: result,
        databases: databases,
        tables: tables,
      }
    });

  } catch (error) {
    console.error('Database connection test failed:', error);

    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}