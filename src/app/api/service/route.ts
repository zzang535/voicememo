import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const result = await executeQuery('SELECT * FROM service ORDER BY created_at DESC');

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Failed to fetch service data:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch service data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}