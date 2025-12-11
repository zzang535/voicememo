-- Migration: memo 테이블에 자동생각 관련 컬럼 추가
-- Date: 2025-12-11
-- Description: 자동생각(thought), 감정(emotions), 핵심 욕구(core_needs), 요약(summary) 컬럼 추가

-- 트랜잭션 시작
START TRANSACTION;

-- memo 테이블에 자동생각 관련 컬럼 추가
ALTER TABLE memo
  ADD COLUMN thought TEXT COMMENT '자동생각 내용' AFTER content,
  ADD COLUMN emotions JSON COMMENT '연관된 감정들 (배열)' AFTER thought,
  ADD COLUMN core_needs JSON COMMENT '핵심 욕구들 (배열)' AFTER emotions,
  ADD COLUMN summary TEXT COMMENT '메모 요약' AFTER core_needs;

-- 커밋
COMMIT;

-- 확인
DESCRIBE memo;
