# Result: [HIRA-005] Learning Progress Dashboard + localStorage Persistence

## Ngày hoàn thành
2026-03-31

## Files đã thay đổi

| File | Thay đổi chính |
|---|---|
| `src/progress.js` | **File mới** — localStorage utilities: loadProgress(), saveProgress(), resetProgress(), getDefaultProgress() |
| `src/index.html` | Thêm `#view-progress-btn` vào mode-selection-screen; thêm `progress-screen`; thêm `<script src="progress.js">` |
| `src/quiz.js` | Thêm DOM refs progress screen; thêm saveQuizProgress(), showProgressScreen(), renderAccuracy(); gọi saveQuizProgress() trong showResult(); thêm 3 event listeners; hide progressScreen trong initial state |
| `src/style.css` | Thêm styles cho #view-progress-btn, #progress-screen, .progress-section, .progress-table, #progress-actions, #reset-progress-btn, #back-from-progress-btn |

## Tóm tắt thay đổi

- `progress.js` tách biệt hoàn toàn khỏi quiz flow — chỉ đọc/ghi localStorage
- Progress được lưu sau mỗi Quiz Mode completion (hook vào showResult())
- Flashcard Mode không track trong v1 (knew/review ≠ correct/wrong)
- Dashboard hiển thị overall stats + breakdown theo 3 quiz types
- Reset có window.confirm() để tránh xóa nhầm, re-render ngay sau khi reset
- localStorage wrapped trong try/catch — fail silently nếu không khả dụng

## Giả định đã đưa ra

- `progress.js` expose functions vào global scope — quiz.js gọi trực tiếp, đúng với pattern script tag hiện tại
- `quizState.score` = số câu đúng; `wrongAnswers = totalQuestions - score` (bao gồm cả skip)
- Group-level tracking không làm trong v1

---

## Kết quả self-review

- [x] loadProgress() trả về default khi localStorage rỗng — pass
- [x] saveQuizProgress() cộng đúng vào overall và byType[quizType] — pass
- [x] showResult() gọi saveQuizProgress(), showFlashcardSummary() không gọi — pass
- [x] renderAccuracy() xử lý edge case totalQuestions = 0 → 'N/A' — pass
- [x] Reset có confirm, xóa đúng key, re-render về 0 — pass
- [x] Navigation mode-selection ↔ progress-screen không can thiệp quiz flow — pass
- [x] Script load order đúng trong HTML — pass
- [x] progressScreen hidden trong initial state — pass
- [x] Không regression rõ ràng ở Quiz Mode / Flashcard Mode — pass

## Kết quả runtime verify

Runtime verify tạm vô hiệu hóa — cần Nhật Phong sama verify thủ công trên localhost:5500.

---

## Docs updated

- [x] `current-features.md` — thêm Learning Progress Dashboard section
- [x] `current-flows.md` — cập nhật Entry Flow, thêm Progress Screen Flow, Back Button table
- [x] `architecture.md` — thêm Persistence layer, cập nhật script load order
- [x] `history/decisions.md` — 3 quyết định: tách progress.js, localStorage key, không track flashcard
- [x] `changelog.md` — thêm entry HIRA-005

---

## Vấn đề còn mở

- Flashcard Mode progress tracking chưa có — có thể tạo task riêng nếu cần
- Group-level breakdown chưa có — có thể mở rộng sau
