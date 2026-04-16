# Result: [HIRA-017] Daily Lesson Tab (10 Vocab + 3 Kanji)

## Trạng thái

Done

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/index.html` | Thêm nút `Học mỗi ngày`, overview screen, learn screen, practice screen, summary screen, script tags mới, topic/note fields |
| `src/style.css` | Thêm styles riêng cho Daily Lesson UI, topic/note/category badge, pronunciation helper, example block, highlight |
| `src/progress.js` | Thêm localStorage helpers cho trạng thái từng ngày học |
| `src/dailyLessonsData.js` | Nâng schema Daily Lesson lên `10 vocab + 3 kanji`, map thật ngày 1-4, thêm `pronunciationVi` + `example`, giữ day05+ placeholder theo schema mới |
| `src/dailyLesson.js` | Nâng flow Learn thành 2 block vocab + 1 block kanji, hiển thị topic/note/category badge, phát âm Việt hóa, ví dụ câu có highlight, practice loa dùng `audioText` |

---

## Thay đổi chính

Thêm flow học mới `Học mỗi ngày` như một learning mode độc lập, tách khỏi quiz core. Mỗi ngày học hiện có schema mở rộng `10 vocab + 3 kanji`, có `topic`, `category`, `note`, `audioText`, `pronunciationVi`, `example`, có mixed quick practice cho 13 items, có lưu trạng thái `not_started / in_progress / completed` qua `progress.js`, và có thể mở lại ngày cũ từ overview.

Hiện tại:
- `day01` đến `day04` đã có dữ liệu thật mức V1
- vocab `day01` đến `day04` đã có dòng phát âm Việt hóa và 1 ví dụ câu + dịch nghĩa
- `day05` trở đi vẫn là placeholder scaffold để tiếp tục fill sau
- item đang hiển thị trong Learn và Quick Practice có nút `🔊` để nghe phát âm

---

## Self-review

- [x] Daily Lesson tách khỏi quiz core — pass: logic mới nằm trong `src/dailyLesson.js`, không thêm state vào `quiz.js`
- [x] Persistence đi đúng layer — pass: `src/progress.js` có key riêng `hiragna_daily_lessons`, không nhét localStorage trực tiếp vào feature file
- [x] Flow V1 đủ các bước chính — pass: `daily-overview-screen` → `daily-learn-screen` → `daily-practice-screen` → `daily-summary-screen`
- [x] Mỗi ngày đúng `10 vocab + 3 kanji` — pass: schema mới trong `src/dailyLessonsData.js` tạo đúng số lượng cố định
- [x] 4 ngày đầu đã có data seed thật — pass: `src/dailyLessonsData.js` có `DAILY_LESSON_SEEDS.day01..day04`
- [x] Learn flow chia block hợp lý — pass: `learn-vocab-a` → `learn-vocab-b` → `learn-kanji`
- [x] Item model đủ giàu để mở rộng — pass: vocab/kanji có `category`, `note`, `audioText`, `topic`
- [x] Vocab learn card có ngữ cảnh học tốt hơn — pass: `src/dailyLesson.js` render `pronunciationVi`, ví dụ câu, dịch nghĩa, và highlight từ đang học
- [x] Item có thể phát âm trực tiếp — pass: `src/index.html` + `src/dailyLesson.js` thêm nút `🔊` dùng lại `speakJapanese()`
- [x] Script order hợp lệ — pass: `dailyLessonsData.js` load trước `dailyLesson.js`
- [x] JS syntax hợp lệ — pass: `node --check src/dailyLessonsData.js`, `node --check src/dailyLesson.js`, `node --check src/progress.js`
- [x] Repo scaffold không bị gãy — pass: `bash scripts/verify.sh` cho kết quả `36 OK / 0 MISSING`

**Đã verify (self-review):** structure feature, persistence path, navigation wiring, script order, syntax checks, scaffold verify.

**Đã verify (manual):** người dùng đã xác nhận UI/UX thực tế trên local server mới hoạt động đúng, các cập nhật `phát âm gần đúng + ví dụ + dịch nghĩa` đã hiển thị, và task có thể đóng.

---

## Manual verify steps

1. Từ home, click `Học mỗi ngày`.
2. Xác nhận overview hiển thị danh sách 25 ngày, mỗi ngày có topic, `10 vocab · 3 kanji`, và status badge.
3. Mở một ngày bất kỳ, xác nhận learn flow đi qua `5 vocab đầu` → `5 vocab sau` → `3 kanji`, và mỗi item có nút `🔊`, badge loại kiến thức, note ngắn.
4. Với vocab ở `day01-day04`, xác nhận mỗi item có thêm:
   - dòng `Phát âm gần đúng`
   - 1 câu ví dụ
   - 1 dòng dịch nghĩa
   - highlight đúng từ đang học trong câu ví dụ
5. Đi tiếp sang quick practice, xác nhận có mixed item vocab + kanji, có nút `🔊`, và answer buttons highlight đúng/sai.
6. Hoàn thành summary, quay lại overview, xác nhận ngày vừa học chuyển sang `Hoàn thành`.
7. Reload trang, mở lại `Học mỗi ngày`, xác nhận status ngày đã được lưu.
8. Mở lại một ngày đã hoàn thành, xác nhận có thể học lại bình thường.

---

## Docs updated

- [ ] `docs/ai/product/current-features.md`
- [ ] `docs/ai/product/current-flows.md`
- [ ] `docs/ai/core/architecture.md`
- [x] `docs/ai/history/changelog.md`
- [ ] `docs/ai/history/decisions.md`

---

## Vấn đề còn mở

- `day01-day04` đã có dữ liệu seed; `day05+` vẫn là placeholder scaffold, chưa phải data thật theo Minna no Nihongo bài 1–25.
- Quick practice hiện dùng 1 format mixed đơn giản: vocab = `JP -> meaning`, kanji = `kanji -> reading`.
- Chưa có session restore cho Daily Lesson giữa chừng.
- Không có blocking issue cho việc archive; phần mở rộng dataset `day05+` là follow-up tự nhiên chứ không chặn closure của V1.
