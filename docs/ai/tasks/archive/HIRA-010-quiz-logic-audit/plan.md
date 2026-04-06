# Plan: HIRA-010 — Quiz Logic Audit

## Thông tin

- **Task size:** Lớn
- **Docs impact:** có — nếu fix thì cần cập nhật changelog.md, decisions.md (nếu có thiết kế mới)

---

## Files bị ảnh hưởng

| File | Vai trò trong audit |
|---|---|
| `src/quiz.js` | Toàn bộ quiz engine |
| `src/hiraganaData.js` | Data source, dùng làm optionsPool |

---

## Điểm mạnh hiện tại (đã trace, có bằng chứng)

| # | Điểm mạnh | Bằng chứng |
|---|---|---|
| 1 | `shuffle()` dùng Fisher-Yates đúng chuẩn | quiz.js:42-48 — in-place swap, không bias |
| 2 | `validateAnswer()` có double-click guard | quiz.js:70 `if (quizState.isAnswered) return false` |
| 3 | Weak item guard cho mixed | quiz.js:517, 534 — `if (quizType !== 'mixed')` bao cả addTo và removeFrom |
| 4 | `startFlashcard()` `.slice()` trước shuffle | quiz.js:668 — không mutate original questionSet |
| 5 | `loadProgress()` merge defaults | progress.js — migration safe khi thêm key mới |
| 6 | `generateQuestion()` optionsPool fallback | quiz.js:54 — fallback về full dataset khi questionSet < 4 |

---

## Điểm yếu / Rủi ro / Edge Cases

### P1 — BUG XÁC NHẬN (cần fix)

#### Bug 1: `optionsArea` ẩn vĩnh viễn sau review + restart
- **Bằng chứng:** `renderReviewAllQuestion()` quiz.js:598 và `renderReviewQuestion()` quiz.js:628 đều set `optionsArea.style.display = 'none'`
- `restartBtn` handler quiz.js:788 không reset `optionsArea.style.display`
- `renderQuestion()` quiz.js:486-503 set `optionsArea.innerHTML = ''` nhưng không set `style.display` về `''`
- **Hậu quả:** Người dùng xem review → click Làm Lại → chơi quiz mới → options area ẩn hoàn toàn, không thấy đáp án
- **Mức độ:** Nghiêm trọng — gameplay bị vỡ hoàn toàn

#### Bug 2: `skipBtn` ẩn vĩnh viễn sau showResult() + restart
- **Bằng chứng:** `showResult()` quiz.js:561 set `skipBtn.style.display = 'none'`
- `startQuizBtn` handler và `renderQuestion()` không reset skipBtn display
- `restartBtn` → startQuizBtn → renderQuestion() không có dòng `skipBtn.style.display = ''`
- **Hậu quả:** Sau lần chơi đầu kết thúc, mọi lần chơi tiếp theo không có nút Bỏ Qua
- **Mức độ:** Nghiêm trọng — tính năng skip biến mất

#### Bug 3: Stale setTimeout crash khi restart trong feedbackDelay window
- **Bằng chứng:** `handleAnswer()` quiz.js:540 gọi `setTimeout(() => advanceToNextQuestion(), quizState.feedbackDelay)`
- `restartBtn` handler quiz.js:797 set `quizState.questionSet = null`
- Nếu restart trong vòng 800ms sau khi trả lời: setTimeout còn pending → `advanceToNextQuestion()` → `renderQuestion()` → `generateQuestion()` → `const dataSet = quizState.questionSet` (= null) → `getRandomInt(null.length)` → **TypeError crash**
- **Hậu quả:** Console error / crash không xử lý được
- **Mức độ:** Trung bình — xác suất thấp (window 800ms), nhưng crash khi xảy ra

---

### P2 — LOGIC CHƯA CHẶT (nên fix)

#### Vấn đề 4: Không có deduplication câu hỏi trong session
- **Bằng chứng:** `generateQuestion()` quiz.js:52 — `correctIdx = getRandomInt(dataSet.length)` — pure random, không track câu đã hỏi
- `questionHistory` quiz.js:508 chỉ track để review, không dùng để prevent repeat
- **Hậu quả:** Cùng câu hỏi có thể hỏi nhiều lần trong 1 session. Đặc biệt tệ khi: dataset nhỏ (5 weak items, 10 câu → guaranteed repeats), easy mode (10 câu từ 20 items = 50% chance repeat)
- **Mức độ:** UX xấu, đặc biệt với weak review mode

#### Vấn đề 5: While loop trong generateQuestion() không có exit condition
- **Bằng chứng:** quiz.js:56-59 — `while (options.length < 4)` không có iteration limit
- Trigger condition: optionsPool có < 4 unique romaji values
- Scenario cụ thể: Group filter "basic vowels" (5 items: a,i,u,e,o) + weak review chỉ có 2 weak items → optionsPool = full hiragana data (20 items, 20 unique romaji → OK trong trường hợp này)
- Nhưng nếu optionsPool là questionSet (< 4 items) và fallback mixed type: `QUIZ_TYPE_CONFIG['mixed'].data = []` → optionsPool = [] → loop chạy mãi vì `optionsPool[getRandomInt(0)]` = undefined
- **Mức độ:** Thấp với data hiện tại, nhưng potential browser hang không có error message

