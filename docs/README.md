# Antigravity 검수 UI (Refactored & Normalized)

## 프로젝트 개요
Antigravity는 **이미지 검수** 작업을 위한 프리미엄 웹 어플리케이션입니다. 고해상도 이미지와 다국어 스크립트 데이터를 효율적으로 매칭하고 검수할 수 있는 최적의 UI/UX를 제공합니다.

### 주요 기능
- **DB 정규화 (v2)** – 이미지 마스터(`images`)와 대사 상세(`image_contents`) 분리로 데이터 중복 제거 및 관리 효율화
- **관심사 분리 (SoC)** – 기능별 폴더 구조 리팩토링으로 유지보수성 향상
- **동적 세션 타이머** – 작업 시작·종료 시각 및 실제 작업 시간을 초 단위로 기록
- **스마트 랜덤 이미지** – 아직 검수되지 않은 이미지를 무작위로 자동 할당
- **Lens Zoom** – 마우스 호버 시 실시간으로 이미지를 확대하는 원형 렌즈 UI
- **실시간 대시보드** – Supabase Realtime을 활용한 현재 작업자 및 통계 모니터링
- **프리미엄 디자인** – 글래스모피즘, 다크 모드, 부드러운 애니메이션 적용

## 폴더 구조
```text
checktranslate/
├─ index.html               # 메인 엔트리 (검수 화면)
├─ package.json             # 의존성 및 스크립트 설정
├─ .env                     # 환경 변수 (Supabase URL/Key - 로컬 참고용)
│
├─ src/                     # 소스 코드
│  ├─ auth/                 # 로그인 관련 (login.html, login.js)
│  ├─ dashboard/            # 모니터링 대시보드 (html, js, css)
│  ├─ api/                  # Supabase 통신 및 DB 라이브러리 (supabase.js)
│  ├─ styles/               # 전역 공통 CSS (styles.css)
│  ├─ utils/                # 공통 유틸리티 (toast.js, generate_codes.js)
│  └─ app.js                # 메인 비즈니스 로직 (세션, 줌, 데이터 로드)
│
├─ db/                      # 데이터베이스 관리
│  ├─ schema_v2.sql         # 최신 정규화 스키마
│  └─ migration_and_cleanup.sql # 데이터 이관 및 정리 스크립트
│
└─ docs/                    # 프로젝트 문서
   ├─ README.md             # 프로젝트 개요 (현재 파일)
   ├─ prompts_and_todo.md   # 작업 이력 및 할 일 목록
   └─ ACCESSIBILITY.md      # 웹 접근성 가이드라인
```

## 데이터베이스 구조 (Normalization v2)
1. **`images`**: 이미지 ID와 URL 저장
2. **`image_contents`**: 각 이미지에 속한 번역 텍스트 (korean, english, espanol 등)
3. **`users`**: 사용자 코드, 할당 언어, 완료 목록 정보
4. **`review_results`**: 사용자별/이미지별/라인별 최종 검수 결과 및 시간 기록

## 실행 및 설치
1. **의존성 설치**
   ```bash
   npm install
   ```
2. **Supabase 설정**
   - [src/api/supabase.js](file:///c:/Users/nohky/OneDrive/문서/antigravity/checktranslate/src/api/supabase.js) 파일의 `SUPABASE_URL`과 `SUPABASE_ANON_KEY`를 실제 프로젝트 값으로 수정합니다.
3. **로컬 실행**
   ```bash
   npm start
   ```
   - 메인 페이지: `http://localhost:3000/`
   - 로그인 페이지: `http://localhost:3000/src/auth/login.html`

## 개발 가이드
- **데이터 이관**: 기존 테이블에서 새 구조로 데이터를 옮기려면 `db/migration_and_cleanup.sql`을 실행하세요.
- **스타일 수정**: `src/styles/styles.css`에서 `--lens-size`, `--zoom-level` 등 CSS 변수를 통해 UI를 커스터마이징할 수 있습니다.
- **테스트**: `npm test`를 통해 핵심 로직의 무결성을 확인합니다.

## Vercel Deployment Guide

1. **Project Import**: Import your repository to [Vercel](https://vercel.com).
2. **Environment Variables**: Go to Project Settings -> Environment Variables and add the following keys:
   - `VITE_SUPABASE_URL`: Your Supabase URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - *Note*: Ensure the keys match exactly as they appear in your `.env` file (prefixed with `VITE_` for Vite support).
3. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **404 Handling**: The `vercel.json` file in the root directory ensures all routes fallback to `index.html` for smooth navigation.

---
*Last Updated: 2026-03-06*
