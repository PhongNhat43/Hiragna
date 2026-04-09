# Result: [HIRA-015] Number Trainer V1 (0–99)

## Trạng thái

Done — chờ người dùng verify

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/numberData.js` | **Tạo mới** — dataset 0–99 (100 items) sinh tự động, `NUMBER_LESSONS` (5 bài) |
| `src/numberTrainer.js` | **Tạo mới** — `ntState`, toàn bộ NT logic, event listeners |
| `src/index.html` | Thêm `#nt-btn` vào `mode-selection-screen`; thêm 3 screens (`nt-lesson-screen`, `nt-screen`, `nt-summary-screen`); cập nhật script load order |
| `src/style.css` | Thêm NT styles (teal/emerald color scheme): `#nt-btn`, `.nt-lesson-btn`, `#nt-screen`, `#nt-display`, `.nt-choice-btn`, summary styles |

Không sửa: `src/quiz.js`, `src/progress.js`, `src/hiraganaData.js`.

---

## Thay đổi chính

**Flow mới:** `mode-selection-screen` → "Luyện Số" → `nt-lesson-screen` (5 bài) → `nt-screen` (4 phases) → `nt-summary-screen`

**5 bài học:**
- Bài 1: 0–10 (11 items)
- Bài 2: 11–19 (9 items)
- Bài 3: Hàng chục — 10, 20...90 (9 items)
- Bài 4A: 21–49 trừ tens (27 items)
- Bài 4B: 51–99 trừ tens (45 items)

**4 phases mỗi bài:**
- **Learn** — số + reading + composition + TTS tự động, bấm "Tiếp →" để chuyển
- **Practice** (số → reading) — MCQ 4 lựa chọn, options từ cùng bài
- **Reverse** (reading → số) — MCQ 4 lựa chọn
- **Review** — chỉ xuất hiện khi có câu sai; mix forward/reverse random per item

**State:** `ntState` object riêng trong `numberTrainer.js` — không gộp vào `quizState`.

**Dual reading:** よん/し, なな/しち, きゅう/く, ゼロ/れい đều accepted.

**MCQ options pool:** ưu tiên items cùng bài (challenging, same range); fallback toàn bộ 100 items.

---

## Kết quả self-review

- [x] **`#nt-btn` wired đúng** — trace: `ntBtn.addEventListener('click', ...)` → `modeSelectionScreen.display='none'`, `renderNTLessons()`, `ntLessonScreen.display='flex'`. ✓
- [x] **5 bài render đúng** — `NUMBER_LESSONS.forEach` → 5 buttons. Lesson counts: L1=11, L2=9, L3=9, L4A=27, L4B=45 (verified by counting filter ranges). ✓
- [x] **Learn phase đúng** — `renderLearnItem`: display=value, reading=primary+alt, composition với `→` separator, TTS guard `window.speechSynthesis`. ✓
- [x] **Practice forward MCQ** — `renderReadingOptions`: pool từ lesson hoặc full, 3 wrong opts (dedup, exclude primary+alt), options shuffled, `item.reading` always included. ✓
- [x] **Practice reverse MCQ** — `renderNumberOptions`: options là `String(d.value)`, correct = `String(item.value)`. ✓
- [x] **Dual reading accepted** — `selected === item.reading || (item.altReading !== null && selected === item.altReading)`. altReading không xuất hiện trong MCQ options (không có item nào có `reading` bằng altReading của item khác), nhưng guard vẫn đúng. ✓
- [x] **wrongItems dedup** — trace `handleNTAnswer`: loop check `ntState.wrongItems[i].value === item.value` trước khi push. ✓
- [x] **Review phase gate** — `advanceNT()` after reverse: `if (ntState.wrongItems.length > 0) {...} else { showNTSummary() }`. ✓
- [x] **Review mix types** — `Object.assign({}, it, { _reviewType: Math.random() < 0.5 ? 'practice' : 'reverse' })`. `renderNTItem` dispatch theo `item._reviewType`. ✓
- [x] **Summary 3 cases** — reviewTotal=0 → "Xuất sắc", wrongCount=0 → "Tốt lắm", wrongCount>0 → "Còn X số". ✓
- [x] **Retry flow** — `startRetryReview()`: rebuild review từ `wrongItems`, reset `wrongItems=[]`, re-enter review phase. ✓
- [x] **Stale timeout on exit** — `ntExitBtn` sets `ntState.phase=null`; pending `setTimeout(advanceNT, 900)` sẽ fire nhưng `phase === null` không match bất kỳ branch nào → no-op. ✓
- [x] **Back navigation** — 4 back paths: lesson→home, nt-screen→lesson (Exit), summary→lesson, summary→home. Tất cả đều hide/show đúng screen. ✓
- [x] **Script load order** — `hiraganaData.js` → `progress.js` → `numberData.js` → `quiz.js` → `numberTrainer.js`. `numberData` và `NUMBER_LESSONS` globals sẵn sàng. `speakJapanese` global từ quiz.js sẵn sàng. ✓
- [x] **Không regression** — `quiz.js`, `progress.js`, `hiraganaData.js` không bị sửa. NT screens thêm vào HTML với `display:none`. `ntState` không gộp vào `quizState`. ✓
- [x] **CSS font-size choice btn** — 1.1rem với `padding: 16px 6px`; `きゅうじゅうきゅう` (8 chars × ~18px) ≈ 144px trong cell ~185px → fit. ✓

