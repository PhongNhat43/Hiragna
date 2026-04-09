# Result: [HIRA-013] Kana Coverage & Adaptive Quiz

## Trạng thái

In Progress — Phases 1–4 complete, chờ người dùng verify toàn bộ.

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/hiraganaData.js` | Phase 1: +26 hiragana/katakana, +7 groups. Phase 3: +25 dakuten/handakuten, +5 groups. Phase 4: +27 yoon, +2 groups |
| `src/progress.js` | Phase 2: thêm `hiragna_item_stats` storage + 4 functions |
| `src/quiz.js` | Phase 2: thay `generateQuestion()` → `pickWeighted()`, thêm adaptive tracking |

---

## Thay đổi chính — Phase 1

Bổ sung các hàng còn thiếu để hoàn thiện 46 hiragana và 46 katakana cơ bản:
- な行, は行, ま行, や行, ら行, わ行 + ん (mirror sang katakana)
- GROUP_CONFIG: thêm `ta_group`, `na_group`, `ha_group`, `ma_group`, `ya_group`, `ra_group`, `wa_group` cho cả `hiragana` và `katakana`

## Thay đổi chính — Phase 2

Adaptive Quiz V1:
- `progress.js`: `hiragna_item_stats` — per-item `{correct, wrong, lastSeenTs, streak}` per type
- `quiz.js`: xóa sequential pick, thay bằng `pickWeighted()` — weight = accuracy_mult × recency_mult × absence_mult, floor 0.05
- `quiz.js`: `recentItems[]` (size 6) tracking in-session; `updateItemStat` gọi sau mỗi câu trả lời và skip
- `quiz.js`: `resetProgressBtn` gọi `resetItemStats()`

## Thay đổi chính — Phase 3

Dakuten & Handakuten (+25 items mỗi loại):
- が行, ざ行, だ行, ば行, ぱ行 + katakana mirror
- GROUP_CONFIG: `ga_group`, `za_group`, `da_group`, `ba_group`, `pa_group`
- Lưu ý: ぢ=di, づ=du (Hepburn chuẩn, tránh trùng với じ=ji, ず=zu)

## Thay đổi chính — Phase 4

Yoon (+27 items mỗi loại):
- き/し/ち/に/ひ/み/り行 yoon (21 items) + ぎ/じ行 yoon dakuten (6 items) + katakana mirror
- GROUP_CONFIG: `yoon_basic`, `yoon_dakuten`
- kana field là string 2 ký tự (vd: "きゃ") — item stats tracking dùng kana as key, không conflict

---

## Self-review — Tất cả phases

**Phase 1:**
- [x] Item count: awk 46/46 ✓
- [x] GROUP_CONFIG filters: python3 trace 10 groups, 0 MISSING ✓
- [x] ya_group/wa_group < 4 → optionsPool fallback tại `quiz.js:64` ✓

**Phase 2:**
- [x] `pickWeighted` edge case 1 item: rand ≤ weight[0] → return dataSet[0] ✓
- [x] mixed mode: `updateItemStat` early return, `typeStats = {}` → recency vẫn hoạt động ✓
- [x] `questionSet` với `filter === null` → reference trực tiếp `fullData`, không bị mutate ✓
- [x] Flashcard dùng `fcIndex`, không đụng `generateQuestion` ✓
- [x] PT không dùng `generateQuestion` ✓
- [x] `recentItems = []` đúng chỗ: startQuizBtn, restartBtn, startWeakReview ✓

**Phase 3:**
- [x] Item count: awk 71/71 ✓
- [x] GROUP_CONFIG 5 groups mới: python3 trace OK ✓
- [x] Romaji unique: ぢ=di, づ=du tránh trùng ✓

**Phase 4:**
- [x] Item count: awk 98/98 ✓
- [x] Yoon groups: python3 OK (21 + 6 items) ✓
- [x] Romaji unique: python3 0 dupes trên toàn bộ 98 romajis ✓
- [x] Kana 2 ký tự ("きゃ") → dùng làm key trong item stats bình thường ✓

**Đã verify (self-review):** item counts, filter coverage, romaji uniqueness, edge cases, PT/flashcard isolation.

**Chờ người dùng verify:** toàn bộ các điểm trong manual verify steps bên dưới.

---

## Manual verify steps

**Phase 1 — Basic kana:**
1. Hiragana → Quiz → group filter screen: đủ 16 buttons (All + 10 basic groups + 5 dakuten/handakuten groups), layout không vỡ
2. Chọn "All" → quiz: thấy ký tự mới (な、は、ま、ら...)
3. Chọn "N-group" → quiz: chỉ thấy な/に/ぬ/ね/の
4. Chọn "W-group + N" → quiz: thấy わ/を/ん (ん romaji = "n")
5. Lặp steps 1-4 cho Katakana

**Phase 2 — Adaptive quiz:**
6. Chạy quiz, cố tình sai vài ký tự cùng nhau nhiều lần → ký tự đó phải xuất hiện nhiều hơn trong các câu tiếp theo
7. Ký tự vừa trả lời không xuất hiện ngay câu tiếp theo
8. Weak-review vẫn hoạt động (chỉ quiz các ký tự yếu)
9. Reset progress → item stats cũng bị xóa (verify bằng cách chạy quiz sau reset: tất cả item lại như mới)

**Phase 3 — Dakuten / Handakuten:**
10. Chọn "GA-group" → quiz: thấy が/ぎ/ぐ/げ/ご
11. Chọn "ZA-group" → thấy ざ/じ/ず/ぜ/ぞ (じ romaji = "ji")
12. Chọn "DA-group" → thấy だ/ぢ/づ/で/ど (ぢ=di, づ=du)
13. Chọn "PA-group" → thấy ぱ/ぴ/ぷ/ぺ/ぽ

**Phase 4 — Yoon:**
14. Chọn "Yoon (basic)" → quiz: thấy きゃ/しゃ/ちゃ... (kana 2 ký tự hiển thị đúng)
15. Chọn "Yoon (voiced)" → thấy ぎゃ/じゃ/じゅ/じょ (じゃ=ja)
16. Flashcard → All → verify thấy yoon trong deck

---

## Docs updated

- [ ] `current-features.md` _(chưa — pending archive)_
- [ ] `current-flows.md` _(không cần — flow không đổi)_
- [ ] `architecture.md` _(không cần — không đổi kiến trúc)_
- [ ] `changelog.md` _(pending archive)_
- [ ] `decisions.md` _(không cần — additive data change)_

---

## Vấn đề còn mở

Không có. Layout và romanization đã được người dùng xác nhận.
