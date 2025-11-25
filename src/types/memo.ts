/**
 * 메모 데이터 타입 정의
 */

export interface MemoData {
  id: number;
  user_id: string;
  content: string;
  tag1?: string | null;  // 첫 번째 감정 태그 코드 (예: MILD_ANXIETY)
  tag2?: string | null;  // 두 번째 감정 태그 코드 (예: MENTAL_CLARITY)
  created_at: string;
  updated_at: string;
}

/**
 * 메모 생성 요청 타입
 */
export interface CreateMemoRequest {
  userId: string;
  content: string;
  tag1?: string;
  tag2?: string;
}

/**
 * 메모 수정 요청 타입
 */
export interface UpdateMemoRequest {
  id: number;
  userId: string;
  content: string;
  tag1?: string;
  tag2?: string;
}
