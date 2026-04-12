# Result: [HIRA-017] Daily Lesson Tab (5 Vocab + 3 Kanji)

## Trạng thái

In Progress

---

## Files changed

| File | Thay đổi |
|---|---|
| `src/index.html` | Thêm nút `Học mỗi ngày`, overview screen, learn screen, practice screen, summary screen, script tags mới |
| `src/style.css` | Thêm styles riêng cho Daily Lesson UI |
| `src/progress.js` | Thêm localStorage helpers cho trạng thái từng ngày học |
| `src/dailyLessonsData.js` | Tạo scaffold dataset 25 ngày với schema `5 vocab + 3 kanji` |
| `src/dailyLesson.js` | Tạo flow Daily Lesson độc lập: overview → learn → practice → summary, thêm nút loa cho item hiện tại |

---

## Thay đổi chính

Thêm flow học mới `Học mỗi ngày` như một learning mode độc lập, tách khỏi quiz core. Mỗi ngày học có schema cố định `5 vocab + 3 kanji`, có mixed quick practice cho 8 items, có lưu trạng thái `not_started / in_progress / completed` qua `progress.js`, và có thể mở lại ngày cũ từ overview.

Hiện tại:
- `day01` đến `day03` đã có dữ liệu thật mức V1
- `day04` trở đi vẫn là placeholder scaffold để tiếp tục fill sau
- item đang hiển thị trong Learn và Quick Practice có nút `🔊` để nghe phát âm

---

## Self-review

- [x] Daily Lesson tách khỏi quiz core — pass: logic mới nằm trong `src/dailyLesson.js`, không thêm state vào `quiz.js`
- [x] Persistence đi đúng layer — pass: `src/progress.js` có key riêng `hiragna_daily_lessons`, không nhét localStorage trực tiếp vào feature file
- [x] Flow V1 đủ các bước chính — pass: `daily-overview-screen` → `daily-learn-screen` → `daily-practice-screen` → `daily-summary-screen`
- [x] Mỗi ngày đúng `5 vocab + 3 kanji` — pass: scaffold generator trong `src/dailyLessonsData.js` tạo đúng số lượng cố định
- [x] 3 ngày đầu đã có data seed thật — pass: `src/dailyLessonsData.js` có `DAILY_LESSON_SEEDS.day01..day03`
- [x] Item có thể phát âm trực tiếp — pass: `src/index.html` + `src/dailyLesson.js` thêm nút `🔊` dùng lại `speakJapanese()`
- [x] Script order hợp lệ — pass: `dailyLessonsData.js` load trước `dailyLesson.js`
- [x] JS syntax hợp lệ — pass: `node --check src/dailyLessonsData.js`, `node --check src/dailyLesson.js`, `node --check src/progress.js`
- [x] Repo scaffold không bị gãy — pass: `bash scripts/verify.sh` cho kết quả `36 OK / 0 MISSING`

**Đã verify (self-review):** structure feature, persistence path, navigation wiring, script order, syntax checks, scaffold verify.

**Chờ người dùng verify:** UI/UX thực tế của Daily Lesson trên browser, status badge transitions, mixed practice experience, và việc placeholder data có đủ ổn để tiếp tục fill content thật hay cần chỉnh schema trước.

---

## Manual verify steps

1. Từ home, click `Học mỗi ngày`.
2. Xác nhận overview hiển thị danh sách 25 ngày và mỗi ngày có status badge.
3. Mở một ngày bất kỳ, xác nhận learn flow đi qua 5 vocab rồi 3 kanji, và mỗi item có nút `🔊` nghe phát âm.
4. Đi tiếp sang quick practice, xác nhận có mixed item vocab + kanji, có nút `🔊`, và answer buttons highlight đúng/sai.
5. Hoàn thành summary, quay lại overview, xác nhận ngày vừa học chuyển sang `Hoàn thành`.
6. Reload trang, mở lại `Học mỗi ngày`, xác nhận status ngày đã được lưu.
7. Mở lại một ngày đã hoàn thành, xác nhận có thể học lại bình thường.

---

## Docs updated

- [ ] `docs/ai/product/current-features.md`
- [ ] `docs/ai/product/current-flows.md`
- [ ] `docs/ai/core/architecture.md`
- [ ] `docs/ai/history/changelog.md`
- [ ] `docs/ai/history/decisions.md`

---

## Vấn đề còn mở

- `day01-day03` đã có dữ liệu seed; `day04+` vẫn là placeholder scaffold, chưa phải data thật theo Minna no Nihongo bài 1–25.
- Quick practice hiện dùng 1 format mixed đơn giản: vocab = `JP -> meaning`, kanji = `kanji -> reading`.
- Chưa có session restore cho Daily Lesson giữa chừng.
