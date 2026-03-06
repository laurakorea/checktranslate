-- Final Consolidated Schema for LQA System

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. users 테이블 (시스템 사용자)
CREATE TABLE IF NOT EXISTS public.users (
    user_code      TEXT PRIMARY KEY,
    assigned_lang  TEXT NOT NULL,
    completed_images INT4[] DEFAULT '{}',
    daily_goal     INT NOT NULL DEFAULT 5
);

-- 2. tests 테이블 (관리자 -> 사용자 할당 시트)
CREATE TABLE IF NOT EXISTS public.tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code TEXT NOT NULL REFERENCES public.users(user_code) ON DELETE CASCADE,
    tour_id INT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 3. images 테이블 (원본 이미지 정보)
CREATE TABLE IF NOT EXISTS public.images (
    id             INT PRIMARY KEY,
    tour_id        INT,
    image_title    TEXT,
    image_url      TEXT NOT NULL
);

-- 4. image_contents 테이블 (라인별 원본/번역 데이터)
CREATE TABLE IF NOT EXISTS public.image_contents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id      INT NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
    line_id       INT NOT NULL,
    korean        TEXT NOT NULL,
    english       TEXT NOT NULL,
    espanol       TEXT,
    japanese      TEXT,
    french        TEXT,
    german        TEXT,
    chinese       TEXT,
    CONSTRAINT uq_image_id_line UNIQUE (image_id, line_id)
);

-- 5. line_evaluations 테이블 (사용자별 라인 검수 결과 저장)
CREATE TABLE IF NOT EXISTS public.line_evaluations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code     TEXT NOT NULL REFERENCES public.users(user_code) ON DELETE CASCADE,
    test_id       UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    image_id      INT NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
    line_id       INT NOT NULL,
    result        TEXT NOT NULL,          -- 예: NATURAL, AWKWARD 등
    detail        TEXT,                   -- 사용자가 별도로 입력한 상세 사유 등
    timestamp     TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_line_evaluations_conflict UNIQUE (user_code, image_id, line_id)
);

-- 6. review_sessions 테이블 (세션별 통계 - 보조)
CREATE TABLE IF NOT EXISTS public.review_sessions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code     TEXT NOT NULL REFERENCES public.users(user_code) ON DELETE CASCADE,
    image_id      INT NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
    start_timestamp TIMESTAMPTZ NOT NULL,
    end_timestamp   TIMESTAMPTZ,
    duration_sec    INT,
    CONSTRAINT uq_user_image_session UNIQUE (user_code, image_id)
);

-- 7. user_progress 테이블 (이미지별 완료 상태 - 캐시)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code     TEXT NOT NULL REFERENCES public.users(user_code) ON DELETE CASCADE,
    test_id       UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    image_id      INT NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
    is_completed  BOOLEAN DEFAULT FALSE,
    completed_at  TIMESTAMPTZ,
    CONSTRAINT uq_user_test_image UNIQUE (user_code, test_id, image_id)
);

-- 8. 인덱스 설정 (조회 속도 최적화)
CREATE INDEX IF NOT EXISTS idx_tests_user ON public.tests(user_code);
CREATE INDEX IF NOT EXISTS idx_images_tour ON public.images(tour_id);
CREATE INDEX IF NOT EXISTS idx_image_contents_image ON public.image_contents(image_id);
CREATE INDEX IF NOT EXISTS idx_line_evaluations_user ON public.line_evaluations(user_code);
CREATE INDEX IF NOT EXISTS idx_line_evaluations_image ON public.line_evaluations(image_id);
CREATE INDEX IF NOT EXISTS idx_line_evaluations_test ON public.line_evaluations(test_id);
