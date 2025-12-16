/**
 * 메모 데이터 타입 정의
 */

export interface MemoData {
  id: number;
  user_id: string;
  content: string;
  thought?: string | null;  // 자동생각 내용
  emotions?: string[] | null;  // 연관된 감정들 (배열)
  core_needs?: string[] | null;  // 핵심 욕구들 (배열)
  summary?: string | null;  // 메모 요약
  reasoning?: string | null;  // 감정 추출 근거
  created_at: string;
  updated_at: string;
}

/**
 * 메모 생성 요청 타입
 */
export interface CreateMemoRequest {
  userId: string;
  content: string;
  thought?: string;
  emotions?: string[];
  core_needs?: string[];
  summary?: string;
  reasoning?: string;
}

/**
 * 메모 수정 요청 타입
 */
export interface UpdateMemoRequest {
  id: number;
  userId: string;
  content: string;
  thought?: string;
  emotions?: string[];
  core_needs?: string[];
  summary?: string;
  reasoning?: string;
}
