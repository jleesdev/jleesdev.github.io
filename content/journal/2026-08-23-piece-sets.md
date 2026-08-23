---
date: 2026-08-23
project: on-the-line
title_en: Piece sets and a fix for vanishing records
title_ko: 피스 세트 추가와 기록 유실 수정
summary_ko: 조각 모양을 바꾸는 피스 세트를 넣고, 기록이 간헐적으로 사라지던 문제를 수정.
summary_en: Added swappable piece sets and fixed records that were disappearing.
tags: [Unity, WebGL, Apps in Toss]
visibility: public
---

<!-- lang:ko -->
조각 모양을 바꿀 수 있는 피스 세트 기능을 넣고, 최고 점수와 기록이 간헐적으로 사라지던 문제를 잡았다.

- 프로필에서 고른 피스 세트가 보드·미리보기에 즉시 반영되고 다음 실행에도 유지 — 부팅 때 저장된 선택을 아무도 읽지 않던 게 원인
- `DESSERT PARTY` 세트 추가 — 300점, 2 COMBO, 한 번에 8개 제거를 모두 채우면 해금
- 토스 스토리지 미러링을 키별 직렬화·병합으로 교체, 부팅 복원 전 쓰기는 보류 — 늦게 도착한 옛 값이 새 값을 덮거나 빈 값이 서버를 덮던 경로 차단
- 점수 팝업 색을 스프라이트 실제 색에서 재추출, 세트 안 구분은 색 거리로 검증 — 조각과 정반대 색이 들어가 있던 것도 이때 발견
- 다른 세트를 고른 뒤 기본 세트로 돌아오지 못하던 버그 수정 — 직렬화 라이브러리가 JSON 의 null 을 빈 객체로 바꿔 조건 없는 세트가 영구 잠금 상태였음

<!-- lang:en -->
Added piece sets so players can change how the pieces look, and fixed best scores and records that were disappearing now and then.

- A set picked in the profile now applies to the board and preview immediately and survives a restart — nothing had been reading the saved choice at boot
- `DESSERT PARTY` set added — unlocked by reaching 300 points, hitting a 2 COMBO, and clearing 8 pieces at once
- Toss storage mirroring rewritten to serialise and coalesce writes per key, holding writes until the boot restore finishes — closing both a late stale write and an empty value overwriting the server
- Score popup colours rederived from the actual sprite pixels, with colour distance verifying they stay distinguishable — one piece turned out to carry the opposite colour of its artwork
- Fixed the default set being unselectable after switching away — the serialiser turns JSON null into an empty object, leaving condition-free sets permanently locked
