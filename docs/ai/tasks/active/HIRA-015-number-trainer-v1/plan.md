# Plan: [HIRA-015] Number Trainer V1 (0–99)

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — `current-features.md`, `current-flows.md`, `architecture.md`, `changelog.md`

---

## Audit — hiện trạng code

### Impacted files thực tế

| File | Loại thay đổi | Ghi chú |
|---|---|---|
| `src/index.html` | Sửa | Thêm NT button trên home + 3 screens mới |
| `src/numberData.js` | **Tạo mới** | Dataset 0–99 với reading, composition, lesson grouping |
| `src/numberTrainer.js` | **Tạo mới** | ntState + toàn bộ NT logic + event listeners |
| `src/style.css` | Sửa | NT-specific styles (lesson buttons, composition display) |

`src/progress.js` — **không sửa** (NT V1 không track vào Progress Dashboard).  
`src/quiz.js` — **không sửa** (NT logic tách hoàn toàn vào `numberTrainer.js`).  
`src/hiraganaData.js` — **không sửa**.

### Navigation pattern hiện tại liên quan

Entry point: `mode-selection-screen` → các nút mode. Đã có "Luyện Phát Âm" (PT) theo pattern:

```
[mode-selection-screen] → pt-btn
  → pt-type-screen (chọn Hiragana / Katakana)
  → pt-lesson-screen (chọn bài)
  → pt-screen (các phase)
  → pt-summary-screen
```

NT không cần "type screen" (số không phân loại theo kana type). Flow gọn hơn:

```
[mode-selection-screen] → nt-btn
  → nt-lesson-screen (chọn bài 1–4)
  → nt-screen (các phase)
  → nt-summary-screen
```

### Tại sao tách file mới (`numberData.js`, `numberTrainer.js`)

1. **Data structure khác** — số cần thêm field `value` (numeric), `composition`, `altReading`. Không thuộc cấu trúc `{kana, romaji}` của `hiraganaData.js`.
2. **Logic khác** — reverse MCQ (reading → number) không tồn tại trong kana quiz. PT đã tạo precedent nhưng NT lớn hơn (~150–200 dòng logic mới) và có 4 phases.
3. **quiz.js đã đủ lớn** — tách ra giữ file dễ review và deploy riêng lẻ.
4. **Precedent PT** — PT đã được thêm inline vào quiz.js. NT sẽ tách hoàn toàn để không làm quiz.js lớn hơn.

---

## Data structure — `src/numberData.js`

```js
// Mỗi item:
{
  value: 24,                    // số nguyên (dùng cho reverse MCQ)
  reading: 'にじゅうし',         // primary reading
  altReading: 'にじゅうよん',    // reading thay thế (null nếu không có)
  composition: '20 + 4',        // hiển thị trong Learn mode
  parts: ['にじゅう', 'し']      // breakdown từng thành phần (optional display)
}
```

**Xử lý dual reading (4: し/よん, 7: しち/なな, 9: く/きゅう, 0: ゼロ/れい):**
- `reading` = reading thường dùng hơn
- `altReading` = reading thay thế
- Trong Practice MCQ: cả hai đều accepted là đúng khi dùng làm correct answer
- Trong Practice MCQ (options): hiển thị `reading` chính

**Lesson grouping trong `numberData.js`:**
```js
const NUMBER_LESSONS = [
  { id: 'lesson1', label: 'Bài 1 — 0 đến 10',          range: [0, 10] },
  { id: 'lesson2', label: 'Bài 2 — 11 đến 19',          range: [11, 19] },
  { id: 'lesson3', label: 'Bài 3 — Hàng chục',           values: [10,20,30,40,50,60,70,80,90] },
  { id: 'lesson4', label: 'Bài 4 — 21 đến 99',          range: [21, 99], excludeTens: true }
];
```

---

## State design — `ntState` trong `numberTrainer.js`

```js
const ntState = {
  lessonId: null,          // 'lesson1' | 'lesson2' | 'lesson3' | 'lesson4'
  phase: null,             // 'learn' | 'practice' | 'reverse' | 'review'
  lessonItems: [],         // toàn bộ items của lesson
  currentItems: [],        // items đang dùng trong phase hiện tại
  currentIndex: 0,
  wrongItems: [],          // trả lời sai trong practice/reverse
  reviewItems: [],         // = wrongItems khi vào review phase
  reviewTotal: 0,
  answerSelected: false    // guard double-click
};
```

