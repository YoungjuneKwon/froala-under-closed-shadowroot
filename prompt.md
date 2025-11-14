# closed shadow root 아래에서 froala editor 의 table 편집 기능이 동작하지 않는 문제 해결
## 문제 상황
- froala editor 가 closed shadow root 내부에 위치할 때, 테이블 편집 기능(예: 셀 병합, 행/열 추가 등)이 정상적으로 작동하지 않는 문제가 발생함.
- 이는 froala editor 가 DOM 트리를 탐색할 때 closed shadow root 내부의 요소에 접근할 수 없기 때문임.
## 목표
- froala editor 가 closed shadow root 내부에서도 테이블 편집 기능을 정상적으로 사용할 수 있도록 수정.
## 주의사항
- closed shadow root 아래에서 froala editor 가 정상 동작 하도록 함을 목표로 함
- closed shadow root 를 open 으로 변경하면 안됨
- froala 에서 제공하는 테이블 편집 기능이 정상 출력됨을 목표로 함
- 자체 제작하는 테이블 편집 기능을 작성하면 안됨
## 해결을 위해 반드시 참고해야 하는 자료
- froala editor 공식 문서: https://froala.com/wysiwyg-editor/docs/
- Shadow DOM 및 closed shadow root 관련 자료: https://developer.mozilla.org/en-US/docs/Web
- froala editor table plugin 해설 자료 : https://froala.com/wysiwyg-editor/docs/plugins/table-plugin/
- index.html, script.js
## 확인 방법
- 가상 환경을 구축하여 index.html 파일을 가상 브라우저에서 열어서, 우측 closed shadow root 내부에 작성된 froala editor 의 table 위에 마우스 커서 호버 시 테이블 편집 영역 (노란색 사각형) 이 정상 적으로 표시되는지 확인.
- 필요하면 package.json 을 구성하여 필요 패키지 설치
## 해결 절차
- index.html, script.js 분석
  - froala editor 초기화 코드 및 테이블 편집 기능 관련 코드를 확인.
  - closed shadow root 내부에 froala editor 가 위치하는 구조 파악.
- script.js 수정
  - froala editor 초기화 시, closed shadow root 내부에서도 테이블 편집 기능이 동작할 수 있도록 설정 추가.
  - froala editor 의 테이블 편집 기능이 closed shadow root 내부 요소에 접근할 수 있도록 커스텀 이벤트 리스너 추가.
  - 필요하면 shadow root 외부에 froala editor 를 위해 필요한 css 스타일을 주입하는 코드 추가.
- 확인 방법으로 확인하여 문제가 해결 될 때까지 다양한 수정 시도