---

### P3 — THEO DÕI (chưa cần fix ngay)

#### Vấn đề 6: questionSet là direct reference đến fullData
- **Bằng chứng:** `startQuizBtn` quiz.js:451-453 — khi `group.filter === null`, `quizState.questionSet = fullData` (reference, không phải copy)
- `fullData = QUIZ_TYPE_CONFIG[quizType].data` → reference đến original array
- Nếu tương lai có code `shuffle(quizState.questionSet)` mà quên `.slice()` → mutate original data
- **Hiện tại:** Không có bug vì generateQuestion() không shuffle questionSet
- **Mức độ:** Latent risk — chỉ nguy hiểm khi thay đổi code

#### Vấn đề 7: Mixed romaji dedup assumption (hiragana + katakana)
- **Bằng chứng:** quiz.js:57-59 — dedup bằng romaji string
- Hiragana và katakana share romaji: あ = ア = "a". Mixed dataset có 40 items nhưng chỉ 20 unique romaji
- Với dataset hiện tại: 20 unique romaji đủ để build 4 options → OK
- **Mức độ:** Không phải bug — chỉ là assumption ngầm. Document để tránh nhầm sau này

---

## Mức độ ưu tiên tổng hợp

| Vấn đề | Mức | Trạng thái | Hành động |
|---|---|---|---|
| Bug 1: optionsArea ẩn | P1 | **Cần fix** | Slice 1 |
| Bug 2: skipBtn ẩn | P1 | **Cần fix** | Slice 1 |
| Bug 3: stale setTimeout | P1 | **Cần fix** | Slice 2 |
| Vấn đề 4: câu hỏi lặp | P2 | **Nên fix** | Slice 3 |
| Vấn đề 5: while loop | P2 | **Nên fix** | Slice 2 |
| Vấn đề 6: direct reference | P3 | Theo dõi | — |
| Vấn đề 7: mixed romaji | P3 | Theo dõi | — |

---

## Implementation Slices (nếu được duyệt)

### Slice 1 — Fix UI state không reset (Bug 1 + Bug 2)
**File:** `src/quiz.js`
**Thay đổi:**
- Trong `startQuizBtn` handler: thêm `optionsArea.style.display = ''` và `skipBtn.style.display = ''` trước `renderQuestion()`
- Hoặc trong `renderQuestion()`: reset cả optionsArea.style.display và skipBtn.style.display ở đầu function
- **Ưu tiên:** `renderQuestion()` là single point — fix ở đây bắt mọi path dẫn vào quiz
- **Rủi ro:** Thấp — chỉ thêm 2 dòng reset display

### Slice 2 — Fix stale setTimeout + while loop guard (Bug 3 + Vấn đề 5)
**File:** `src/quiz.js`
**Thay đổi:**
- `generateQuestion()`: thêm iteration limit cho while loop (max 100 vòng, throw error hoặc fallback nếu vượt)
- `handleAnswer()` và `skipBtn`: kiểm tra `quizState.questionSet !== null` trước khi gọi `advanceToNextQuestion()` trong setTimeout callback
- **Rủi ro:** Thấp — chỉ thêm guard condition

### Slice 3 — Deduplication câu hỏi trong session (Vấn đề 4)
**File:** `src/quiz.js`
**Thay đổi:**
- `generateQuestion()`: thêm tracking `askedIndices` (Set hoặc mảng). Random pick chỉ từ chỉ số chưa hỏi. Reset khi hết (shuffle again)
- Hoặc approach khác: shuffle questionSet khi bắt đầu, pick sequentially theo `questionCount` index thay vì random
- **Rủi ro:** Trung bình — thay đổi core randomization logic, cần test kỹ
- **Note:** Approach sequential pick đơn giản hơn và loại bỏ hoàn toàn câu hỏi lặp

---

## Docs impact (nếu implement)

| File | Cần update khi |
|---|---|
| `docs/ai/history/changelog.md` | Bắt buộc sau archive |
| `docs/ai/history/decisions.md` | Nếu Slice 3 chọn sequential pick thay vì random — quyết định thiết kế đáng ghi |
| `docs/ai/product/current-features.md` | Nếu Slice 3: behavior quiz thay đổi (no repeat questions) |
| `docs/ai/core/architecture.md` | Không cần — không thay đổi layer hay state structure |

---

## Self-review plan (cho các fix dự kiến)

- [ ] Slice 1: trace renderQuestion() — xác nhận optionsArea và skipBtn được reset trước khi options render
- [ ] Slice 1: trace flow restart → startQuizBtn → renderQuestion() — xác nhận không có display='none' còn lại
- [ ] Slice 2: trace while loop với optionsPool nhỏ — xác nhận exit condition hoạt động
- [ ] Slice 2: trace setTimeout callback — xác nhận null check ngăn crash
- [ ] Slice 3: trace question sequence — xác nhận không repeat trong 1 session, reset đúng khi hết items
- [ ] Regression: flow hiragana/katakana/kanji thông thường không bị ảnh hưởng
- [ ] Regression: weak review mode vẫn hoạt động với questionSet nhỏ
