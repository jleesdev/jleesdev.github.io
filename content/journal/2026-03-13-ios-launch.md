---
date: 2026-03-13
project: on-the-line
title_en: Shipped On The Line 1.0 on the App Store
title_ko: 온더라인 1.0 App Store 출시
summary_ko: 9×9 판에서 같은 조각 5개를 한 줄로 모아 지우는 퍼즐의 첫 버전.
summary_en: First release of the 9×9 line puzzle — clear five identical pieces in a row.
tags: [Unity, iOS, App Store]
visibility: public
---

<!-- lang:ko -->
9×9 판에서 같은 조각을 5개 이상 한 줄로 모아 지우는 퍼즐 게임의 첫 버전을 냈다.

- 조각을 고르고 빈 칸을 고르면 그리로 이동 — 경로는 상하좌우로만 뚫리고, 막히면 갈 수 없음
- 많이 지울수록 가파르게 오르는 `n × (n−4)` 점수 곡선 — 5개 5점, 8개 32점
- 연속 제거마다 배수가 붙는 콤보(`1 << 콤보 수`)와, 스폰된 조각이 저절로 줄을 맞추는 럭키 클리어
- 스폰 뒤 자동으로 터지는 체인도 콤보로 누적
- 리워드 광고를 봐야 쓸 수 있는 되돌리기 — 실수 하나로 판이 무너지는 게 가장 큰 진입장벽이라 여기에 배치
- Unity 6 / URP 2D, il2cpp 빌드

<!-- lang:en -->
Shipped the first version: clear five or more identical pieces in a line on a 9×9 board.

- Pick a piece, pick an empty cell, and it walks there — the path only opens up, down, left, and right, and a blocked route is unavailable
- An `n × (n−4)` scoring curve that pays off steeply for bigger clears — five pieces score 5, eight score 32
- A combo multiplier (`1 << combo`) on consecutive clears, plus lucky clears when spawned pieces complete a line on their own
- Chains that resolve after a spawn keep feeding the combo
- Undo behind a rewarded ad — a single misplaced move can collapse a board, the sharpest edge for new players
- Built on Unity 6 with URP 2D and il2cpp
