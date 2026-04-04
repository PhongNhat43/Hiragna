# Changelog

Mỗi entry tương ứng một task đã archive. Cập nhật bắt buộc trước khi archive task.

---

## [HIRA-008] Session Persistence — 2026-04-04

Thêm cơ chế lưu màn hình hiện tại vào `sessionStorage` để khôi phục sau khi reload (F5). Các màn hình setup và progress được restore đầy đủ cùng state. Mid-quiz và mid-flashcard intentionally về mode-selection. Thêm `saveSession`, `loadSession`, `clearSession` vào `progress.js`. Thêm `restoreSession`, `applySettingsButtons` vào `quiz.js`, gắn save/clear vào toàn bộ screen transitions.

Files: `progress.js`, `quiz.js`

---

## [HIRA-007] Back Navigation — 2026-04-03

Thêm nút "Quay Lại" vào 2 màn hình còn thiếu: `quiztype-screen` (về mode-selection) và `difficulty-screen` (về quiztype). State reset đúng theo từng bước: back từ quiztype reset `mode`, back từ difficulty reset `quizType` và `questionSet`. Style dùng class `.back-btn` nhất quán với các back button hiện có.

Files: `index.html`, `quiz.js`, `style.css`

---

## [HIRA-006] Adaptive Review System — 2026-04-02

Thêm Weak Items tracking và Weak Review Mode. Khi trả lời sai/skip → ký tự ghi vào weak items. Khi trả lời đúng → tự động xóa khỏi weak items (adaptive). Nút "Weak Review" trên mode-selection-screen cho phép quiz chỉ các ký tự yếu, bỏ qua difficulty/group/settings. Dashboard cập nhật thêm cột Weak count và nút Reset Weak Items. Bug fix: `generateQuestion()` crash khi weak items < 4 — dùng full dataset làm option pool khi cần.

Files: `progress.js`, `quiz.js`, `index.html`, `style.css`

---

## [HIRA-005] Learning Progress Dashboard + localStorage Persistence — 2026-04-02

Thêm hệ thống lưu tiến trình học vào localStorage và màn hình Progress Dashboard.
Tạo `progress.js` (persistence layer độc lập) với `loadProgress()`, `saveProgress()`, `resetProgress()`.
Progress tự động lưu sau mỗi Quiz Mode completion. Dashboard hiển thị Overall stats + breakdown theo 3 quiz types.
Nút "View Progress" trên mode-selection-screen, nút "Reset Progress" có confirm dialog.
Flashcard Mode không track trong v1.

Files: `progress.js` (mới), `index.html`, `quiz.js`, `style.css`

---

## [HIRA-004] Flashcard Mode — 2026-03-31

Thêm Flashcard Mode song song với Quiz Mode. Người dùng chọn mode từ màn hình đầu tiên mới (mode-selection-screen).
Flashcard tái sử dụng quiz type selection, group filter, và dataset hiện có — không tạo engine riêng.
Flow: mode → quiz type → group → flashcard session (shuffle cards, show/hide answer, knew/review, summary).
Cả Quiz Mode và Flashcard Mode restart đều về mode-selection-screen.

Files: `index.html`, `quiz.js`, `style.css`

---

## [HIRA-003] Kanji Mode — 2026-03-30

Thêm Kanji như quiz type thứ ba. Dataset 27 ký tự N5 chia 3 nhóm (numbers, nature, people).
Đổi `KANA_GROUP_CONFIG` thành `GROUP_CONFIG` per quiz type để hỗ trợ nhóm riêng cho từng chế độ.
Group buttons render động bằng JS thay vì hardcode HTML.

Files: `hiraganaData.js`, `quiz.js`, `index.html`

---

## [HIRA-002] Question History — 2026-03-30

Thêm `questionHistory[]` track toàn bộ câu đã trả lời. Thêm nút "Review All" luôn xuất hiện sau quiz,
không phụ thuộc vào `reviewEnabled`. Mỗi entry hiển thị kana, đáp án chọn, đáp án đúng, status Correct/Incorrect.

Files: `quiz.js`, `index.html`

---

## [HIRA-001] Quiz Group Filter — 2026-03-30

Thêm màn hình Group Filter trước Settings. Người dùng chọn nhóm kana để giới hạn phạm vi quiz.
4 nhóm: All, Basic vowels, K-group, S-group. Dùng chung cho Hiragana và Katakana qua `KANA_GROUP_CONFIG`.

Files: `hiraganaData.js`, `quiz.js`, `index.html`, `style.css`

---

## [HIRA-000] Workflow Bootstrap — 2026-03-30

Thiết lập cấu trúc docs, workflow task, rules AI cho project.
Tạo `docs/ai/`, `.claude/rules/`, templates, CLAUDE.md.