`ntState` là global riêng trong `numberTrainer.js` — không gộp vào `quizState`.  
`numberTrainer.js` chỉ cần global `speakJapanese()` từ `quiz.js` (nếu muốn dùng TTS).

---

## User flow chi tiết

### Từ home
```
mode-selection-screen
  → Click "Luyện Số"
  → nt-lesson-screen (render 4 bài)
```

### Lesson flow
```
nt-lesson-screen
  → Click bài X
  → startNTLearn(lessonId)

[Phase: Learn]
  → hiển thị từng item: số lớn + reading + composition
  → Nút "Nghe" (nếu TTS có)
  → Nút "Tiếp →" để chuyển item
  → Sau item cuối → transition sang Practice phase

[Phase: Practice — số → reading]
  → hiển thị số (e.g. "24")
  → 4 nút reading options
  → Click → highlight đúng/sai → auto-advance (800ms)
  → Track wrongItems
  → Sau item cuối → transition sang Reverse phase

[Phase: Reverse — reading → số]
  → hiển thị reading (e.g. "にじゅうし")
  → 4 nút số options (e.g. "24", "35", "52", "18")
  → Click → highlight đúng/sai → auto-advance
  → Track wrongItems (dedupe với practice wrongs)
  → Sau item cuối:
    → có wrongItems → transition sang Review phase
    → không có → nt-summary-screen (perfect)

[Phase: Review — ôn lại câu sai]
  → currentItems = wrongItems (shuffle)
  → chạy Practice format (số → reading) cho các item sai
  → Sau item cuối → nt-summary-screen

nt-summary-screen
  → hiển thị: Hoàn thành + số sai, nút "Chọn bài khác" + "Về Trang Chủ"
```

---

## MCQ option generation

**Practice forward (số → reading):**
- Pool: tất cả `numberData` (0–99)
- Correct: `item.reading`
- Options: 3 random readings từ pool (khác với correct), shuffle
- Accepted correct: `item.reading` OR `item.altReading`

**Practice reverse (reading → số):**
- Pool: tất cả `numberData`
- Correct: `item.value` (hiển thị dạng "24")
- Options: 3 random values từ pool (khác với correct), shuffle

---

## Screens HTML (`src/index.html`)

Thêm vào sau PT summary screen, trước kana quiz screens:

```html
<!-- Number Trainer screens -->
<div id="nt-btn-wrapper">
  <button id="nt-btn">Luyện Số</button>   <!-- thêm vào mode-buttons -->
</div>

<div id="nt-lesson-screen" class="quiz-container" style="display: none;">
  <h2>Luyện Số Tiếng Nhật</h2>
  <p class="nt-subtitle">Chọn bài để bắt đầu</p>
  <div id="nt-lesson-buttons"></div>
  <button id="back-from-nt-lesson-btn" class="back-btn">← Quay Lại</button>
</div>

<div id="nt-screen" class="quiz-container" style="display: none;">
  <div id="nt-phase-label"></div>
  <div id="nt-progress"></div>
  <div id="nt-card-section">
    <div id="nt-display"></div>          <!-- số hoặc reading tùy phase -->
    <div id="nt-reading" style="display: none;"></div>
    <div id="nt-composition" style="display: none;"></div>
  </div>
  <div id="nt-options-section" style="display: none;">
    <div id="nt-choice-options"></div>
  </div>
  <div id="nt-actions">
    <button id="nt-speak-btn" style="display: none;">▶ Nghe lại</button>
    <button id="nt-next-btn" style="display: none;">Tiếp →</button>
  </div>
  <button id="nt-exit-btn" class="back-btn">← Thoát</button>
</div>

<div id="nt-summary-screen" class="quiz-container" style="display: none;">
  <h2 id="nt-summary-title">Kết Quả</h2>
  <div id="nt-summary-content"></div>
  <div id="nt-summary-actions">
    <button id="nt-retry-btn" style="display: none;">Ôn lại →</button>
    <button id="nt-choose-lesson-btn">Chọn bài khác</button>
    <button id="nt-home-btn">Về Trang Chủ</button>
  </div>
</div>
<!-- End Number Trainer screens -->
```

---

## Script load order (`src/index.html`)

