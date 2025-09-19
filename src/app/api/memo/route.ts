import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET: 사용자의 메모 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    const result = await executeQuery(
      'SELECT * FROM memo WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Failed to fetch memos:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch memos',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST: 새로운 메모 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json({
        success: false,
        message: 'User ID and content are required'
      }, { status: 400 });
    }

    if (content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Content cannot be empty'
      }, { status: 400 });
    }

    const result = await executeQuery(
      'INSERT INTO memo (user_id, content) VALUES (?, ?)',
      [userId, content.trim()]
    ) as { insertId: number };

    return NextResponse.json({
      success: true,
      message: 'Memo saved successfully',
      data: {
        id: result.insertId,
        user_id: userId,
        content: content.trim(),
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Failed to save memo:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to save memo',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: 메모 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memoId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!memoId || !userId) {
      return NextResponse.json({
        success: false,
        message: 'Memo ID and User ID are required'
      }, { status: 400 });
    }

    // 해당 사용자의 메모인지 확인 후 삭제
    const result = await executeQuery(
      'DELETE FROM memo WHERE id = ? AND user_id = ?',
      [memoId, userId]
    ) as { affectedRows: number };

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Memo not found or unauthorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Memo deleted successfully'
    });

  } catch (error) {
    console.error('Failed to delete memo:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to delete memo',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}