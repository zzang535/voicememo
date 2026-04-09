import mysql from 'mysql2/promise';

// 커넥션 에러로 간주할 에러 코드 목록
const CONNECTION_ERROR_CODES = new Set([
  'ER_CON_COUNT_ERROR',
  'ECONNREFUSED',
  'PROTOCOL_CONNECTION_LOST',
  'ECONNRESET',
  'ETIMEDOUT',
]);

function isConnectionError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const code = (error as { code?: string }).code;
    if (code && CONNECTION_ERROR_CODES.has(code)) {
      return true;
    }
  }
  return false;
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 5000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// globalThis 싱글톤 — Next.js HMR 시 모듈이 재평가되어도 풀 참조 유지
declare global {
  // eslint-disable-next-line no-var
  var __voicememo_pool: mysql.Pool | undefined;
}

function getOrCreatePool(): mysql.Pool {
  if (!globalThis.__voicememo_pool) {
    console.log('Creating new connection pool...');
    globalThis.__voicememo_pool = mysql.createPool(dbConfig);
    console.log('Connection pool created');
  }
  return globalThis.__voicememo_pool;
}

// 풀을 교체한다. 기존 풀은 drain 후 종료 시도하되 실패해도 진행.
async function resetPool(): Promise<void> {
  const oldPool = globalThis.__voicememo_pool;
  globalThis.__voicememo_pool = undefined;

  if (oldPool) {
    try {
      await oldPool.end();
    } catch {
      // 이미 끊긴 커넥션이 있을 수 있으므로 에러는 무시
    }
  }

  console.log('Connection pool reset. New pool will be created on next query.');
}

function getPool(): mysql.Pool {
  return getOrCreatePool();
}

export async function connectDB() {
  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return currentPool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export async function executeQuery(query: string, params: unknown[] = []) {
  const maxRetries = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Query attempt ${attempt}/${maxRetries}`);
      const currentPool = getPool();
      const [results] = await currentPool.execute(query, params);

      if (attempt > 1) {
        console.log(`Query succeeded on attempt ${attempt}`);
      }

      return results;
    } catch (error) {
      console.error(`Query execution failed (attempt ${attempt}/${maxRetries}):`, error);
      lastError = error;

      // 커넥션 에러인 경우에만 풀 리셋 후 재시도
      if (isConnectionError(error)) {
        await resetPool();

        if (attempt < maxRetries) {
          const waitTime = 1000 * attempt;
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      } else {
        // SQL 문법 오류 등 커넥션과 무관한 에러는 즉시 throw
        throw error;
      }
    }
  }

  console.error(`Query failed after ${maxRetries} attempts`);
  throw lastError;
}

export async function closeDB() {
  try {
    if (globalThis.__voicememo_pool) {
      await globalThis.__voicememo_pool.end();
      globalThis.__voicememo_pool = undefined;
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

export default getPool;
