# Task: [HIRA-002] Question History

## Thông tin

- **ID:** HIRA-002
- **Ngày tạo:** 2026-03-29
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Theo dõi toàn bộ câu hỏi đã trả lời trong suốt một lần quiz. Sau khi quiz kết thúc, hiển thị thêm nút "Review All" để người dùng xem lại tất cả câu hỏi — bao gồm cả câu đúng và sai.

Tính năng này độc lập với "Review Mistakes" hiện tại (chỉ hiện khi có lỗi và bị điều khiển bởi `reviewEnabled`). "Review All" luôn xuất hiện sau khi quiz kết thúc.

## Yêu cầu chi tiết

- Track tất cả câu hỏi đã trả lời (đúng, sai, bỏ qua) vào `questionHistory[]`
- Sau quiz, hiển thị nút "Review All" (không gated bởi `reviewEnabled`)
- Mỗi entry trong review all hiển thị: kana, đáp án người dùng chọn, đáp án đúng, trạng thái đúng/sai
- Không thay đổi logic quiz chính (scoring, advance, review mistakes)

## Tiêu chí hoàn thành

- [ ] `questionHistory` được track đầy đủ cho tất cả câu hỏi (đúng, sai, skip)
- [ ] Nút "Review All" xuất hiện sau quiz kết thúc, luôn luôn (không phụ thuộc vào reviewEnabled)
- [ ] Review All hiển thị đúng: kana, userAnswer, correctRomaji, isCorrect
- [ ] Reset `questionHistory` khi start quiz mới và khi restart
- [ ] Không phá vỡ "Review Mistakes" hiện tại

## Không thuộc phạm vi

- Không thay đổi logic tính điểm
- Không thay đổi flow quiz type → difficulty → group → settings
- Không sửa style.css vượt quá mức tối thiểu cần thiết
