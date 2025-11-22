const USER_ID_KEY = 'voicememo_user_id';

/**
 * 사용자 고유 ID를 생성하고 로컬스토리지에 저장합니다.
 * 이미 존재하는 경우 기존 ID를 반환합니다.
 */
export const getUserId = async (): Promise<string> => {
  // 브라우저 환경이 아닌 경우 (SSR) 임시 ID 반환
  if (typeof window === 'undefined') {
    return 'temp_user_id';
  }

  try {
    // 기존 사용자 ID 확인
    const existingUserId = localStorage.getItem(USER_ID_KEY);

    if (!existingUserId) {
      // 새로운 ID를 서버에서 생성 (12간지 방식)
      console.log('🎲 새로운 사용자 ID 생성 요청...');

      const response = await fetch('/api/user-id/generate', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to generate user ID from server');
      }

      const result = await response.json();

      if (result.success && result.data.userId) {
        const newUserId = result.data.userId;
        localStorage.setItem(USER_ID_KEY, newUserId);
        console.log('✅ 새로운 사용자 ID 생성:', newUserId);
        console.log('🐉 동물:', result.data.animal, '| 번호:', result.data.number);
        return newUserId;
      } else {
        throw new Error(result.message || 'Failed to generate user ID');
      }
    } else {
      console.log('✅ 기존 사용자 ID 사용:', existingUserId);
      return existingUserId;
    }
  } catch (error) {
    console.error('❌ 사용자 ID 생성/조회 실패:', error);
    // 로컬스토리지 사용 불가 시 세션 기반 임시 ID 생성
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
};

/**
 * 사용자 ID를 새로 생성하고 기존 ID를 교체합니다.
 */
export const regenerateUserId = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'temp_user_id';
  }

  try {
    // 기존 ID 삭제
    localStorage.removeItem(USER_ID_KEY);

    // 새 ID 생성
    const newUserId = await getUserId();
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
  if (userId) {
    return userId.substring(0, 8);
  }
  // getUserId는 async이므로 직접 호출 불가, userId가 없으면 기본값 반환
  return 'unknown';
};

/**
 * 사용자 ID가 유효한 UUID 형식인지 확인합니다.
 */
export const isValidUUID = (userId: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

/**
 * 사용자 ID가 12간지 형식인지 확인합니다.
 */
export const isValidZodiacId = (userId: string): boolean => {
  const zodiacRegex = /^(rat|ox|tiger|rabbit|dragon|snake|horse|sheep|monkey|rooster|dog|pig)-\d{4}$/i;
  return zodiacRegex.test(userId);
};

/**
 * 사용자 ID가 유효한 형식인지 확인합니다 (UUID 또는 12간지 형식).
 */
export const isValidUserId = (userId: string): boolean => {
  return isValidUUID(userId) || isValidZodiacId(userId);
};