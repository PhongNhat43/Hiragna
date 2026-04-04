# Project Context

## Tên project
Japanese Character Quiz (tên repo: Hiragna)

## Loại
Web app học tiếng Nhật — pure HTML/CSS/JS, không framework, chạy trực tiếp trên browser.

## Mục tiêu
Giúp người học ghi nhớ ký tự tiếng Nhật thông qua quiz trắc nghiệm nhiều lựa chọn.

## Đối tượng
Người học tiếng Nhật ở trình độ sơ cấp.

## Cơ chế học
Hiển thị một ký tự (kana hoặc kanji), người dùng chọn đáp án đúng từ 4 lựa chọn.
- Hiragana/Katakana: chọn romaji đúng
- Kanji: chọn nghĩa tiếng Anh đúng

## Các chế độ quiz hiện tại
- **Hiragana** — 20 ký tự (あ〜と)
- **Katakana** — 20 ký tự (ア〜ト)
- **Kanji** — 27 ký tự N5 (numbers, nature, people)

## Ràng buộc kỹ thuật
- Không dùng framework (pure HTML/CSS/JS)
- Chạy được khi mở file trực tiếp, không cần server
- Toàn bộ quiz logic tách biệt khỏi UI rendering
- State tập trung trong `quizState` — không dùng biến global rời
