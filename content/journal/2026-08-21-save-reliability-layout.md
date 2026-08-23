---
date: 2026-08-21
project: on-the-line
title_en: Save reliability, SDK 3.x, and layout measured against real devices
title_ko: 저장 안정성과 SDK 3.x 전환, 레이아웃 실측 대응
summary_ko: 앱을 나갔다 오면 진행이 되돌아가던 문제를 잡고, SDK 3.x 로 전환.
summary_en: Fixed progress rolling back after leaving the app, and moved to SDK 3.x.
tags: [Unity, WebGL, Apps in Toss]
visibility: public
---

<!-- lang:ko -->
게임 도중 앱을 나갔다 돌아오면 진행이 되돌아가 있다는 제보를 받고 저장 구조를 뜯어봤다.
저장이 "떠나는 순간을 잡아서 한 번 쓴다"에만 의존하고 있었는데, 토스 웹뷰는 백그라운드로 내려갈 때 JS 실행을 거의 즉시 멈춰서 그 한 번을 놓치면 판이 통째로 사라졌다.

- 이탈 이벤트에 기대지 않도록 한 수마다 저장, 이탈 신호도 focus / pagehide / visibilitychange 로 다중 확보
- 되돌리기 직후와 새 판 시작 직후에도 저장 — 취소한 수가 되살아나거나 옛 판이 뜨던 구간 차단
- 앱인토스 SDK 2.10.8 에서 3.0.3 으로 전환
- 서빙 Origin 변경으로 부팅 시 로컬 저장소가 비어, 토스 스토리지 복원을 기다린 뒤 시작 화면을 여는 순서로 재구성
- 세이프에어리어 인셋 적용, 화면 배치를 고정 픽셀에서 보드 셀 기준으로 통일
- 뷰포트 높이를 실측값으로 교체, 판 종료 통계를 한 곳으로 모아 같은 판이 두 번 기록되던 문제 제거
- 토스 내비 알약 위치를 실기기 캡처로 재측정해 공식 규칙(iOS +5 / Android +10)에 정렬 — devtools 는 고정 줄에 그려서 실기기와 다름
- 콘솔 Access denied 의 원인이 우리 패키지가 아니라 토스 CDN 캐시임을 확인

<!-- lang:en -->
Players reported that leaving the app mid-game and coming back rolled their progress backwards.
Saving relied entirely on catching the moment the app leaves, but the Toss webview halts JS almost immediately when it backgrounds, so missing that one moment lost the whole board.

- Save after every move instead of trusting the exit event, with the exit signal captured from focus, pagehide, and visibilitychange
- Saves right after an undo and right after a new board is dealt, closing the windows where a cancelled move came back or a stale board appeared
- Apps in Toss SDK moved from 2.10.8 to 3.0.3
- The serving origin changed and left local storage empty on every boot, so the startup sequence now waits for the Toss storage restore before opening the start screen
- Safe area insets applied, layout moved off fixed pixels onto board-cell units
- Viewport height replaced with a measured value, end-of-game stats consolidated so a single game stopped being recorded twice
- Toss navigation pill re-measured from device captures and aligned with the official rule (iOS +5 / Android +10) — devtools draws it on a fixed line, unlike a real device
- Console's Access denied traced to Toss CDN caching rather than anything in our package
