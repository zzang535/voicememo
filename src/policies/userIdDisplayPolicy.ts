/**
 * 사용자 ID 표시 정책
 *
 * - 레거시 UUID 형식: 앞 8자리만 표시 (예: a1b2c3d4)
 * - 새로운 12간지 형식: 전체 표시 (예: dragon-0001)
 */

import { isValidUUID, isValidZodiacId } from '@/utils/userUtils';

/**
 * 사용자 ID를 정책에 따라 표시 형식으로 변환합니다.
 *
 * @param userId - 사용자 ID
 * @returns 표시할 사용자 ID 문자열
 *
 * @example
 * // 레거시 UUID
 * getDisplayUserId('a1b2c3d4-e5f6-7890-abcd-ef1234567890') // 'a1b2c3d4'
 *
 * // 12간지 형식
 * getDisplayUserId('dragon-0001') // 'dragon-0001'
 *
 * // 알 수 없는 형식
 * getDisplayUserId('unknown') // 'unknown'
 */
export function getDisplayUserId(userId: string): string {
  if (!userId) {
    return 'unknown';
  }

  // 케이스1: 레거시 UUID - 앞 8자리만 표시
  if (isValidUUID(userId)) {
    return userId.substring(0, 8);
  }

  // 케이스2: 12간지 형식 - 전체 표시
  if (isValidZodiacId(userId)) {
    return userId;
  }

  // 기타: 그대로 표시 (임시 ID 등)
  return userId.substring(0, 8);
}

/**
 * 사용자 ID가 레거시 형식인지 확인합니다.
 *
 * @param userId - 사용자 ID
 * @returns 레거시 형식 여부
 */
export function isLegacyUserId(userId: string): boolean {
  return isValidUUID(userId);
}

/**
 * 사용자 ID가 새로운 형식(12간지)인지 확인합니다.
 *
 * @param userId - 사용자 ID
 * @returns 12간지 형식 여부
 */
export function isNewFormatUserId(userId: string): boolean {
  return isValidZodiacId(userId);
}

/**
 * 사용자 ID 타입을 반환합니다.
 *
 * @param userId - 사용자 ID
 * @returns 'legacy' | 'zodiac' | 'unknown'
 */
export function getUserIdType(userId: string): 'legacy' | 'zodiac' | 'unknown' {
  if (isValidUUID(userId)) {
    return 'legacy';
  }

  if (isValidZodiacId(userId)) {
    return 'zodiac';
  }

  return 'unknown';
}
