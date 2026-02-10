---
name: TabsVault 개발 가이드
description: TabsVault 프로젝트 개발 시 필요한 기술적 가이드 및 API 연동 방법
---

# TabsVault 개발 기술 가이드

## 핵심 기술 스택
- **프론트엔드**: React (Vite), Tailwind CSS
- **백엔드/DB**: Supabase
- **AI**: Gemini Pro (Google Generative AI)
- **API**: Chrome Tabs API, Notion API

## 주요 구현 규칙
1. **탭 감지**: `chrome.tabs.query`를 사용하여 주기적으로 또는 이벤트 기반으로 탭 수를 확인합니다.
2. **AI 분류**:
    - 프롬프트 구성 시 페이지 제목과 메타 설명을 포함합니다.
    - JSON 형태로 응답을 받아 React 상태에 반영합니다.
3. **Notion 연동**:
    - Notion Official SDK를 사용하며, API 키는 사용자 설정을 통해 입력받습니다.
    - `page` 생성 API를 호출하여 DB에 레코드를 추가합니다.

## 디버깅 가이드
- 브라우저 익스텐션 환경이므로 `console.log`가 백그라운드 페이지와 팝업 페이지에서 다르게 나타날 수 있음에 유의하세요.
- API 호출 오류 시 `network` 탭을 확인하여 페이로드를 검증하세요.
