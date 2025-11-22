-- 0001 ~ 9999 전체 시퀀스 삽입 스크립트
-- 실행 방법: mysql -u [username] -p [database] < insert_all_sequences.sql

-- 트랜잭션 시작
START TRANSACTION;

-- 0001 ~ 0100
INSERT INTO user_id_sequence (number, is_used) VALUES
('0001', FALSE), ('0002', FALSE), ('0003', FALSE), ('0004', FALSE), ('0005', FALSE),
('0006', FALSE), ('0007', FALSE), ('0008', FALSE), ('0009', FALSE), ('0010', FALSE),
('0011', FALSE), ('0012', FALSE), ('0013', FALSE), ('0014', FALSE), ('0015', FALSE),
('0016', FALSE), ('0017', FALSE), ('0018', FALSE), ('0019', FALSE), ('0020', FALSE),
('0021', FALSE), ('0022', FALSE), ('0023', FALSE), ('0024', FALSE), ('0025', FALSE),
('0026', FALSE), ('0027', FALSE), ('0028', FALSE), ('0029', FALSE), ('0030', FALSE),
('0031', FALSE), ('0032', FALSE), ('0033', FALSE), ('0034', FALSE), ('0035', FALSE),
('0036', FALSE), ('0037', FALSE), ('0038', FALSE), ('0039', FALSE), ('0040', FALSE),
('0041', FALSE), ('0042', FALSE), ('0043', FALSE), ('0044', FALSE), ('0045', FALSE),
('0046', FALSE), ('0047', FALSE), ('0048', FALSE), ('0049', FALSE), ('0050', FALSE),
('0051', FALSE), ('0052', FALSE), ('0053', FALSE), ('0054', FALSE), ('0055', FALSE),
('0056', FALSE), ('0057', FALSE), ('0058', FALSE), ('0059', FALSE), ('0060', FALSE),
('0061', FALSE), ('0062', FALSE), ('0063', FALSE), ('0064', FALSE), ('0065', FALSE),
('0066', FALSE), ('0067', FALSE), ('0068', FALSE), ('0069', FALSE), ('0070', FALSE),
('0071', FALSE), ('0072', FALSE), ('0073', FALSE), ('0074', FALSE), ('0075', FALSE),
('0076', FALSE), ('0077', FALSE), ('0078', FALSE), ('0079', FALSE), ('0080', FALSE),
('0081', FALSE), ('0082', FALSE), ('0083', FALSE), ('0084', FALSE), ('0085', FALSE),
('0086', FALSE), ('0087', FALSE), ('0088', FALSE), ('0089', FALSE), ('0090', FALSE),
('0091', FALSE), ('0092', FALSE), ('0093', FALSE), ('0094', FALSE), ('0095', FALSE),
('0096', FALSE), ('0097', FALSE), ('0098', FALSE), ('0099', FALSE), ('0100', FALSE)
ON DUPLICATE KEY UPDATE number=number;

-- 나머지는 프로시저로 생성 (더 효율적)
DELIMITER //

DROP PROCEDURE IF EXISTS InsertSequences//
CREATE PROCEDURE InsertSequences()
BEGIN
    DECLARE i INT DEFAULT 101;

    WHILE i <= 9999 DO
        INSERT IGNORE INTO user_id_sequence (number, is_used)
        VALUES (LPAD(i, 4, '0'), FALSE);
        SET i = i + 1;
    END WHILE;
END//

DELIMITER ;

-- 프로시저 실행
CALL InsertSequences();

-- 프로시저 삭제 (정리)
DROP PROCEDURE IF EXISTS InsertSequences;

-- 커밋
COMMIT;

-- 확인
SELECT COUNT(*) as total_sequences FROM user_id_sequence;
SELECT COUNT(*) as available_sequences FROM user_id_sequence WHERE is_used = FALSE;
