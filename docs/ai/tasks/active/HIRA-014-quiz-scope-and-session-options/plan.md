# Plan: [HIRA-014] Quiz Scope & Session Options

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `current-features.md`, `current-flows.md`, `architecture.md`, `changelog.md`, `decisions.md`

---

## Audit flow hiện tại

### Kana quiz flow hiện tại:
```
quiztype-screen
  → difficulty-screen   [Easy=10 / Medium=15 / Hard=20]
  → group-filter-screen [All / Basic vowels / K-group / ... / Yoon]  ← 16 buttons, dùng renderGroupButtons()
  → settings-screen     [autoAdvance / feedbackDelay / reviewEnabled]
  → main-quiz
```

### Vấn đề:
1. Người dùng phải qua 3 màn setup chỉ để bắt đầu quiz.
2. `group-filter-screen` giờ có 16 buttons cho kana — nhiều, khó scan nhanh.
3. Difficulty screen dùng tên Easy/Medium/Hard mà không nói rõ số câu.
4. Không có timer, không có content preset gọn.

### Quyết định UX:

**Thay `difficulty-screen` + `group-filter-screen` bằng một `scope-screen` duy nhất**, chia 3 section rõ ràng:

```
scope-screen
  ├─ [Content]  (chỉ hiện cho kana)
  │     Basic only | Basic + Dakuten | Full kana | Focus: Daku | Focus: Yoon
  ├─ [Questions]
  │     10 | 20 | 30
  └─ [Timer]
        Off | 10s/câu
```

Màn `settings-screen` giữ nguyên để chứa behavior settings.

**Flow mới kana:**
```
quiztype-screen → scope-screen → settings-screen → main-quiz
```

**Flow mới kanji/mixed (V1):**
```
quiztype-screen → scope-screen (chỉ Questions + Timer, không có Content section) → settings-screen → main-quiz
```
Kanji và Mixed không có content scope trong V1 — chỉ chọn số câu và timer.

**Back navigation:**
```
scope-screen ← back → quiztype-screen
settings-screen ← back → scope-screen
```

`difficulty-screen` và `group-filter-screen` bị loại khỏi kana/kanji flow. HTML div có thể để lại (hidden) nếu Flashcard Mode đang dùng group-filter-screen — cần kiểm tra kỹ.

> **Bất biến (không được vi phạm):** `group-filter-screen` giữ nguyên hoàn toàn — HTML, CSS, JS handlers. Flashcard Mode và Weak Review vẫn đi qua `group-filter-screen` như hiện tại. Scope-screen chỉ bypass `group-filter-screen` trong **Quiz Mode**.

---

## Phân tích yêu cầu

### Content scope implementation

Mỗi content scope preset là tập romaji cố định. Lưu vào `CONTENT_SCOPE_CONFIG` trong `hiraganaData.js`:

```js
const CONTENT_SCOPE_CONFIG = {
  basic_only:      { label: "Basic only",          filter: [...46 romajis...] },
  basic_plus_daku: { label: "Basic + Dakuten",      filter: [...71 romajis...] },
  full:            { label: "Full kana",            filter: null },
  focus_daku:      { label: "Focus: Dakuten",       filter: [...25 romajis...] },
  focus_yoon:      { label: "Focus: Yoon",          filter: [...27 romajis...] }
};
```

Filter là mảng romaji như GROUP_CONFIG — logic filter trong `startQuizBtn` tái dụng hoàn toàn.

**Mapping preset → item count (chốt):**

| Preset | Items | Nguồn |
|---|---|---|
| Basic only | **46** | basic_vowels + k/s/ta/na/ha/ma/ya/ra/wa_group |
| Basic + Dakuten | **71** | basic_only + ga/za/da/ba/pa_group |
| Full kana | **98** | filter = null (toàn bộ dataset) |
| Focus: Dakuten/Handakuten | **25** | ga/za/da/ba/pa_group |
| Focus: Yoon | **27** | yoon_basic + yoon_dakuten |

**Chỉ áp dụng cho kana (hiragana/katakana).** Kanji và Mixed không có Content section trong V1.

### Timer mode implementation

Thêm vào `quizState`:
```js
timerMode: null,        // null (Off) | 'per_question' — mặc định: null (Off)
timerSeconds: 10,       // cố định 10s trong V1
timerRemaining: 0,      // runtime countdown state
timerIntervalId: null,  // runtime — không persist vào sessionStorage
```

**Scope-screen timer mặc định: Off** (`timerMode = null`). Người dùng phải chủ động bật "10s/câu".

