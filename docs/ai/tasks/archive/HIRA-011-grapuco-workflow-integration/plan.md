# Plan: [HIRA-011] Grapuco workflow integration

## Thông tin

- **Task size:** vừa
- **Docs impact:** có — `CLAUDE.md`, `.claude/rules/global.md`

## Phân tích yêu cầu

Nhúng Grapuco vào workflow hiện tại như công cụ hỗ trợ tùy chọn. Không thay đổi logic workflow cốt lõi. Mức độ dùng Grapuco tỉ lệ với task size và nhu cầu phân tích.

## Files bị ảnh hưởng

| File | Loại thay đổi |
|---|---|
| `CLAUDE.md` | Thêm mục Grapuco trong phần tài liệu/công cụ |
| `.claude/rules/global.md` | Thêm section rule Grapuco + checklist |
| `.claude/skills/project-audit/SKILL.md` | **Tạo mới** — skill audit dùng Grapuco ưu tiên |
| `.claude/skills/big-feature/SKILL.md` | Bổ sung 1 dòng Grapuco vào Bước 1 |
| `.claude/skills/diagnose-bug/SKILL.md` | Bổ sung 1 dòng Grapuco vào Bước 2 |
| `.claude/skills/small-change/SKILL.md` | Bổ sung 1 dòng nhẹ vào phần ràng buộc |

## Rủi ro

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Làm nặng workflow task nhỏ | Thấp | small-change chỉ thêm 1 dòng optional |
| Rule Grapuco quá dài, lặp lại | Thấp | Rule chính chỉ ở global.md, skills chỉ reference |

## Các bước thực hiện

1. Thêm section Grapuco vào `.claude/rules/global.md` (rule chính + checklist)
2. Thêm reference ngắn vào `CLAUDE.md`
3. Tạo skill `project-audit` mới
4. Bổ sung Grapuco vào `big-feature` (Bước 1)
5. Bổ sung Grapuco vào `diagnose-bug` (Bước 2)
6. Bổ sung Grapuco vào `small-change` (ràng buộc)

## Self-review plan

Sau khi implement, sẽ kiểm tra:
- [ ] Rule Grapuco không lặp lại dài dòng giữa các file
- [ ] Không sửa file ngoài scope
- [ ] Skill project-audit hoạt động độc lập
- [ ] small-change không bị thêm ceremony
- [ ] Checklist Grapuco rõ ràng, dùng được ngay
