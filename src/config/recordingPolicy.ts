/**
 * 음성 녹음 정책 설정
 * Google Speech API 제한사항에 따른 녹음 정책 정의
 */

export const RECORDING_POLICY = {
  // Google Speech API는 1분(60초) 제한이 있으므로 안전하게 50초로 설정
  MAX_RECORDING_DURATION: 50 * 1000, // 50초 (밀리초)

  // 사용자에게 남은 시간을 알려주는 경고 시점 (35초 후)
  WARNING_TIME: 35 * 1000, // 35초 (밀리초)

  // 자동 정지 전 카운트다운 시작 시점 (45초 후)
  COUNTDOWN_START_TIME: 45 * 1000, // 45초 (밀리초)
} as const;

export const RECORDING_MESSAGES = {
  WARNING: '15초 후 자동으로 녹음이 종료됩니다.',
  COUNTDOWN_10: '10초 후 자동 종료',
  COUNTDOWN_5: '5초 후 자동 종료',
  AUTO_STOP: '최대 녹음 시간 도달로 자동 종료됨',
} as const;