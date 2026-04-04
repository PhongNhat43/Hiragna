# Task: [HIRA-000] Thiết lập hệ thống quản lý task

## Thông tin

- **ID:** HIRA-000
- **Ngày tạo:** 2026-03-30
- **Trạng thái:** complete
- **Loại:** docs

## Mô tả

Thiết lập hệ thống quản lý task theo mô hình mỗi task một thư mục riêng,
tích hợp vào cấu trúc Claude Code style hiện có của repo.

Mỗi task bao gồm 3 file: `task.md`, `plan.md`, `result.md`.
Task đang hoạt động nằm trong `active/`, hoàn tất được chuyển vào `archive/`.

## Tiêu chí hoàn thành

- [x] Tạo thư mục `docs/ai/tasks/active/` và `docs/ai/tasks/archive/`
- [x] Tạo 3 file template: `task-record-template.md`, `plan-record-template.md`, `result-record-template.md`
- [x] Cập nhật `CLAUDE.md` với quy tắc workflow task
- [x] Cập nhật `.claude/rules/global.md` với hành vi mặc định mới
- [x] Tạo task mẫu HIRA-000 để minh họa cách dùng

## Không thuộc phạm vi

- Không sửa product code (`src/`)
- Không sửa `results/`
- Không tạo skill, hook, hoặc subagent
