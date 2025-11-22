-- 유저 ID 시퀀스 테이블 생성
CREATE TABLE IF NOT EXISTS user_id_sequence (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(4) NOT NULL UNIQUE COMMENT '0001 ~ 9999 형식의 4자리 숫자',
  is_used BOOLEAN DEFAULT FALSE COMMENT '사용 여부',
  assigned_user_id VARCHAR(255) NULL COMMENT '할당된 실제 유저 ID (예: dragon-0001)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_used (is_used),
  INDEX idx_number (number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='유저 ID 생성을 위한 시퀀스 관리 테이블';

-- 0001 ~ 9999 까지 초기 데이터 삽입
INSERT INTO user_id_sequence (number, is_used) VALUES
('0001', FALSE),
('0002', FALSE),
('0003', FALSE),
('0004', FALSE),
('0005', FALSE),
('0006', FALSE),
('0007', FALSE),
('0008', FALSE),
('0009', FALSE),
('0010', FALSE);
-- 나머지 9990개는 별도 스크립트로 삽입
