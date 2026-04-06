# Task: [HIRA-011] Grapuco workflow integration

## Thông tin

- **ID:** HIRA-011
- **Ngày tạo:** 2026-04-05
- **Trạng thái:** active
- **Loại:** docs / workflow

## Mô tả

Thêm rule dùng Grapuco vào workflow hiện tại một cách có kiểm soát:
- Grapuco là công cụ hỗ trợ, không bắt buộc cho mọi task
- Ưu tiên dùng cho audit, impact analysis, dependency/flow tracing
- Trước khi sửa code hoặc kết luận quan trọng, vẫn phải đối chiếu code thật
- Không làm nặng ceremony cho task nhỏ

## Tiêu chí hoàn thành

- [ ] `CLAUDE.md` có mục Grapuco ngắn gọn
- [ ] `.claude/rules/global.md` có rule Grapuco
- [ ] Skill `project-audit` mới (chưa tồn tại)
- [ ] Skill `big-feature` bổ sung Grapuco ở bước phân tích
- [ ] Skill `diagnose-bug` bổ sung Grapuco ở bước trace
- [ ] Skill `small-change` bổ sung rule nhẹ
- [ ] Checklist Grapuco usage có trong rule chung

## Không thuộc phạm vi

- Không sửa source code (`src/`)
- Không sửa `fix-bug`, `docs-sync`, `archive-task`
- Không sửa các rule kỹ thuật khác (bug-handling, self-test, task-sizing, docs-sync)
