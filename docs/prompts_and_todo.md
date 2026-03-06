# 📄 Prompts & Todo List (Updated for Normalized Architecture)

## 📋 완료된 주요 작업 (2026-03-05 ~ 06)

| # | 목적 | 결과물 | 상태 |
|---|------|--------|------|
| 1 | **Supabase 스키마 v1** | `schema.sql` (users, source_data, review_results) | ✅ 완료 |
| 2 | **환경 변수 파일** | `.env` 및 `supabaseClient.js` | ✅ 완료 |
| 3 | **로그인 UI & 로직** | `src/auth/login.html`, `src/auth/login.js` | ✅ 완료 |
| 4 | **랜덤 이미지 RPC 호출** | `app.js` (fetchRandomImage) | ✅ 완료 |
| 5 | **데이터 렌더링** | `app.js` (loadSourceData) | ✅ 완료 |
| 6 | **Lens Zoom 고도화** | CSS 변수 제어 및 렌즈 효과 개선 | ✅ 완료 |
| 7 | **자동 저장 (UPSERT)** | 2초 debounce 자동 저장 로직 적용 | ✅ 완료 |
| 8 | **세션 타이머 및 최종 제출** | `startSession`, `endSession`, `markImageCompleted` | ✅ 완료 |
| 9 | **실시간 대시보드** | `src/dashboard/` (Realtime 통계 표시) | ✅ 완료 |
| 10 | **구조 리팩토링 (SoC)** | `src/`, `db/`, `docs/` 폴더 기반 관심사 분리 | ✅ 완료 |
| 11 | **DB 정규화 (v2)** | `images`, `image_contents` 테이블로 구조 최적화 | ✅ 완료 |
| 12 | **애플 스타일 UI (Work)** | 다이내믹 아일랜드형 D-Day 뱃지, 스켈레톤 UI | ✅ 완료 |
| 13 | **진행도 정밀 추적** | `user_progress` (이미지 단위) & `line_evaluations` (라인 단위) | ✅ 완료 |
| 14 | **테스트 선택 UI 고도화** | 미니 진행률 바 및 D-Day 뱃지 카드 적용 | ✅ 완료 |

## ✅ Todo List (Current Status)

### 1단계: 기반 시스템 구축 (100% 완료)
- [x] **Supabase 설정** – `src/api/supabase.js`에 설정 통합 (완료).
- [x] **로컬 서버** – `npm start` (npx -y serve .) 설정 (완료).
- [x] **로그인 흐름** – `login.js`로 사용자 검색 및 세션 저장 (완료).

### 2단계: 핵심 기능 고도화 (100% 완료)
- [x] **DB 정규화 적용** – `images` & `image_contents` 기반 조인 쿼리 수정 (완료).
- [x] **데이터 이관** – `migration_and_cleanup.sql`을 통한 데이터 정제 (완료).
- [x] **동적 줌 렌즈** – `app.js` 내 마우스 좌표 기반 렌즈 이동 (완료).
- [x] **자동 저장** – 개별 라인별 Dirty 체크 및 자동 저장 (완료).
- [x] **실시간 진행률** – 라인별 검수 카운팅을 통한 시각적 피드백 강화 (완료).

### 3단계: 테스트 및 안정화 (80% 진행)
- [ ] **유닛 테스트** – `tests/app.test.js`에 세션 시간 계산 및 줌 로직 테스트 추가.
- [ ] **스크립트 좌표 매핑** – `SCRIPT_MAP`을 통한 클릭 시 이미지 위치 이동 기능 고도화.
- [x] **접근성 검토** – `ACCESSIBILITY.md` 항목별 초기 적용 (완료).
- [x] **정적 배포 최적화** – Vercel 배포를 위한 대소문자 및 경로 전수 보정 (완료).

---
*Last Updated: 2026-03-06 at 19:22 KST*
