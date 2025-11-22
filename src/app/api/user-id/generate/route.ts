import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// 12간지 동물 목록
const ZODIAC_ANIMALS = [
  'rat',      // 쥐
  'ox',       // 소
  'tiger',    // 호랑이
  'rabbit',   // 토끼
  'dragon',   // 용
  'snake',    // 뱀
  'horse',    // 말
  'sheep',    // 양
  'monkey',   // 원숭이
  'rooster',  // 닭
  'dog',      // 개
  'pig'       // 돼지
] as const;

interface SequenceRow {
  number: string;
}

/**
 * 새로운 유저 ID 생성 API
 *
 * 동작 방식:
 * 1. user_id_sequence 테이블에서 사용 가능한 가장 작은 숫자 조회
 * 2. 12간지 동물 중 랜덤 선택
 * 3. 동물명-숫자 형식으로 ID 생성 (예: dragon-0001)
 * 4. 해당 숫자를 사용됨으로 표시
 */
export async function POST() {
  try {
    // 1. 사용 가능한 가장 작은 숫자 조회 (FOR UPDATE로 락 걸기)
    const availableSequences = await executeQuery(
      'SELECT number FROM user_id_sequence WHERE is_used = FALSE ORDER BY number ASC LIMIT 1 FOR UPDATE',
      []
    ) as SequenceRow[];

    if (availableSequences.length === 0) {
      return NextResponse.json({
        success: false,
        message: '사용 가능한 ID가 모두 소진되었습니다.'
      }, { status: 503 });
    }

    const sequenceNumber = availableSequences[0].number;

    // 2. 12간지 동물 중 랜덤 선택
    const randomAnimal = ZODIAC_ANIMALS[Math.floor(Math.random() * ZODIAC_ANIMALS.length)];

    // 3. 유저 ID 생성
    const userId = `${randomAnimal}-${sequenceNumber}`;

    // 4. 해당 숫자를 사용됨으로 표시
    await executeQuery(
      'UPDATE user_id_sequence SET is_used = TRUE, assigned_user_id = ? WHERE number = ?',
      [userId, sequenceNumber]
    );

    return NextResponse.json({
      success: true,
      data: {
        userId,
        animal: randomAnimal,
        number: sequenceNumber
      }
    });

  } catch (error) {
    console.error('Failed to generate user ID:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to generate user ID',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * 사용 가능한 ID 개수 조회
 */
export async function GET() {
  try {
    const result = await executeQuery(
      'SELECT COUNT(*) as available FROM user_id_sequence WHERE is_used = FALSE',
      []
    ) as Array<{ available: number }>;

    const totalResult = await executeQuery(
      'SELECT COUNT(*) as total FROM user_id_sequence',
      []
    ) as Array<{ total: number }>;

    return NextResponse.json({
      success: true,
      data: {
        available: result[0].available,
        total: totalResult[0].total,
        used: totalResult[0].total - result[0].available
      }
    });

  } catch (error) {
    console.error('Failed to get sequence stats:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to get sequence stats',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