**Đã verify (self-review):** toàn bộ 14 checks qua code trace.

**Chờ người dùng verify:** Runtime behavior, TTS, UI layout, tất cả manual steps bên dưới.

---

## Manual verify steps

**Basic flow:**
1. Mở app → `mode-selection-screen` có nút "Luyện Số" (màu teal, bên dưới "Luyện Phát Âm")
2. Click "Luyện Số" → `nt-lesson-screen` hiện 5 bài với item count đúng
3. Click "Bài 1" → `nt-screen` hiện, phase label = "📖 Học"

**Learn phase:**
4. Mỗi item hiển thị: số lớn (e.g. "4"), reading ("よん / し"), composition null cho 0–9 và 10
5. Đối với item có composition (e.g. Bài 2: 14): composition hiển thị "10 + 4  →  じゅうよん"
6. Nếu browser hỗ trợ TTS: nút "▶ Nghe lại" hiển thị, tự động phát âm khi item load
7. Click "Tiếp →" → chuyển item tiếp theo, progress counter tăng
8. Sau item cuối → phase tự động chuyển sang "✏️ Luyện — Số → Đọc"

**Practice forward:**
9. Hiển thị số (e.g. "7"), 4 nút reading (dạng lưới 2×2)
10. Click đáp án đúng → nút xanh, chuyển tự động sau ~0.9s
11. Click đáp án sai → nút đỏ + nút đúng xanh, chuyển tự động

**Practice reverse:**
12. Sau practice xong → phase "🔄 Đảo — Đọc → Số"
13. Hiển thị reading (e.g. "なな"), 4 nút số (dạng "7", "3", "9", "5")
14. Click đúng → xanh; click sai → đỏ + đúng xanh

**Review & Summary:**
15. Nếu có câu sai → phase "🔁 Ôn" xuất hiện (mix số→đọc và đọc→số)
16. Sau review → `nt-summary-screen` với kết quả phù hợp
17. Nếu không sai gì → "Xuất sắc! 🎉"
18. Nếu có sai nhưng ôn xong → "Tốt lắm! 👍"
19. Nếu còn sai sau ôn → "Còn X số cần ôn thêm" + nút "Ôn lại →"

**Navigation:**
20. `nt-lesson-screen` → "← Quay Lại" → `mode-selection-screen` ✓
21. `nt-screen` → "← Thoát" → `nt-lesson-screen` (bài list còn đó) ✓
22. `nt-summary-screen` → "Chọn bài khác" → `nt-lesson-screen` ✓
23. `nt-summary-screen` → "Về Trang Chủ" → `mode-selection-screen` ✓

**Regression:**
24. Quiz Mode (kana) hoạt động bình thường
25. Flashcard Mode hoạt động bình thường
26. Pronunciation Trainer hoạt động bình thường

---

## Vấn đề còn mở

Không có.
