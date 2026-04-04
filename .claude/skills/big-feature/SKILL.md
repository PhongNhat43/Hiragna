---
name: big-feature
description: Xử lý feature vừa/lớn (nhiều file, đổi flow/state, rủi ro đáng kể). Đọc tài liệu → tạo task folder → plan → chờ duyệt → implement → sync docs → archive.
disable-model-invocation: true
---

Feature mới: $ARGUMENTS

Workflow bắt buộc — chưa code cho đến khi plan được duyệt:

**Bước 1 — Đọc tài liệu:**
- `CLAUDE.md`
- Các tài liệu liên quan trực tiếp đến task (`docs/ai/core/`, `docs/ai/product/`)

**Bước 2 — Phân loại task size** theo `.claude/rules/task-sizing.md`.

**Bước 3 — Tạo task folder** tại `docs/ai/tasks/active/HIRA-XXX-ten-task/`:
- `task.md` — mô tả, scope, files bị ảnh hưởng, overlap tính năng hiện có
- `plan.md` — impacted files, risks, quyết định thiết kế, các bước implement, docs impact

**Bước 4 — Trình bày tóm tắt plan.** Chờ người dùng duyệt.

**Bước 5 — Implement** theo đúng plan đã duyệt.

**Bước 6 — Self-review** sau khi implement xong.

**Bước 7 — Cập nhật `result.md`** với kết quả thực tế.

**Bước 8 — Đề xuất người dùng verify.** Chờ xác nhận.

**Bước 9 — Sync docs + archive** chỉ khi người dùng xác nhận đóng task (theo `.claude/rules/docs-sync.md`).

Ràng buộc:
- Không viết code trước bước 5
- Không tự archive — chỉ archive khi người dùng xác nhận rõ ràng
- Nếu phát sinh bug → dùng `/diagnose-bug`
