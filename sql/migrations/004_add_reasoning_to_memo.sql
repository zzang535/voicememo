-- Migration: memo 테이블에 추론 근거 컬럼 추가
-- Date: 2025-12-16
-- Description: AI가 감정을 추출하게 된 근거/이유를 저장하는 reasoning 컬럼 추가

-- 트랜잭션 시작
START TRANSACTION;

-- memo 테이블에 reasoning 컬럼 추가
ALTER TABLE memo
  ADD COLUMN reasoning TEXT COMMENT 'AI의 감정 추출 근거/이유' AFTER summary;

-- 커밋
COMMIT;

-- 확인
DESCRIBE memo;
