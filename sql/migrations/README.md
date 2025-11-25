# Database Migrations

이 디렉토리에는 데이터베이스 스키마 변경을 위한 마이그레이션 파일이 있습니다.

## ⚠️ 중요: 마이그레이션 전 백업 필수!

**모든 마이그레이션 실행 전에 반드시 데이터베이스를 백업해야 합니다.**

### 백업 방법

```bash
# 백업 디렉토리 생성
mkdir -p sql/backups

# 전체 데이터베이스 백업 (권장)
mysqldump -h localhost -u root -p voicememo > sql/backups/voicememo_backup_$(date +%Y%m%d_%H%M%S).sql

# 특정 테이블만 백업 (예: memo 테이블)
mysqldump -h localhost -u root -p voicememo memo > sql/backups/memo_backup_$(date +%Y%m%d_%H%M%S).sql

# 프로덕션 환경 백업
mysqldump -h [production-host] -u [username] -p [database] > sql/backups/production_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 백업 복원 (문제 발생 시)

```bash
# 백업 파일로 복원
mysql -h localhost -u root -p voicememo < sql/backups/voicememo_backup_20251125_143000.sql
```

## 마이그레이션 실행 방법

### 로컬 환경

```bash
# .env.local 파일의 환경 변수 사용
mysql -h $DB_HOST -P $DB_PORT -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE < sql/migrations/001_add_emotion_tags_to_memo.sql
```

또는 직접 입력:

```bash
mysql -h localhost -P 3306 -u root -p voicememo < sql/migrations/001_add_emotion_tags_to_memo.sql
```

### 프로덕션 환경

프로덕션 데이터베이스에 직접 연결하여 실행:

```bash
mysql -h [production-host] -u [username] -p [database] < sql/migrations/001_add_emotion_tags_to_memo.sql
```

## 마이그레이션 이력

### 001_add_emotion_tags_to_memo.sql
- **날짜**: 2025-11-25
- **설명**: memo 테이블에 감정 태그 컬럼 추가 (tag1, tag2)
- **변경사항**:
  - `tag1` 컬럼 추가 (VARCHAR(50), NULL 허용)
  - `tag2` 컬럼 추가 (VARCHAR(50), NULL 허용)
  - `idx_memo_tag1`, `idx_memo_tag2` 인덱스 추가

## 마이그레이션 실행 체크리스트

마이그레이션 실행 전 반드시 다음 단계를 따르세요:

- [ ] **1단계: 백업** - 데이터베이스 전체 백업 완료
- [ ] **2단계: 로컬 테스트** - 로컬 환경에서 마이그레이션 테스트
- [ ] **3단계: 검증** - 테이블 구조 및 데이터 확인
- [ ] **4단계: 프로덕션 백업** - 프로덕션 DB 백업 (프로덕션 적용 시)
- [ ] **5단계: 프로덕션 적용** - 프로덕션에 마이그레이션 실행
- [ ] **6단계: 최종 검증** - 프로덕션 환경 정상 작동 확인

## 마이그레이션 작성 규칙

1. **백업 필수**: 마이그레이션 실행 전 항상 백업
2. **파일명 형식**: `{번호}_{설명}.sql` (예: `001_add_emotion_tags_to_memo.sql`)
3. **트랜잭션 사용**: 모든 변경사항은 트랜잭션으로 감싸기
4. **롤백 가능**: 실패 시 자동 롤백되도록 작성
5. **주석 필수**: 마이그레이션 목적과 변경사항 명시
6. **테스트**: 로컬에서 먼저 테스트 후 프로덕션 적용
7. **백업 보관**: 백업 파일은 최소 30일 이상 보관

## 마이그레이션 확인

마이그레이션 실행 후 확인:

```sql
-- 테이블 구조 확인
DESCRIBE memo;

-- 인덱스 확인
SHOW INDEX FROM memo;

-- 데이터 확인
SELECT * FROM memo LIMIT 5;
```
