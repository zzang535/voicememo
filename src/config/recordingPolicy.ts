/**
 * 음성 녹음 정책 설정
 * Google Speech API 제한사항에 따른 녹음 정책 정의
 */

export const RECORDING_POLICY = {
  // 최대 녹음 시간을 30초로 설정
  MAX_RECORDING_DURATION: 30 * 1000, // 30초 (밀리초)

  // 사용자에게 남은 시간을 알려주는 경고 시점 (20초 후)
  WARNING_TIME: 20 * 1000, // 20초 (밀리초)

  // 자동 정지 전 카운트다운 시작 시점 (25초 후)
  COUNTDOWN_START_TIME: 25 * 1000, // 25초 (밀리초)
} as const;

export const RECORDING_MESSAGES = {
  WARNING: '10초 후 자동으로 녹음이 종료됩니다.',
  COUNTDOWN_10: '10초 후 자동 종료',
  COUNTDOWN_5: '5초 후 자동 종료',
  AUTO_STOP: '최대 녹음 시간 도달로 자동 종료됨',
} as const;