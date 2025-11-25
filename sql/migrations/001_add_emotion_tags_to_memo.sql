-- Migration: memo 테이블에 감정 태그 컬럼 추가
-- Date: 2025-11-25
-- Description: 사용자가 메모에 감정 태그를 추가할 수 있도록 tag1, tag2 컬럼 추가

-- 트랜잭션 시작
START TRANSACTION;

-- memo 테이블에 감정 태그 컬럼 추가
ALTER TABLE memo
ADD COLUMN tag1 VARCHAR(50) NULL COMMENT '첫 번째 감정 태그 코드 (예: MILD_ANXIETY)' AFTER content,
ADD COLUMN tag2 VARCHAR(50) NULL COMMENT '두 번째 감정 태그 코드 (예: MENTAL_CLARITY)' AFTER tag1;

-- 인덱스 추가 (감정 태그로 검색할 수 있도록)
CREATE INDEX idx_memo_tag1 ON memo(tag1);
CREATE INDEX idx_memo_tag2 ON memo(tag2);

-- 커밋
COMMIT;

-- 확인
DESCRIBE memo;
