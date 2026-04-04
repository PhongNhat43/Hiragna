# Plan: [HIRA-000] Thiết lập hệ thống quản lý task

## Phân tích yêu cầu

Repo hiện tại dùng Claude Code style template với `docs/ai/` cho tài liệu AI.
Cần bổ sung lớp `tasks/` để quản lý tiến độ các task vừa và lớn,
đảm bảo trạng thái không bị mất giữa các conversation.

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `docs/ai/tasks/active/` | Tạo mới (thư mục) |
| `docs/ai/tasks/archive/` | Tạo mới (thư mục) |
| `docs/ai/templates/task-record-template.md` | Tạo mới |
| `docs/ai/templates/plan-record-template.md` | Tạo mới |
| `docs/ai/templates/result-record-template.md` | Tạo mới |
| `CLAUDE.md` | Cập nhật — thêm quy tắc workflow task |
| `.claude/rules/global.md` | Cập nhật — thêm hành vi mặc định liên quan task |

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| CLAUDE.md quá dài | Thấp | Chỉ thêm 1 section ngắn |
| Template quá phức tạp | Thấp | Giữ tối thiểu, thực dụng |

## Các bước thực hiện

1. Tạo thư mục `docs/ai/tasks/active/` và `docs/ai/tasks/archive/`
2. Tạo 3 file template trong `docs/ai/templates/`
3. Cập nhật `CLAUDE.md`
4. Cập nhật `.claude/rules/global.md`
5. Tạo task mẫu HIRA-000

## Cách verify

- Chạy `bash scripts/verify.sh` — không được fail
- Kiểm tra 3 thư mục task tồn tại đúng vị trí
- Kiểm tra 3 template mới trong `docs/ai/templates/`