**Logic timeout (chốt):**
- Khi `renderQuestion()` chạy và `timerMode === 'per_question'`: gọi `clearTimer()` trước, rồi start interval mới.
- Mỗi 1s: `timerRemaining--`. Khi `timerRemaining <= 0`: **xử lý đúng như người dùng bấm Skip** — gọi cùng code path: `isAnswered = true`, push `incorrectAnswers` (userAnswer: null), push `questionHistory`, `addToWeakItem`, `updateItemStat(_, _, false)`, cập nhật `recentItems`, `disableOptions()`, `advanceToNextQuestion()`.
- Không tạo code path riêng cho timeout — tái dùng hoàn toàn skip logic.

**Timer cleanup — bắt buộc gọi `clearTimer()` tại:**

| Exit point | Ghi chú |
|---|---|
| User trả lời (`handleAnswer`) | Trước khi xử lý đáp án |
| User bấm Skip (`skipBtn`) | Trước khi xử lý skip |
| Timeout tự kích hoạt | Gọi `clearTimer()` ngay trong callback |
| Restart (`restartBtn`) | Reset toàn bộ state |
| Back (`back-from-*`) khi đang trong main-quiz | Nếu có back từ main-quiz |
| Session restore (F5) | `timerIntervalId` không persist → không cần clear, nhưng không start timer mới cho đến `renderQuestion()` |

Timer display: thêm `<div id="timer-display">` vào `main-quiz` trong HTML, ẩn khi timerMode = null.

### Question count

Thay `DIFFICULTY_CONFIG` hoặc bỏ. `quizState.totalQuestions` set trực tiếp từ scope-screen (10/20/30).

---

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `src/index.html` | Thêm `scope-screen` div; thêm `timer-display` trong `main-quiz`; giữ `difficulty-screen` và `group-filter-screen` (Flashcard vẫn dùng) |
| `src/style.css` | CSS cho `scope-screen` (3 sections), `timer-display`, scope buttons |
| `src/quiz.js` | Thêm scope-screen handlers, timer logic, flow branching kana vs kanji/mixed; xóa difficulty-screen khỏi kana flow; cập nhật back navigation; cập nhật startQuizBtn để dùng contentScope; cập nhật restartBtn reset |
| `src/hiraganaData.js` | Thêm `CONTENT_SCOPE_CONFIG` với 5 presets |

---

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Back navigation phức tạp — scope-screen thay 2 màn cũ | Cao | Phải trace kỹ tất cả back handlers và session restore cases |
| `group-filter-screen` vẫn cần cho Flashcard Mode | Trung bình | Không được xóa HTML hay JS handler của group-filter |
| Timer interval leak khi restart mid-quiz | Cao | `clearInterval` phải được gọi ở mọi exit point: restart, skip, answer |
| Session restore cho scope-screen (F5) | Trung bình | Phải lưu `contentScope`, `totalQuestions`, `timerMode` vào sessionStorage |
| `timerIntervalId` là runtime state — không serialize | Thấp | Không persist vào sessionStorage, chỉ clear + restart khi restore |
| scope-screen chưa có với mixed quiz flow — hiện mixed đi qua mix-type-screen → difficulty | Trung bình | Mixed flow cần điều chỉnh: sau mix-type-screen → scope-screen (không có Content section) |

---

## Các bước thực hiện

### Bước 1 — Data layer (`hiraganaData.js`)
- Thêm `CONTENT_SCOPE_CONFIG` với 5 presets và filter arrays

### Bước 2 — HTML (`index.html`)
- Thêm `#scope-screen` với 3 sections
- Thêm `#timer-display` trong `#main-quiz`

### Bước 3 — CSS (`style.css`)
- Styling cho scope-screen sections (label + button group mỗi section)
- Styling cho timer-display (countdown number, warning state khi ≤ 3s)

### Bước 4 — Logic (`quiz.js`)

**4a — quizState**: Thêm `contentScope`, `timerMode`, `timerSeconds`, `timerRemaining`, `timerIntervalId`

**4b — Scope screen handlers**: render + confirm logic cho scope-screen

**4c — Flow routing**:
- kana: quiztype → scope-screen (thay vì difficulty)
- kanji: quiztype → scope-screen (không có Content section)
- mixed: mix-type-screen → scope-screen (không có Content section)

**4d — startQuizBtn**: đọc `contentScope` để filter questionSet cho kana; đọc `totalQuestions` từ scope; không dùng difficulty/group-filter nữa cho kana flow

**4e — Timer**: thêm `startTimer()` / `clearTimer()` helpers; gắn vào `renderQuestion()`, `handleAnswer()`, `skipBtn`, `restartBtn`

**4f — Back navigation**: 
- `back-from-scope-btn` → quiztype-screen
- `settings-screen back` → scope-screen (thay vì group-filter)
- Xóa back handlers của difficulty-screen khỏi kana path (difficulty-screen vẫn tồn tại trong HTML nhưng không được show trong kana flow)

**4g — Session restore**: thêm scope-screen case vào `restoreSession()`

