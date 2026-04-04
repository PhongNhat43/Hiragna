# Task: [HIRA-005] Learning Progress Dashboard + localStorage Persistence

## Ngày tạo
2026-03-31

## Mô tả
Thêm hệ thống lưu tiến trình học vào localStorage và màn hình Progress Dashboard để người dùng theo dõi thống kê.

## Yêu cầu
- Lưu tiến trình vào localStorage, còn sau khi reload trang
- Thống kê tổng: total quizzes, total questions, correct, wrong, accuracy %
- Thống kê theo quiz type: Hiragana / Katakana / Kanji
- Cập nhật progress sau mỗi quiz hoàn thành
- Màn hình Progress Dashboard hiển thị các thống kê
- Nút Reset Progress xóa toàn bộ dữ liệu
- Không phá vỡ các flow hiện có

## Phạm vi (scope)

**Files thay đổi:**
- `src/index.html` — thêm progress-screen, thêm "View Progress" button trên mode-selection-screen
- `src/quiz.js` — gọi saveProgress() sau showResult(), thêm navigation đến progress-screen
- `src/style.css` — styles cho progress-screen
- `src/progress.js` — **file mới** — localStorage utilities (load, save, reset)
- `src/hiraganaData.js` — không thay đổi

**Ngoài scope:**
- Flashcard Mode progress tracking (knew/review không ánh xạ sang correct/wrong — tách task sau)
- Group-level tracking (quá granular cho v1)
- Export/import dữ liệu

## Task size
Lớn — 4 files (3 sửa + 1 tạo mới), thêm màn hình mới, đổi script load order, quyết định kiến trúc mới.

## Tại sao tạo file progress.js riêng
quiz.js quản lý quiz flow — không nên ôm thêm trách nhiệm localStorage. progress.js là concern độc lập (load/save/reset data), không phụ thuộc vào quizState, dễ tái sử dụng và test riêng.
