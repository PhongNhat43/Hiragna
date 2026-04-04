# Result: [HIRA-000] Thiết lập hệ thống quản lý task

## Ngày hoàn thành

2026-03-30

## Files đã thay đổi

| File | Thay đổi chính |
|---|---|
| `docs/ai/tasks/active/` | Tạo mới |
| `docs/ai/tasks/archive/` | Tạo mới |
| `docs/ai/templates/task-record-template.md` | Tạo mới |
| `docs/ai/templates/plan-record-template.md` | Tạo mới |
| `docs/ai/templates/result-record-template.md` | Tạo mới |
| `CLAUDE.md` | Thêm section "Workflow task" |
| `.claude/rules/global.md` | Thêm quy tắc tạo/cập nhật hồ sơ task |

## Tóm tắt thay đổi

Thiết lập hệ thống quản lý task tích hợp vào cấu trúc Claude Code style.
Workflow mới yêu cầu mỗi task vừa/lớn phải có hồ sơ riêng trong `docs/ai/tasks/active/`
trước khi bắt đầu implement. Trạng thái task không còn phụ thuộc vào lịch sử hội thoại.

## Giả định đã đưa ra

- Task nhỏ (1 file, rõ ràng) không bắt buộc tạo hồ sơ
- Thời điểm move từ `active/` sang `archive/` do người dùng quyết định

## Cách verify

- `bash scripts/verify.sh` chạy xanh
- Thư mục `docs/ai/tasks/active/HIRA-000-workflow-bootstrap/` tồn tại đủ 3 file

## Vấn đề còn mở

- Chưa có quy ước đặt tên task ID (HIRA-XXX) hay quy trình tăng số thứ tự
