# Result: [HIRA-011] Grapuco workflow integration

## Files đã thay đổi

| File | Thay đổi |
|---|---|
| `.claude/rules/global.md` | Thêm section "Grapuco — code graph tool" (nguyên tắc, khi nào dùng, checklist) |
| `CLAUDE.md` | Thêm `/project-audit` vào danh sách skills + mục "Grapuco (code graph)" ngắn |
| `.claude/skills/project-audit/SKILL.md` | **Tạo mới** — skill audit ưu tiên Grapuco, 4 bước |
| `.claude/skills/big-feature/SKILL.md` | Bổ sung Grapuco vào Bước 1 (1 dòng) |
| `.claude/skills/diagnose-bug/SKILL.md` | Bổ sung Grapuco vào Bước 2 (1 dòng) |
| `.claude/skills/small-change/SKILL.md` | Bổ sung 1 dòng optional vào ràng buộc |

## Kết quả self-review

- [x] Rule Grapuco không lặp lại dài dòng — rule chính ở `global.md`, skills chỉ reference ngắn: trace `global.md:65-82` vs `big-feature:14` vs `diagnose-bug:17` vs `small-change:27`
- [x] Không sửa file ngoài scope — chỉ sửa 6 file đã liệt kê trong plan, không sửa `fix-bug`, `docs-sync`, `archive-task`, không sửa rule kỹ thuật khác
- [x] Skill `project-audit` hoạt động độc lập — có fallback khi Grapuco chưa index, có bước đối chiếu code thật
- [x] `small-change` không bị thêm ceremony — chỉ 1 dòng optional cuối ràng buộc
- [x] Checklist Grapuco rõ ràng — 3 items, dùng được ngay trong result.md

## Grapuco usage theo workflow

| Workflow | Mức độ dùng Grapuco |
|---|---|
| `/project-audit` | Ưu tiên mặc định |
| `/big-feature` | Dùng ở Bước 1 phân tích impact |
| `/diagnose-bug` | Dùng khi bug liên quan cross-file |
| `/small-change` | Chỉ khi cần xác định blast radius |
| `/fix-bug` | Không bắt buộc |
| `/docs-sync` | Không nhúng |
| `/archive-task` | Không nhúng |

Đã verify (self-review): tất cả 6 file đã sửa đúng scope, nội dung ngắn gọn, không lặp lại.
Chờ người dùng verify: đọc lại nội dung các file đã sửa, xác nhận rule phù hợp với ý định.
