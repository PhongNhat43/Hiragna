# Hướng dẫn AI — Hiragana Quiz

## Tài liệu bắt buộc đọc trước khi làm việc

Đọc đủ 4 tài liệu sau trước khi phân tích hoặc thực hiện bất kỳ task nào:

- `docs/ai/core/context.md` — bối cảnh và mục tiêu project
- `docs/ai/core/architecture.md` — kiến trúc 3 lớp, config objects, quizState
- `.claude/rules/global.md` — quy tắc code và ngôn ngữ
- `docs/ai/product/current-features.md` — tính năng hiện tại
- `docs/ai/product/current-flows.md` — flow màn hình hiện tại

---

## Khi bắt đầu session mới

Trước khi nhận yêu cầu, kiểm tra `docs/ai/tasks/active/`:
- Nếu **có task đang mở**: đọc `task.md` và `result.md` (nếu có), surface cho người dùng — task nào đang active, đang ở bước nào — và hỏi có muốn tiếp tục không.
- Nếu **không có task nào**: tiến hành bình thường.

---

## Quy trình làm việc

1. Đọc `CLAUDE.md` và các tài liệu liên quan đến task hiện tại.
2. Phân loại yêu cầu:
   - chỉ phân tích → không sửa file
   - task nhỏ, rõ scope → phân tích ngắn, thống nhất rồi implement
   - task vừa/lớn, nhiều file, đổi flow hoặc có rủi ro → phải tạo hồ sơ task và lên plan trước
3. Với task vừa/lớn:
   - tạo task folder tại `docs/ai/tasks/active/HIRA-XXX-ten-task/`
   - điền `task.md`
   - điền `plan.md`
   - chờ duyệt plan
   - implement
   - cập nhật `result.md`
4. Nếu phát sinh bug:
   - bug còn trong scope → cập nhật plan/result và fix trong task hiện tại
   - bug vượt scope → tạo task bug mới
5. Chỉ archive khi:
   - code xong
   - `result.md` đã cập nhật
   - người dùng đã verify
   - người dùng xác nhận đóng task
6. Hội thoại không phải nơi lưu trạng thái duy nhất của task; task state phải sống trong repo.

Templates: `docs/ai/templates/task-record-template.md`, `plan-record-template.md`, `result-record-template.md`

Skills: `/small-change`, `/big-feature`, `/diagnose-bug`, `/docs-sync`, `/archive-task`

### Thay đổi tối thiểu

- Chỉ sửa các file trực tiếp liên quan đến task
- Không tự refactor code xung quanh
- Không thêm tính năng ngoài yêu cầu
- Không tạo file mới nếu không cần thiết

### Sau khi hoàn thành

Tóm tắt ngắn gọn:
- Danh sách file đã thay đổi
- Cách verify tính năng vừa làm

---

## Kiến trúc — tóm tắt nhanh

| Layer | File | Không được làm |
|---|---|---|
| UI | `src/index.html`, `src/style.css` | Chứa quiz logic |
| Logic | `src/quiz.js` | Lẫn UI render vào business logic |
| Data | `src/hiraganaData.js` | Đặt state rời ngoài `quizState` |

Chi tiết: `docs/ai/core/architecture.md` — Vùng nguy hiểm: `docs/ai/core/risk-zones.md`

---

## Self-check sau khi code

- [ ] Tất cả buttons clickable
- [ ] Skip question hoạt động
- [ ] Score cập nhật đúng
- [ ] Không phá vỡ tính năng hiện có

Kiểm tra đầy đủ: `docs/ai/templates/verification-checklist.md`

---

## Nguyên tắc chung

- Không sửa `src/` ngoài yêu cầu rõ ràng
- Không xóa tính năng đang hoạt động
