# Task: [HIRA-019] Phase 4 — Dựng khung chính + Học từ vựng

## Thông tin

- **ID:** HIRA-019
- **Ngày tạo:** 2026-11-10
- **Trạng thái:** active
- **Loại:** feature
- **Spec nguồn:** file `Hiragna-Task-Phase4-Khung-Chinh.md` (do Rika/Phong cung cấp — nghiệp vụ đã chốt, user yêu cầu thực hiện trực tiếp)

## Mô tả

Dựng bộ khung chính của app theo nghiệp vụ đã chốt: màn hình chính gồm 6 mục (Học từ vựng, Học ngữ pháp, Ôn tập, Luyện tập, Theo dõi tiến độ, Tìm kiếm / tra cứu). Chỉ "Học từ vựng" làm đầy đủ chức năng (3 tầng + vòng Học → Luyện → Ôn với spaced repetition); 5 mục còn lại là màn hình trống placeholder. Không làm đẹp UI.

## Tiêu chí hoàn thành

- [x] Mở web thấy 6 mục chính đúng thứ tự
- [x] 5 mục ngoài chỉ hiển thị, bấm vào không lỗi, không chức năng giả
- [x] Học từ vựng: mặc định dọc, đổi ngang trong Cài đặt, nhớ lựa chọn sau reload
- [x] Màn Học: thẻ lật, Đã nhớ / Chưa nhớ
- [x] Màn Luyện: 5 câu, tối đa 7 khi có sai lặp, 4 dạng xoay vòng, chấm ngay, không đổi đáp án
- [x] Màn Ôn: chỉ từ đến hạn, tối đa 10/buổi, không từ mới, trả lời xong biến khỏi danh sách
- [x] Không lỗi console, không vỡ layout mobile (CSS ≤480px parse đúng; đã test viewport desktop)

Chi tiết verify: xem `result.md`.

## Phạm vi

### Làm
- Màn hình chính 6 mục + giữ nút chức năng hiện có ở khu phụ
- Học từ vựng: bảng chữ (5 ký tự/bài), từ vựng Minna 7 bài (unit 5-7 từ), chi tiết Kanji (số nét, bộ thủ, từ liên quan)
- Vòng Học → Luyện → Ôn, SRS per item, cài đặt riêng

### Không làm
- Đẹp UI, đổi kiến trúc, tách quiz.js, đổi key localStorage cũ, framework/dependency
- Chức năng thật cho 5 mục ngoài
- N4/N3 nội dung chi tiết

## Ghi nhận thiết kế

- `hiragna_item_stats` hiện không có `dueAt`/`interval` → **không đủ** để tính ngày ôn per item. Thêm key mới `hiragna_vocab_srs` cho lịch ôn; vẫn dùng `updateItemStat` + `pickWeighted` (thuật toán có sẵn) cho ưu tiên độ yếu khi chọn batch ôn. Chi tiết ghi trong `result.md`.
- Từ vựng Minna nâng cấp chính tả hiragana → Kanji N5 (cùng nghĩa, cùng reading) để phục vụ tầng 2-3.
