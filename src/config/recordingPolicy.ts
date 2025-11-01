/**
 * 음성 녹음 정책 설정
 * Google Speech API 제한사항에 따른 녹음 정책 정의
 */

/**
 * STT 처리 방식
 * - 'direct': 직접 Speech API 호출 (동기, 60초 제한)
 * - 'gcs': GCS 업로드 후 LongRunningRecognize 사용 (비동기, 긴 오디오 가능)
 */
export type STTProcessingMode = 'direct' | 'gcs';

// STT 처리 방식 설정 (여기서 변경)
const STT_MODE: STTProcessingMode = 'gcs'; // 'direct' 또는 'gcs'

export const RECORDING_POLICY = {
  // STT 처리 방식
  STT_MODE,

  // 최대 녹음 시간 설정
  // - direct 모드: 50초 (Google Speech API 60초 제한)
  // - gcs 모드: 300초 (5분, 더 긴 녹음 가능)
  MAX_RECORDING_DURATION: STT_MODE === 'gcs'
    ? 60 * 1000  // 5분 (GCS 모드)
    : 30 * 1000,  // 50초 (Direct 모드)

  // 녹음 중지 시 딜레이 (마지막 음성 캡처를 위한 대기 시간)
  STOP_DELAY: 1000, // 1초 (밀리초)

  // 카운트다운 시작 시점 (녹음 시작부터 바로 표시)
  COUNTDOWN_START_TIME: 0, // 0초 (밀리초)

  // 카운트다운 색상 변경 임계값
  WARNING_THRESHOLD: 10, // 10초 이하에서 노란색으로 변경
  DANGER_THRESHOLD: 5,   // 5초 이하에서 빨간색으로 변경
} as const;

export const RECORDING_MESSAGES = {
  AUTO_STOP: '최대 녹음 시간 도달로 자동 종료됨',
} as const;

/**
 * Google Cloud Storage 설정
 * GCS 모드에서 사용됩니다
 */
export const GCS_CONFIG = {
  // GCS 버킷 이름 (환경 변수 또는 기본값)
  BUCKET_NAME: process.env.GCS_BUCKET_NAME || 'voicememo-storage',

  // GCS 파일 저장 경로 프리픽스
  FILE_PATH_PREFIX: 'audio/',

  // 업로드된 파일 보관 기간 (일)
  // 참고: GCS 버킷의 Lifecycle 정책으로 자동 삭제 설정 가능
  RETENTION_DAYS: 7,
} as const;