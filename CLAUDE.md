# voicememo 프로젝트 개발 규칙

## 📋 버전 히스토리 관리 규칙

**main 브랜치에 push하기 전에 반드시 버전 히스토리를 업데이트해야 합니다.**

### 필수 작업 순서

1. **dev 브랜치에서 작업 완료 및 커밋**
2. **main 브랜치로 merge 전에 버전 히스토리 업데이트**:
   - `version-history.json` 파일에 새 버전 정보 추가
   - 버전 정보를 커밋
3. **main 브랜치로 merge 및 push**

### 버전 정보 형식

```json
{
  "version": "X.Y.Z",
  "note": "작업 내용 요약",
  "date": "YYYY-MM-DDTHH:mm:ss+09:00"
}
```

### 버전 번호 규칙 (Semantic Versioning)

- **Major (X.0.0)**: 대규모 기능 변경 또는 breaking changes
- **Minor (0.Y.0)**: 새로운 기능 추가
- **Patch (0.0.Z)**: 버그 수정 또는 소소한 개선

### 작업 플로우

```bash
# 1. dev 브랜치에서 작업 완료
git add .
git commit -m "feat: 새로운 기능"
git push

# 2. version-history.json 업데이트
# (버전 정보 추가)

# 3. 버전 히스토리 커밋 (dev 브랜치에서)
git add version-history.json
git commit -m "chore: 버전 X.Y.Z 릴리스 준비"
git push

# 4. main 브랜치로 체크아웃
git checkout main

# 5. dev 브랜치 merge
git merge dev

# 6. main 브랜치 push
git push
```

### 예시

```json
{
  "versions": [
    {
      "version": "1.1.0",
      "note": "메모 분석 기능 개선 및 네비게이션 플로우 개선 - reasoning 필드 추가, promptsV4 추가, 네비게이션 하드코딩",
      "date": "2024-12-17T18:00:00+09:00"
    },
    {
      "version": "1.0.3",
      "note": "노트 목록 안내문구 수정",
      "date": "2025-01-16T14:30:00+09:00"
    }
  ]
}
```

---

## 🚨 중요 사항

- **절대로 버전 히스토리 없이 main에 push하지 말 것**
- 버전 히스토리는 사용자에게 보이는 변경 이력입니다
- 명확하고 이해하기 쉬운 설명을 작성하세요
