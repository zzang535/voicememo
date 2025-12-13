import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 타임아웃 설정 추가
  connectTimeout: 5000,        // 연결 수립 타임아웃: 5초
  acquireTimeout: 5000,        // Pool에서 연결 획득 타임아웃: 5초
  timeout: 5000,               // 쿼리 실행 타임아웃: 5초
  enableKeepAlive: true,       // Keep-alive 활성화
  keepAliveInitialDelay: 0,    // Keep-alive 즉시 시작
};

// Connection Pool 상태 관리
let pool: mysql.Pool | null = null;
let poolError = false;

// Pool 생성 함수
function createPool(): mysql.Pool {
  try {
    poolError = false;
    const newPool = mysql.createPool(dbConfig);
    console.log('✅ Connection pool created');
    return newPool;
  } catch (error) {
    console.error('❌ Failed to create pool:', error);
    poolError = true;
    throw error;
  }
}

// Pool 가져오기 (에러 시 재생성)
function getPool(): mysql.Pool {
  if (!pool || poolError) {
    console.log('🔄 Creating new connection pool...');
    pool = createPool();
  }
  return pool;
}

// Database connection function
export async function connectDB() {
  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return currentPool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    poolError = true;
    throw error;
  }
}

// Execute query function with retry logic
export async function executeQuery(query: string, params: unknown[] = []) {
  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Query attempt ${attempt}/${maxRetries}`);
      const currentPool = getPool();
      const [results] = await currentPool.execute(query, params);

      if (attempt > 1) {
        console.log(`✅ Query succeeded on attempt ${attempt}`);
      }

      return results;
    } catch (error) {
      console.error(`❌ Query execution failed (attempt ${attempt}/${maxRetries}):`, error);
      lastError = error;

      // Pool을 에러 상태로 표시하여 다음 시도 시 재생성
      poolError = true;

      // 현재 Pool 종료 시도 (무시해도 됨)
      if (pool) {
        try {
          await pool.end();
        } catch {
          // Pool 종료 실패는 무시
        }
        pool = null;
      }

      // 마지막 시도가 아니면 재시도 전 대기
      if (attempt < maxRetries) {
        const waitTime = 1000 * attempt; // 1초, 2초, 3초 점진적 증가
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }

  // 모든 재시도 실패
  console.error(`❌ Query failed after ${maxRetries} attempts`);
  throw lastError;
}

// Close database connection
export async function closeDB() {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
}

export default getPool;