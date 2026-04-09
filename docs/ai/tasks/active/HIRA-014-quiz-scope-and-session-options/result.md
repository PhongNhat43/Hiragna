# Result: [HIRA-014] Quiz Scope & Session Options

## Trạng thái

Done — chờ người dùng verify

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/hiraganaData.js` | Thêm `CONTENT_SCOPE_CONFIG` với 5 presets (basic_only/basic_plus_daku/full/focus_daku/focus_yoon) và filter arrays chính xác |
| `src/index.html` | Thêm `#scope-screen` div với 3 sections (content/questions/timer); thêm `#timer-display` trong `#main-quiz`; giữ nguyên `difficulty-screen` và `group-filter-screen` |
| `src/style.css` | CSS cho `.scope-section`, `.scope-section-label`, `.scope-options`, `.scope-btn` / `.scope-btn.active`, `#confirm-scope-btn`, `#timer-display`, `.timer-warning`, `@keyframes timer-pulse` |
| `src/quiz.js` | Thêm quizState fields; thêm `clearTimer()`/`startTimer()` helpers; thêm `initScopeScreen()`; thêm scope-screen handlers; đổi flow kana/kanji/mixed sang scope-screen; cập nhật `startQuizBtn` dùng contentScope; cập nhật `renderQuestion()`, `handleAnswer()`, `skipBtn`, `restartBtn`; cập nhật `backToGroupBtn`; cập nhật `restoreSession()`; thêm scope-screen vào hide-all block |

---

## Thay đổi chính

**Flow mới (Quiz Mode):** quiztype-screen → scope-screen → settings-screen → main-quiz. Difficulty-screen và group-filter-screen không còn xuất hiện trong quiz flow.

**Flashcard Mode và Weak Review:** không bị ảnh hưởng — vẫn đi qua group-filter-screen như cũ.

**Content scope:** `startQuizBtn` đọc `quizState.contentScope` để filter questionSet cho kana. Kanji dùng full dataset. Mixed dùng questionSet đã set từ mix-type-screen.

**Timer:** `startTimer()` gọi trong `renderQuestion()`. Timeout kích hoạt y hệt skip path. `clearTimer()` gọi ở: answer, skip, timeout callback, restart.

---

## Self-review

- [x] **Kana quiz flow** — trace: `quizTypeBtns` handler → khi mode=quiz → scope-screen (quiz.js:443-450). difficulty-screen không được gọi trong kana/kanji quiz path. ✓
- [x] **Flashcard flow không vỡ** — trace: `quizTypeBtns` handler → khi mode=flashcard → `renderGroupButtons()` + `groupFilterScreen` (quiz.js line ~370). Không đụng group-filter-screen handlers. ✓
- [x] **Weak review flow không vỡ** — trace: `quizTypeBtns` handler → khi mode=weak-review → `startWeakReview()`. timerMode = null nên `startTimer()` early-return. ✓
- [x] **Content scope filter counts** — verify bằng Node.js: basic_only=46, basic_plus_daku=71, focus_daku=25, focus_yoon=27; full=filter null (98 items). ✓
- [x] **Timer clearInterval ở answer** — trace: `handleAnswer()` → gọi `clearTimer()` trước `validateAnswer()`. ✓
- [x] **Timer clearInterval ở skip** — trace: `skipBtn` → gọi `clearTimer()` trước `quizState.isAnswered = true`. ✓
- [x] **Timer clearInterval ở timeout callback** — trace: `startTimer()` → khi `timerRemaining <= 0` → `clearTimer()` đầu tiên, guard `if (quizState.isAnswered) return`. ✓
- [x] **Timer clearInterval ở restart** — trace: `restartBtn` → gọi `clearTimer()` đầu tiên, reset `timerMode=null`, `timerRemaining=0`. ✓
- [x] **Session restore scope-screen** — trace: `restoreSession()` case `'scope-screen'` → restore quizType, contentScope, totalQuestions, timerMode; gọi `initScopeScreen()`. ✓
- [x] **Back navigation: scope → quiztype** — trace: `backFromScopeBtn` → `scopeScreen.hide`, `quizTypeScreen.show` (non-mixed). ✓
- [x] **Back navigation: scope → mix-type (mixed)** — trace: `backFromScopeBtn` → `mixTypeScreen.show` khi `quizType === 'mixed'`. ✓
- [x] **Back navigation: settings → scope** — trace: `backToGroupBtn` → khi mode!='flashcard' → `initScopeScreen()` + `scopeScreen.show`. ✓
- [x] **Scope-screen khởi tạo** — `initScopeScreen()` dùng function declaration trong DOMContentLoaded callback → hoisted, gọi được trước khi defined. ✓
- [x] **Không sửa ngoài scope** — chỉ sửa 4 files trong plan.md. group-filter-screen HTML/JS/CSS không đụng. ✓
- [x] **timerIntervalId không persist** — `startTimer()` không lưu vào sessionStorage. Sau F5, timerIntervalId=null (initial). Timer chỉ start khi `renderQuestion()` gọi. ✓

**Đã verify (self-review):** Filter counts đúng (Node.js), flow routing traced, timer exit points traced, back navigation traced, flashcard/weak-review không bị ảnh hưởng traced.

**Chờ người dùng verify:** Runtime behavior (UI hiển thị, countdown animation, auto-skip khi hết 10s, F5 restore trên browser).

---

## Manual verify steps

**Content scope:**
1. Quiz Mode → Hiragana → scope-screen xuất hiện với 3 sections (Nội dung / Số câu hỏi / Timer)
2. Chọn "Basic only" → Bắt Đầu Quiz → `window.quizState.questionSet.length` trong DevTools = 46
3. Chọn "Basic + Dakuten" → `questionSet.length` = 71
4. Chọn "Full kana" → `questionSet.length` = 98
5. Chọn "Focus: Dakuten" → `questionSet.length` = 25
6. Chọn "Focus: Yoon" → `questionSet.length` = 27
7. Quiz Mode → Kanji → scope-screen xuất hiện **không có** section "Nội dung"
8. Quiz Mode → Hỗn Hợp → scope-screen xuất hiện **không có** section "Nội dung"

**Timer:**
1. Scope-screen → Timer = "Tắt" active sẵn (mặc định)
2. Chạy quiz với Timer=Tắt → không thấy countdown
3. Chọn Timer = "10s/câu" → Bắt đầu quiz → countdown hiện từ 10, đếm ngược
4. Không click gì, chờ 10s → câu bị skip, ghi vào incorrectAnswers và weak items
5. Khi còn ≤3s, countdown chuyển đỏ và nhấp nháy
6. User click đáp án trước khi hết giờ → countdown biến mất ngay
7. Bấm "Bỏ Qua" → countdown biến mất ngay
8. Bấm "Làm Lại" từ kết quả → không có interval leak (console không có error)

**Navigation:**
1. scope-screen → Quay Lại → quiztype-screen ✓
2. settings-screen → Quay Lại → scope-screen (không phải group-filter) ✓
3. F5 tại scope-screen → restore đúng scope-screen với selections đã chọn ✓
4. Flashcard Mode: quiztype → group-filter-screen (không qua scope-screen) ✓
5. Weak Review: quiztype → bắt đầu quiz ngay (không qua scope-screen) ✓
6. Pronunciation Trainer: không bị ảnh hưởng ✓

---

## Vấn đề còn mở

Không có.
