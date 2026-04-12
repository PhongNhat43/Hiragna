# Task: [HIRA-016] Migrate Repo Workflow from Claude Style to Codex Style

## Thông tin

- **ID:** HIRA-016
- **Ngày tạo:** 2026-04-12
- **Trạng thái:** complete
- **Loại:** docs / workflow

## Mô tả

Audit workflow hiện tại của repo Hiragna và đề xuất migration plan thực dụng để chuyển từ mô hình "Claude style" sang "Codex style" cho Codex desktop app.

Mục tiêu là:
- thêm `AGENTS.md` ở root làm entrypoint instruction mới cho Codex
- giữ lại phần nào của task system hiện tại nếu vẫn hữu ích
- chuẩn hóa instruction discovery để Codex đọc đúng entrypoint, task docs, verification recipes
- đề xuất policy phù hợp cho project/thread/worktree trong Codex desktop app
- giữ workflow mặc định: **audit → plan → chờ duyệt → implement**

Task này chỉ tạo hồ sơ và kế hoạch migration. Chưa implement thay đổi repo thật, chưa viết `AGENTS.md` final.

## Tiêu chí hoàn thành

- [ ] Có audit ngắn về workflow hiện tại và inventory các file đang phục vụ Claude style
- [ ] Có kết luận file nào nên giữ, hợp nhất, deprecated, hoặc thay vai trò
- [ ] Có đánh giá mức độ tái sử dụng của `docs/ai/tasks/...`
- [ ] Có plan migration thực dụng cho Codex style, không đập đi làm lại toàn bộ
- [ ] Có đề xuất cấu trúc `AGENTS.md`
- [ ] Có đề xuất task/template normalization cho Codex
- [ ] Có policy rõ cho thread/worktree trong Codex desktop app
- [ ] Có verification/setup recipes ngắn
- [ ] Có phases, impacted files, risks, acceptance criteria, pilot strategy
- [ ] Chỉ tạo `task.md` và `plan.md` để chờ duyệt, chưa sửa workflow production

## Không thuộc phạm vi

- Chưa tạo `AGENTS.md` final
- Chưa đổi tên, xóa, hay merge file workflow production
- Chưa cập nhật `scripts/verify.sh`
- Chưa migrate `.claude/` sang cấu trúc mới
- Chưa sửa template hiện có ngoài việc đề xuất trong plan
