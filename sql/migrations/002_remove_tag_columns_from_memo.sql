-- Migration: memo 테이블에서 tag1, tag2 컬럼 삭제
-- Date: 2025-12-11
-- Description: 감정 태그 컬럼 제거 (automaticThoughts 시스템으로 대체)

-- 트랜잭션 시작
START TRANSACTION;

-- memo 테이블에서 인덱스와 컬럼 삭제
ALTER TABLE memo
DROP INDEX idx_memo_tag1,
DROP INDEX idx_memo_tag2,
DROP COLUMN tag1,
DROP COLUMN tag2;

-- 커밋
COMMIT;

-- 확인
DESCRIBE memo;
