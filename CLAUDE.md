# Claude Code Instructions

## Commit Message Rules

**All commit messages must be written in Korean (한글)**
- Use Korean for commit titles and descriptions
- Keep the existing format with 🤖 Generated with Claude Code footer
- Example: "MySQL 데이터베이스 연동 및 서비스 정보 표시 기능 추가"

## Version Management Rules

When performing version updates (`version up` command):

1. **Always update package.json version** (e.g., 0.1.0 → 0.2.0)
2. **Update version in service info page**: Update the version display in the service info page (`src/app/settings/version/page.tsx`) to include:
   - New version number in both places (앱 버전 section and 서비스 정보 section)
   - One-sentence description of what was added/changed in this version (앱 버전 section)
3. **Commit with proper message** including version details
4. **Push to remote repository**

### Version Update Locations
- `src/app/settings/version/page.tsx`: Update version in 앱 버전 section (v0.x.0) and 서비스 정보 section
- Update the description text in 앱 버전 section with changes summary

### Example
- v0.9.0: "설정 메뉴에 고객센터, 개인정보처리방침, 이용약관 페이지 추가"
- v1.0.0: "음성 인식 정확도 개선 및 UI/UX 최적화"

This ensures users can see what's new in each version in the service info page.

## Build Rules

**DO NOT run `npm run build` automatically**
- Only run build when explicitly requested by the user
- The development machine has memory constraints that cause build slowdowns
- Focus on code changes and commit/push without automatic build verification
- User will manually run builds when needed