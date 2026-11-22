# Semmelweis Pharm Guide

세멜바이즈 대학교(Semmelweis University) 약학대학 입학부터 졸업까지의 과정을 정리한 비공식 한국어 가이드 웹사이트입니다.

- 🔗 사이트: `docs/` 폴더 기반 정적 페이지 (GitHub Pages 배포 대상)
- 🌐 대상: 세멜바이즈 약학대학 진학을 준비하거나 재학 중인 한국어 사용자

## 구성

| 페이지 | 내용 |
| --- | --- |
| `docs/index.html` | 메인 홈 — 5년 10학기 과정 한눈에 보기 |
| `docs/admission.html` | 입학 준비 — 합격 수락, 납부, 서류, 등록 |
| `docs/study.html` | 학업 로드맵 — 학년별 과목과 시험 루틴 |
| `docs/graduation.html` | 졸업 설계 — 실습, 논문, 최종시험 |
| `docs/life.html` | 현지 생활 — 주거, 체류, 건강, 예산 |
| `docs/costs.html` | 비용 안내 및 계산기 (`docs/assets/costs.js`) |
| `docs/resources.html` | 참고 자료 모음 |

## 접근 제한

이 사이트는 초대받은 사용자를 위한 정보 공간으로, 간단한 접속 코드 게이트를 사용합니다.

- 구현: `docs/assets/site.js`의 `initAuth()` / `unlock()`
- 설정: `docs/config/access.json`에 접속 코드의 **SHA-256 해시**만 저장 (평문 비밀번호는 저장하지 않음)
- 동작: 입력한 코드를 브라우저에서 SHA-256으로 해시한 뒤 `access.json`의 `digests` 값(배열)에 포함되어 있으면 일치로 간주하고 `sessionStorage`에 접근 허용 상태를 기록
- 기본 접속 코드는 2개입니다: `hjoon0510`, `guest2848` (둘 다 유효)

> ⚠️ 정적 사이트의 간단한 접근 제한이며, 민감정보 보호 목적이 아닙니다. 해시가 클라이언트에 노출되므로 진짜 보안 경계로 사용하지 마세요.

### 접속 코드 변경 방법

1. 새 코드를 정합니다.
2. SHA-256 해시를 계산합니다.
   ```bash
   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('새코드').digest('hex'))"
   ```
3. `docs/config/access.json`의 `digest` 값을 교체하고 `version`을 올립니다.
   - 현재 스키마는 `digests` 배열에 여러 개의 해시를 담을 수 있습니다(지금은 2개).

### 빌드 시 자동 생성 (GitHub Actions)

`.github/workflows/deploy-pages.yml` 워크플로우가 `main`에 푸시될 때마다 (또는 수동 실행 시)
`docs/config/access.json`을 **자동으로 다시 생성**한 뒤 GitHub Pages로 배포합니다.

- 저장소 **Settings → Secrets and variables → Actions → Variables**에서
  `ACCESS_CODE_1`, `ACCESS_CODE_2` 변수를 설정하면 해당 값으로 해시가 생성됩니다.
- 변수를 설정하지 않으면 기본값(`hjoon0510`, `guest2848`)으로 생성됩니다.
- 즉, 코드를 바꾸고 싶으면 파일을 직접 수정할 필요 없이 저장소 Variables 값만 바꾸고
  `main`에 푸시(또는 워크플로우 수동 실행)하면 됩니다.
- GitHub Pages 배포 소스를 **Settings → Pages → Build and deployment → Source: GitHub Actions**로
  설정해야 이 워크플로우가 배포를 담당합니다.

## 주의사항

이 사이트는 업로드된 안내 자료를 바탕으로 만든 **비공식 요약**입니다. 금액·기한·교육과정·체류 규정은 바뀔 수 있으므로, 실제 신청과 납부 전에는 반드시 대학 및 헝가리 관계 기관의 최신 공지를 확인하세요.

## 라이선스 / 기여

개인용 비공식 가이드 프로젝트입니다. 오탈자나 최신 정보 반영 제안은 이슈 또는 PR로 남겨주세요.
