# Architectural Decisions

Ghi lại các quyết định thiết kế quan trọng và lý do.

---

## [2026-03-30] Kanji dùng field `romaji` để lưu nghĩa tiếng Anh

**Quyết định:** Dataset kanji dùng cấu trúc `{ kana, romaji }` giống hệt hiragana/katakana,
trong đó `romaji` chứa nghĩa tiếng Anh (vd: `"mountain"`).

**Lý do:** Tái sử dụng toàn bộ quiz engine hiện tại (`generateQuestion`, `validateAnswer`, filter logic)
mà không cần thêm code path mới. Trade-off là field tên `romaji` nhưng chứa meaning — chấp nhận được
vì đây là internal data field, không hiển thị ra UI.

---

## [2026-03-30] GROUP_CONFIG per quiz type thay vì dùng chung

**Quyết định:** Đổi `KANA_GROUP_CONFIG` (dùng chung) thành `GROUP_CONFIG[quizType]` (per type).

**Lý do:** Kanji cần nhóm hoàn toàn khác (numbers/nature/people) so với kana (basic_vowels/k_group/s_group).
Cấu trúc per-type cho phép mỗi quiz type có nhóm riêng độc lập mà không ảnh hưởng lẫn nhau.

---

## [2026-03-30] Group buttons render động bằng JS

**Quyết định:** Xóa hardcoded group buttons trong HTML, thay bằng `renderGroupButtons()` trong `quiz.js`.

**Lý do:** Khi GROUP_CONFIG là per type, không thể biết trước HTML cần render buttons nào.
JS render tại thời điểm chuyển sang group-filter-screen, sau khi đã biết `quizType`.

---

## [2026-03-30] questionHistory tách biệt với incorrectAnswers

**Quyết định:** Thêm `questionHistory[]` riêng thay vì tái dùng `incorrectAnswers[]`.

**Lý do:** `incorrectAnswers` đã có semantic cụ thể — chỉ lưu câu sai/skip, được dùng bởi Review Mistakes
và gated bởi `reviewEnabled`. `questionHistory` cần track TẤT CẢ câu kể cả câu đúng.
Tách biệt để không phá vỡ Review Mistakes logic hiện tại.

---

## [2026-04-02] Adaptive logic áp dụng trong mọi quiz mode

**Quyết định:** `addToWeakItem` và `removeFromWeakItem` được gọi trong `handleAnswer()` và `skipBtn` — không chỉ riêng Weak Review Mode.

**Lý do:** Nhất quán — trả lời đúng ở bất kỳ mode nào cũng nên "học được" và xóa weak item. Tách biệt logic theo mode sẽ gây inconsistency.

---

## [2026-04-02] Weak Review bỏ qua difficulty/group filter/settings

**Quyết định:** `startWeakReview()` nhảy thẳng vào `main-quiz` sau khi chọn quiz type, không qua các màn trung gian.

**Lý do:** Weak items đã là một tập cụ thể — không cần filter thêm. Difficulty cũng không áp dụng vì quiz hết toàn bộ weak items.

---

## [2026-04-02] generateQuestion() dùng optionsPool khi questionSet < 4

**Quyết định:** Khi `quizState.questionSet.length < 4`, `generateQuestion()` dùng full dataset của quiz type làm option pool thay vì chỉ questionSet.

**Lý do:** Weak Review có thể có 1–3 items. `while (options.length < 4)` sẽ infinite loop nếu pool quá nhỏ. Full dataset luôn có đủ items (≥ 20). Câu hỏi vẫn là weak items, chỉ wrong options mở rộng khi cần.

---

## [2026-04-02] Tách progress.js khỏi quiz.js

**Quyết định:** Tạo file riêng `src/progress.js` chứa toàn bộ localStorage logic thay vì đặt trong `quiz.js`.

**Lý do:** `quiz.js` quản lý quiz flow — không nên ôm thêm persistence concern. `progress.js` hoàn toàn độc lập với `quizState`, chỉ đọc/ghi localStorage. Tách biệt giúp dễ thay thế persistence layer sau này.

---

## [2026-04-02] localStorage key `hiragna_progress`

**Quyết định:** Dùng key `hiragna_progress` cho localStorage.

**Lý do:** Tên riêng tránh conflict với các app khác trên cùng origin. Prefix `hiragna` theo tên repo.

---

## [2026-04-02] Flashcard Mode không track trong Progress Dashboard (v1)

**Quyết định:** `saveQuizProgress()` chỉ được gọi trong `showResult()` (Quiz Mode), không gọi trong `showFlashcardSummary()`.

**Lý do:** Flashcard Mode dùng metric "knew it / need review" không ánh xạ được sang "correct / wrong". Thêm vào cùng schema sẽ làm accuracy % bị sai lệch. Tách task riêng nếu cần track flashcard sau.

---

## [2026-04-04] Sequential pick thay vì pure random trong generateQuestion()

**Quyết định:** `generateQuestion()` dùng `questionCount % dataSet.length` để chọn câu hỏi thay vì `getRandomInt(dataSet.length)`. Dataset được shuffle một lần tại `startQuizBtn` trước khi quiz bắt đầu.

**Lý do:** Pure random gây lặp câu hỏi trong cùng session — đặc biệt tệ với dataset nhỏ (weak review 5 items / 10 câu). Sequential pick đảm bảo mỗi item được hỏi một lần trước khi lặp lại. Pre-shuffle giữ nguyên tính ngẫu nhiên. `startWeakReview()` đã shuffle sẵn nên không cần thay đổi.

---

## [2026-03-30] Single quizState object pattern

**Quyết định:** Toàn bộ state quiz sống trong một object `quizState` duy nhất.

**Lý do:** Đảm bảo reset sạch khi restart (chỉ cần gán lại từng field),
tránh state rò rỉ qua biến global rời, dễ debug và trace state changes.