```html
<script src="hiraganaData.js"></script>   <!-- data layer (kana) -->
<script src="progress.js"></script>        <!-- persistence layer -->
<script src="numberData.js"></script>      <!-- data layer (numbers) — MỚI -->
<script src="quiz.js"></script>            <!-- logic layer (kana quiz + PT) -->
<script src="numberTrainer.js"></script>   <!-- logic layer (NT) — MỚI -->
```

`numberTrainer.js` load sau `quiz.js` để dùng global `speakJapanese()`.

---

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Lesson 4 quá nhiều item (72) — Learn phase dài | Trung bình | Không thể split trong V1 scope. Có thể sample 20–30 items đại diện thay vì full 72. Flag cho người dùng quyết định trước khi implement. |
| Dual-reading MCQ — cả hai accepted | Thấp | Logic đơn giản: kiểm tra `selected === item.reading \|\| selected === item.altReading`. |
| Global namespace collision (`ntState` vs `quizState`) | Thấp | Tên khác nhau, tách file. Không overlap. |
| TTS trên số đọc hiragana (`にじゅうし`) | Thấp | `speakJapanese()` dùng `lang: 'ja-JP'` — đọc hiragana ổn. |
| Regression kana quiz / PT | Thấp | NT là flow hoàn toàn mới, không sửa quiz.js. |
| `hide-all` pattern trong quiz.js không bao gồm NT screens | Thấp | NT có exit button về nt-lesson-screen hoặc home — không phụ thuộc vào hide-all của quiz.js. |

---

## Quyết định thiết kế — đã duyệt 2026-04-09

### [Q1] Lesson 4 scope → **Option C được chọn**
- Tách thành **Bài 4A (21–49)** và **Bài 4B (51–99)** — tổng 5 bài
- Full items, không sample, không auto-advance 2s

### [Q2] Review phase → **Option C được chọn**
- Mix cả forward (số → reading) và reverse (reading → số), random per item
- Chỉ lấy từ câu sai (wrongItems)

---

## Các bước thực hiện

1. **Tạo `src/numberData.js`** — dataset 0–99, structure `{value, reading, altReading, composition, parts}`, lesson grouping config `NUMBER_LESSONS`
2. **Sửa `src/index.html`** — thêm `#nt-btn` vào `#mode-buttons`, thêm 3 NT screens sau PT screens, cập nhật script load order
3. **Tạo `src/numberTrainer.js`** — `ntState`, `renderNTLessons()`, `startNTLearn()`, `renderNTItem()`, `renderNTOptions()`, `handleNTAnswer()`, `advanceNT()`, `showNTSummary()`, event listeners
4. **Sửa `src/style.css`** — styles cho NT button, lesson buttons, composition display, NT choice buttons
5. **Self-review** theo checklist

---

## Self-review plan

Sau khi implement, sẽ kiểm tra:
- [ ] `#nt-btn` tồn tại trong DOM, click handler wired đúng
- [ ] `renderNTLessons()` render đúng 4 bài với label và item count
- [ ] Learn phase: hiển thị đúng `value`, `reading`, `composition` theo item thứ tự
- [ ] Learn phase: TTS guard (`window.speechSynthesis`) hoạt động
- [ ] Practice forward: 4 options đúng (correct + 3 random), highlight đúng/sai
- [ ] Practice reverse: 4 options là numbers (string dạng "24"), correct value đúng
- [ ] Dual reading: `altReading` accepted trong MCQ check
- [ ] `wrongItems` track đúng (dedupe, không duplicate)
- [ ] Review phase chỉ xuất hiện khi `wrongItems.length > 0`
- [ ] Summary: hiển thị đúng khi perfect (no wrong) vs có wrong
- [ ] Back button từ `nt-lesson-screen` về `mode-selection-screen`
- [ ] Exit button từ `nt-screen` về `nt-lesson-screen`
- [ ] Không regression: kana quiz, PT, Flashcard không bị ảnh hưởng
- [ ] Script load order đúng trong HTML (numberData trước numberTrainer, sau quiz)

## Runtime verify plan

_Điều kiện: app đang chạy + browser automation khả dụng_
_(Hiện tại: TẠM VÔ HIỆU HÓA theo `.claude/rules/self-test.md`)_

Sẽ kiểm tra:
- [ ] Flow: home → "Luyện Số" → lesson screen → bài 1 → learn → practice → reverse → summary
- [ ] Flow có wrong: practice sai → review xuất hiện → hoàn thành
- [ ] Case: Lesson 3 (tens) không bị mix với non-tens
- [ ] Case: dual reading (4, 7, 9) — cả hai accepted
