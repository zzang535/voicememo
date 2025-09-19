import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'voicememo_user_id';

/**
 * 사용자 고유 ID를 생성하고 로컬스토리지에 저장합니다.
 * 이미 존재하는 경우 기존 ID를 반환합니다.
 */
export const getUserId = (): string => {
  // 브라우저 환경이 아닌 경우 (SSR) 임시 ID 반환
  if (typeof window === 'undefined') {
    return 'temp_user_id';
  }

  try {
    // 기존 사용자 ID 확인
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
      // 새로운 UUID 생성
      userId = uuidv4();
      localStorage.setItem(USER_ID_KEY, userId);
      console.log('✅ 새로운 사용자 ID 생성:', userId);
    } else {
      console.log('✅ 기존 사용자 ID 사용:', userId);
    }

    return userId;
  } catch (error) {
    console.error('❌ 사용자 ID 생성/조회 실패:', error);
    // 로컬스토리지 사용 불가 시 세션 기반 임시 ID 생성
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
};

/**
 * 사용자 ID를 새로 생성하고 기존 ID를 교체합니다.
 */
export const regenerateUserId = (): string => {
  if (typeof window === 'undefined') {
    return 'temp_user_id';
  }

  try {
    const newUserId = uuidv4();
    localStorage.setItem(USER_ID_KEY, newUserId);
    console.log('✅ 사용자 ID 재생성:', newUserId);
    return newUserId;
  } catch (error) {
    console.error('❌ 사용자 ID 재생성 실패:', error);
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
};

/**
 * 사용자 ID를 삭제합니다.
 */
export const clearUserId = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(USER_ID_KEY);
    console.log('✅ 사용자 ID 삭제 완료');
  } catch (error) {
    console.error('❌ 사용자 ID 삭제 실패:', error);
  }
};

/**
 * 사용자 ID의 짧은 버전을 반환합니다 (UI 표시용)
 */
export const getShortUserId = (userId?: string): string => {
  const id = userId || getUserId();
  return id.substring(0, 8);
};

/**
 * 사용자 ID가 유효한 UUID 형식인지 확인합니다.
 */
export const isValidUserId = (userId: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};