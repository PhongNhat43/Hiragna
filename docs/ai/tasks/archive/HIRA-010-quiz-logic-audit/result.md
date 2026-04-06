# Result: HIRA-010 — Quiz Logic Audit & Fix

## Trạng thái

Done (chờ user verify)

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/quiz.js` | Slice 1: reset optionsArea + skipBtn display trong renderQuestion(); Slice 2: null guard cho stale setTimeout + while loop maxAttempts; Slice 3: shuffle questionSet tại startQuizBtn + sequential pick trong generateQuestion() |

---

## Thay đổi chính

**Slice 1 — Fix 2 bugs UI state ẩn:**
- `renderQuestion()`: thêm `optionsArea.style.display = ''` và `skipBtn.style.display = ''` ở đầu function. Trước đây review functions set display='none' không bao giờ reset → options và skip button biến mất sau lần chơi đầu.

**Slice 2 — Fix stale setTimeout crash + while loop guard:**
- `handleAnswer()` và `skipBtn` setTimeout callbacks: thêm `if (quizState.questionSet !== null)` guard. Ngăn crash khi user restart trong 800ms feedbackDelay window.
- `generateQuestion()`: thêm `maxAttempts = optionsPool.length * 4` cho while loop. Ngăn browser hang nếu pool không đủ 4 unique romaji.

**Slice 3 — Dedup câu hỏi trong session:**
- `startQuizBtn`: shuffle copy của questionSet trước khi bắt đầu quiz (`shuffle(questionSet.slice())`).
- `generateQuestion()`: đổi từ pure random sang sequential pick `questionCount % dataSet.length`. Mỗi item được hỏi một lần trước khi lặp lại.

---

## Self-review

- [x] Slice 1 — optionsArea reset đúng chỗ — trace quiz.js:495, trước `generateQuestion()` và `optionsArea.innerHTML = ''`, mọi path vào quiz đều qua đây — **pass**
- [x] Slice 1 — skipBtn reset đúng chỗ — quiz.js:496, cùng vị trí — **pass**
- [x] Slice 2 — null guard handleAnswer setTimeout — quiz.js: `if (quizState.questionSet !== null)` bao cả autoAdvance và manual nextBtn path — **pass**
- [x] Slice 2 — null guard skipBtn setTimeout — quiz.js: tương tự — **pass**
- [x] Slice 2 — while loop maxAttempts — quiz.js:58: `optionsPool.length * 4`, loop thoát khi không đủ unique romaji thay vì chạy mãi — **pass**
- [x] Slice 3 — `.slice()` trước shuffle — quiz.js:461, không mutate QUIZ_TYPE_CONFIG data gốc — **pass**
- [x] Slice 3 — sequential pick — `questionCount % dataSet.length`: 10 câu / 20 items = [0..9] không lặp; 10 câu / 5 items = [0,1,2,3,4,0,1,2,3,4] cycle đúng — **pass**
- [x] startWeakReview() không cần thay đổi — đã shuffle sẵn, sequential pick hoạt động đúng — **pass**
- [x] Mixed type regression — startMixedBtn set questionSet → startQuizBtn shuffle copy — **pass**

**Đã verify (self-review):** Logic các fix đúng theo trace code. Không có regression rõ ràng trong flow hiragana/katakana/kanji/mixed/weak-review.

**Chờ người dùng verify:**
- Xem review sau quiz → Làm Lại → options và skipBtn phải hiện bình thường
- Restart trong 800ms sau trả lời → không có console error
- Easy mode 10 câu hiragana → quan sát không có câu nào lặp lại
- Flow thông thường các mode không bị ảnh hưởng

---

## Docs updated

- [ ] `current-features.md`
- [ ] `current-flows.md`
- [ ] `architecture.md`
- [ ] `changelog.md`
- [ ] `decisions.md`
- [ ] `CLAUDE.md`
- [ ] `MEMORY.md`

---

## Vấn đề còn mở

- P3 — questionSet direct reference (vấn đề 6): latent risk, chưa cần fix, document để theo dõi
- P3 — Mixed romaji dedup assumption (vấn đề 7): assumption ngầm, không phải bug, document để theo dõi
