/* ACCESSIBILITY.md – WCAG 2.1 AA 체크리스트 */

# Antigravity 검수 UI 접근성 체크리스트

## 1. 색 대비 (Contrast)
- [ ] 텍스트와 배경 색상의 대비 비율이 최소 **4.5:1** (일반 텍스트) 또는 **3:1** (큰 텍스트) 이상인지 확인했습니다.
- [ ] 버튼·아이콘 색상 대비도 동일 기준을 만족합니다.

## 2. 키보드 내비게이션 (Keyboard Navigation)
- [ ] 모든 인터랙티브 요소(`button`, `a`, `input`)에 `tabindex`가 자연스럽게 순서대로 적용됩니다.
- [ ] `Enter`/`Space` 로 버튼 클릭이 가능하도록 `keydown` 이벤트를 처리했습니다.
- [ ] 포커스가 보이도록 `:focus-visible` 스타일을 적용했습니다.

## 3. ARIA 라벨링 (ARIA Labels)
- [ ] 이미지 확대 렌즈(`.lens`)에 `role="region"`와 `aria-label="이미지 확대 렌즈"`를 추가했습니다.
- [ ] 스크립트 타임라인 아이템에 `aria-label="스크립트 라인 {index}"`을 제공했습니다.
- [ ] 토스트 알림에 `role="alert"`와 `aria-live="assertive"`를 설정했습니다.

## 4. 텍스트 크기 및 확대 (Text Resize)
- [ ] `rem` 단위와 `font-size: var(--font-size, 1rem)`을 사용해 브라우저 확대 시 레이아웃이 깨지지 않도록 했습니다.
- [ ] 최소 200% 확대에서도 모든 내용이 가독성을 유지합니다.

## 5. 이미지 대체 텍스트 (Alt Text)
- [ ] 검수 이미지 `<img>`에 의미 있는 `alt` 텍스트가 제공됩니다 (`alt="검수 이미지"`).
- [ ] 아이콘 버튼에 `title` 속성을 사용해 의미를 전달합니다.

## 6. 동적 콘텐츠 알림 (Live Regions)
- [ ] 검수 완료·실패 시 토스트 알림을 `role="alert"` 로 표시해 스크린리더가 즉시 읽게 합니다.
- [ ] 실시간 대시보드 업데이트는 `aria-live="polite"` 영역에 삽입됩니다.

## 7. 폼 및 입력 오류 (Form Validation)
- [ ] 로그인 코드 입력 시 오류가 있으면 `aria-describedby` 로 오류 메시지를 연결합니다.
- [ ] 오류 발생 시 토스트 알림과 함께 포커스를 해당 입력 필드로 이동합니다.

## 8. 언어 선언 (Language Declaration)
- [ ] HTML `<html lang="ko">` 선언이 포함되어 있습니다.
- [ ] 다국어 지원을 위해 텍스트는 추후 i18n(예: `i18next`)으로 교체 가능하도록 구조화했습니다.

## 9. 테스트 커버리지 (Testing)
- [ ] Jest 테스트(`TESTS/app.test.js`)에서 타이머 로직과 토스트 호출을 검증합니다.
- [ ] 접근성 테스트 도구(axe-core)와 CI 연동을 권장합니다.

---
*Generated on 2026‑03‑05*
