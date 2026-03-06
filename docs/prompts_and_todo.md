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

## ✅ Todo List (Current Status)

### 1단계: 기반 시스템 구축 (100% 완료)
- [x] **Supabase 설정** – `src/api/supabase.js`에 설정 통합 (완료).
- [x] **로컬 서버** – `npm start` (npx -y serve .) 설정 (완료).
- [x] **로그인 흐름** – `login.js`로 사용자 검색 및 세션 저장 (완료).

### 2단계: 핵심 기능 고도화 (90% 진행)
- [x] **DB 정규화 적용** – `images` & `image_contents` 기반 조인 쿼리 수정 (완료).
- [x] **데이터 이관** – `migration_and_cleanup.sql`을 통한 데이터 정제 (완료).
- [x] **동적 줌 렌즈** – `app.js` 내 마우스 좌표 기반 렌즈 이동 (완료).
- [x] **자동 저장** – 개별 라인별 Dirty 체크 및 자동 저장 (완료).

### 3단계: 테스트 및 안정화 (60% 진행)
- [ ] **유닛 테스트** – `tests/app.test.js`에 세션 시간 계산 및 줌 로직 테스트 추가.
- [ ] **스크립트 좌표 매핑** – `SCRIPT_MAP`을 통한 클릭 시 이미지 위치 이동 기능 고도화.
- [x] **접근성 검토** – `ACCESSIBILITY.md` 항목별 초기 적용 (완료).
- [ ] **최종 빌드 및 배포** – 정적 배포(Vercel 등) 환경 테스트.

### 4단계: 추가 요구 사항 및 유지 보수
- [ ] **다국어 추가 지원** – 신규 언어(예: 베트남어, 태국어) 컬럼 추가 및 테스트.
- [ ] **관리자 전용 페이지** – 사용자 생성 및 검수 진행률 시각화(관리자용) 추가 개발.
- [ ] **다크/라이트 모드** – CSS 변수를 통한 테마 전환 토글 추가.

---
*Last Updated: 2026-03-06 at 15:52 KST*
