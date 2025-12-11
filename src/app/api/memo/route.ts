import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { MemoData } from '@/types/memo';

// GET: 사용자의 메모 목록 조회 또는 개별 메모 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const memoId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    if (memoId) {
      // 개별 메모 조회
      const result = await executeQuery(
        'SELECT * FROM memo WHERE id = ? AND user_id = ?',
        [memoId, userId]
      ) as MemoData[];

      if (result.length === 0) {
        return NextResponse.json({
          success: false,
          message: 'Memo not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result[0]
      });
    } else {
      // 메모 목록 조회
      const result = await executeQuery(
        'SELECT * FROM memo WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      ) as MemoData[];

      return NextResponse.json({
        success: true,
        data: result
      });
    }

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
    const { userId, content, thought, emotions, core_needs, summary } = body;

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

    // JSON 배열을 문자열로 변환 (MySQL JSON 컬럼에 저장)
    const emotionsJson = emotions ? JSON.stringify(emotions) : null;
    const coreNeedsJson = core_needs ? JSON.stringify(core_needs) : null;

    const result = await executeQuery(
      'INSERT INTO memo (user_id, content, thought, emotions, core_needs, summary) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        content.trim(),
        thought || null,
        emotionsJson,
        coreNeedsJson,
        summary || null
      ]
    ) as { insertId: number };

    return NextResponse.json({
      success: true,
      message: 'Memo saved successfully',
      data: {
        id: result.insertId,
        user_id: userId,
        content: content.trim(),
        thought: thought || null,
        emotions: emotions || null,
        core_needs: core_needs || null,
        summary: summary || null,
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

// PUT: 메모 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, content, thought, emotions, core_needs, summary } = body;

    if (!id || !userId || !content) {
      return NextResponse.json({
        success: false,
        message: 'Memo ID, User ID and content are required'
      }, { status: 400 });
    }

    if (content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Content cannot be empty'
      }, { status: 400 });
    }

    // JSON 배열을 문자열로 변환 (MySQL JSON 컬럼에 저장)
    const emotionsJson = emotions ? JSON.stringify(emotions) : null;
    const coreNeedsJson = core_needs ? JSON.stringify(core_needs) : null;

    // 해당 사용자의 메모인지 확인 후 수정
    const result = await executeQuery(
      'UPDATE memo SET content = ?, thought = ?, emotions = ?, core_needs = ?, summary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [content.trim(), thought || null, emotionsJson, coreNeedsJson, summary || null, id, userId]
    ) as { affectedRows: number };

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: 'Memo not found or unauthorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Memo updated successfully'
    });

  } catch (error) {
    console.error('Failed to update memo:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to update memo',
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