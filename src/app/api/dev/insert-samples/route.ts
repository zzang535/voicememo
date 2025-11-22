import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import sampleNotes from '@/data/sample-notes.json';

// POST: 개발용 샘플 데이터 삽입
export async function POST() {
  // 개발 환경에서만 동작
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({
      success: false,
      message: 'This endpoint is only available in development mode'
    }, { status: 403 });
  }

  try {
    // 고정된 테스트 사용자 ID 사용
    const userId = 'a02cb3bd-ab2b-479e-a6c7-206adde1cacb';

    const insertedIds: number[] = [];

    for (const note of sampleNotes.notes) {
      const result = await executeQuery(
        'INSERT INTO memo (user_id, content) VALUES (?, ?)',
        [userId, note.text]
      ) as { insertId: number };

      insertedIds.push(result.insertId);
    }

    return NextResponse.json({
      success: true,
      message: `${sampleNotes.notes.length}개의 샘플 노트가 성공적으로 삽입되었습니다.`,
      data: {
        count: sampleNotes.notes.length,
        insertedIds
      }
    });

  } catch (error) {
    console.error('Failed to insert sample notes:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to insert sample notes',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
