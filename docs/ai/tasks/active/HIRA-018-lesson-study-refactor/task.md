# Task: [HIRA-018] Refactor Học Mỗi Ngày thành Học Theo Bài

## Thông tin

- **ID:** HIRA-018
- **Ngày tạo:** 2026-06-08
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Refactor toàn bộ tính năng `Học Mỗi Ngày` hiện tại thành tính năng mới `Học Theo Bài`, tổ chức dữ liệu theo `Lesson -> Section -> vocabularies`, đồng bộ với 7 bài đầu Minna no Nihongo theo scope đã chốt, và thay đổi flow học sang `overview theo bài` → `learn-vocab` → `practice` → `summary`.

## Tiêu chí hoàn thành

- [ ] Dữ liệu bài học mới nằm ở file riêng theo cấu trúc `lessonsData`, có đủ 7 bài đầu và các section con theo scope yêu cầu.
- [ ] Overview render theo phân cấp bài lớn và section con, mỗi section có badge trạng thái dựa trên `sectionId`.
- [ ] Flow học section chỉ còn `learn-vocab` và `practice`, progress hiển thị linh hoạt theo tổng số từ thực tế của section.
- [ ] Quick practice luôn dùng format `jp -> meaning`, `secondary = reading`.
- [ ] Thuật toán distractor không render placeholder hard-code; nếu section ngắn phải quét ngược section trước trong cùng lesson để đủ 4 lựa chọn.
- [ ] Persistence lưu theo `sectionId`, set `in_progress` khi bắt đầu section và `completed` khi hoàn tất practice.

## Không thuộc phạm vi

- Đồng bộ dữ liệu thật từ nguồn ngoài hoặc fetch online.
- Session restore giữa chừng cho flow `Học Theo Bài`.
- Thay đổi logic quiz core của `src/quiz.js`.
