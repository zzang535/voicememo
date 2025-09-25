/**
 * 음성 녹음 정책 설정
 * Google Speech API 제한사항에 따른 녹음 정책 정의
 */

export const RECORDING_POLICY = {
  // 최대 녹음 시간을 30초로 설정
  MAX_RECORDING_DURATION: 30 * 1000, // 30초 (밀리초)

  // 카운트다운 시작 시점 (20초 후, 10초 남음)
  COUNTDOWN_START_TIME: 20 * 1000, // 20초 (밀리초)
} as const;

export const RECORDING_MESSAGES = {
  AUTO_STOP: '최대 녹음 시간 도달로 자동 종료됨',
} as const;