/**
 * user_id_sequence 테이블 설정 스크립트
 *
 * 실행 방법:
 * node scripts/setup-user-id-sequence.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setupUserIdSequence() {
  let connection;

  try {
    console.log('🔌 데이터베이스 연결 중...');

    // 데이터베이스 연결
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    console.log('✅ 데이터베이스 연결 성공');

    // 1. 테이블 생성
    console.log('\n📋 user_id_sequence 테이블 생성 중...');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_id_sequence (
        id INT AUTO_INCREMENT PRIMARY KEY,
        number VARCHAR(4) NOT NULL UNIQUE COMMENT '0001 ~ 9999 형식의 4자리 숫자',
        is_used BOOLEAN DEFAULT FALSE COMMENT '사용 여부',
        assigned_user_id VARCHAR(255) NULL COMMENT '할당된 실제 유저 ID (예: dragon-0001)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_is_used (is_used),
        INDEX idx_number (number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='유저 ID 생성을 위한 시퀀스 관리 테이블'
    `);

    console.log('✅ 테이블 생성 완료');

    // 2. 기존 데이터 확인
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM user_id_sequence');
    const existingCount = rows[0].count;

    if (existingCount > 0) {
      console.log(`\n⚠️  이미 ${existingCount}개의 시퀀스가 존재합니다.`);
      console.log('기존 데이터를 유지합니다.');
      return;
    }

    // 3. 0001~9999 데이터 삽입
    console.log('\n📝 0001~9999 시퀀스 데이터 삽입 중...');
    console.log('(이 작업은 약 10~30초 소요됩니다)');

    await connection.query('START TRANSACTION');

    try {
      // 배치로 삽입 (성능 향상)
      const batchSize = 100;
      for (let i = 1; i <= 9999; i += batchSize) {
        const values = [];
        const placeholders = [];

        for (let j = i; j < i + batchSize && j <= 9999; j++) {
          const number = String(j).padStart(4, '0');
          values.push(number, false);
          placeholders.push('(?, ?)');
        }

        const query = `INSERT INTO user_id_sequence (number, is_used) VALUES ${placeholders.join(', ')}`;
        await connection.execute(query, values);

        // 진행 상황 표시
        if (i % 1000 === 1) {
          console.log(`  - ${i}~${Math.min(i + 999, 9999)} 삽입 중...`);
        }
      }

      await connection.query('COMMIT');
      console.log('✅ 9999개 시퀀스 삽입 완료');

    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    }

    // 4. 결과 확인
    const [result] = await connection.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_used = FALSE THEN 1 ELSE 0 END) as available
      FROM user_id_sequence
    `);

    console.log('\n📊 설정 완료:');
    console.log(`  - 총 시퀀스 수: ${result[0].total}`);
    console.log(`  - 사용 가능: ${result[0].available}`);
    console.log(`  - 사용됨: ${result[0].total - result[0].available}`);

  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    throw error;

  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 데이터베이스 연결 종료');
    }
  }
}

// 스크립트 실행
setupUserIdSequence()
  .then(() => {
    console.log('\n✅ 설정 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 설정 실패:', error);
    process.exit(1);
  });