**4h — Restart reset**: thêm `contentScope`, `timerMode`, `timerRemaining` vào restart/reset handlers; gọi `clearTimer()`

---

## Quyết định thiết kế

1. **Scope-screen thay thế difficulty + group-filter cho kana** — ít màn hơn, 3 sections rõ ràng hơn. Group-filter với 16 buttons quá nhiều cho UX thông thường; content scope presets phục vụ 90% use cases.

2. **Difficulty-screen giữ trong HTML nhưng không dùng trong kana flow** — tránh xóa code có thể cần sau này, và giảm blast radius.

3. **Group-filter-screen giữ nguyên** — Flashcard Mode đang dùng. Không đụng.

4. **Timer mặc định = Off** — người dùng phải chủ động bật. `timerMode: null` là giá trị khởi tạo và giá trị reset.

5. **Timer timeout = skip thường** — không tạo code path riêng. Timeout kích hoạt đúng cùng logic như `skipBtn`: push `incorrectAnswers`, `addToWeakItem`, `updateItemStat(_, _, false)`, `recentItems`, `disableOptions()`, `advanceToNextQuestion()`.

6. **`clearTimer()` helper** — tập trung `clearInterval(timerIntervalId); quizState.timerIntervalId = null;`. Gọi ở mọi exit point: answer, skip, timeout callback, restart.

7. **timerIntervalId không persist** — là runtime state. Sau F5, timer không chạy cho đến khi `renderQuestion()` được gọi lại.

8. **CONTENT_SCOPE_CONFIG trong hiraganaData.js** — cùng layer với GROUP_CONFIG, tái dụng cùng filter pattern. Kanji và Mixed không có entry trong config này (V1).

9. **group-filter-screen bất biến** — giữ nguyên hoàn toàn cho Flashcard và Weak Review. Scope-screen chỉ bypass trong Quiz Mode.

---

## Self-review plan

- [ ] Trace toàn bộ kana quiz flow mới end-to-end trong code
- [ ] Trace Flashcard Mode — group-filter vẫn hoạt động
- [ ] Trace Weak Review — không đi qua scope-screen, vẫn ok
- [ ] Timer: clearInterval đúng tất cả exit points
- [ ] Session restore: scope-screen case trong restoreSession()
- [ ] Back navigation: không có dead end, không loop

## Runtime verify plan

> **STATUS: TẠM VÔ HIỆU HÓA** — Bỏ qua cho đến khi được kích hoạt lại.

---

## Acceptance criteria ngắn

**Content scope:**

| Criterion | Verify bằng |
|---|---|
| Kana quiz không qua difficulty/group-filter | Click qua flow, không thấy 2 màn đó |
| Basic only = 46 items | `questionSet.length` trong devtools |
| Basic + Dakuten = 71 items | `questionSet.length` trong devtools |
| Full kana = 98 items | `questionSet.length` trong devtools |
| Focus: Dakuten = 25 items | `questionSet.length` trong devtools |
| Focus: Yoon = 27 items | `questionSet.length` trong devtools |
| Kanji/Mixed: không có Content section | Kiểm tra scope-screen UI |

**Timer:**

| Criterion | Verify bằng |
|---|---|
| Mặc định scope-screen: Timer = Off | Mở scope-screen, "Off" active sẵn |
| Timer Off: không có countdown trong quiz | Chạy quiz, không thấy timer display |
| Timer 10s: countdown hiển thị, auto-skip khi 0 | Không click, chờ 10s |
| Auto-skip = sai: ghi vào weak items và incorrectAnswers | Check progress sau quiz |
| **Cleanup — answer:** clearTimer khi user trả lời | Không thấy countdown tiếp chạy sau khi đã trả lời |
| **Cleanup — skip:** clearTimer khi user bấm Skip | Không thấy countdown tiếp chạy sau skip |
| **Cleanup — restart:** clearTimer khi bấm Làm Lại | Không thấy interval leak sau restart |
| **Cleanup — back từ settings:** clearTimer nếu đang quiz | Không applicable (back không vào main-quiz), nhưng restartBtn đủ |
| **Cleanup — F5 restore:** không có stale interval sau reload | Timer chỉ start khi `renderQuestion()` gọi |

**Navigation & compatibility:**

| Criterion | Verify bằng |
|---|---|
| Back từ scope-screen → quiztype-screen | Click Back |
| Back từ settings-screen → scope-screen | Click Back |
| F5 tại scope-screen → restore đúng màn | Reload mid-setup |
| Flashcard Mode: group-filter vẫn hoạt động | Đi qua flashcard flow |
| Weak Review: không bị ảnh hưởng | Đi qua weak review flow |
| Pronunciation Trainer: không bị ảnh hưởng | Đi qua PT flow |
