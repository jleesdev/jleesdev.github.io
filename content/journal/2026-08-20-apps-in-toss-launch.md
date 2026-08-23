---
date: 2026-08-20
project: on-the-line
title_en: Launched On The Line as an Apps in Toss mini app
title_ko: 온더라인 앱인토스 미니앱 최초 출시
summary_ko: iOS 게임을 앱인토스 미니앱으로 포팅해 첫 출시.
summary_en: Ported the iOS game to an Apps in Toss mini app and shipped the first build.
tags: [Unity, WebGL, Apps in Toss]
visibility: public
---

<!-- lang:ko -->
iOS로 서비스하던 온더라인을 앱인토스 미니앱으로 포팅해 처음 출시했다.
Unity WebGL 빌드를 토스 웹뷰에 얹는 구조라, 네이티브에서는 신경 쓸 일이 없던 것들이 한꺼번에 문제가 됐다.

- 첫 심사 반려 — 표시 이름·아이콘이 콘솔 등록값과 달라 맞춰서 재제출
- 프로필 화면의 고정 픽셀 값을 화면 비율 기반으로 교체 — 기기 해상도마다 어긋나던 문제
- 모든 패널을 보드와 같은 오프셋으로 정렬
- 다음 조각 미리보기의 크기·세로 위치를 실기기 캡처 기준으로 보정
- Unity 스플래시 스크린 제거
- 닉네임 행 제거, vConsole 을 배포 빌드에서 제외

<!-- lang:en -->
Ported On The Line, previously an iOS title, to an Apps in Toss mini app and shipped the first build.
It runs as a Unity WebGL build inside the Toss webview, which surfaced a pile of problems that never came up on native.

- Rejected on first review — display name and icon did not match the console registration, fixed and resubmitted
- Fixed pixel values on the profile screen replaced with ratio-based layout, which had drifted across device resolutions
- Every panel aligned to the same offset as the board
- Size and vertical position of the next-piece preview retuned against real device captures
- Unity splash screen turned off
- Nickname row removed, vConsole excluded from release builds
