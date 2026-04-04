# Docs Sync Rules

## Nguyên tắc

Docs phản ánh current state của product, không phải ý định ban đầu.
Task hoàn tất mà docs không sync = docs đã lỗi thời.
Không được archive nếu docs cần sync mà chưa sync.

---

## Bắt buộc cập nhật trước khi archive

### Nếu task thay đổi behavior, flow, state, hoặc architecture:

| Tài liệu | Cập nhật khi |
|---|---|
| `docs/ai/product/current-features.md` | Thêm/xóa/sửa feature |
| `docs/ai/product/current-flows.md` | Thay đổi flow màn hình hoặc state reset |
| `docs/ai/core/architecture.md` | Thêm config object, thay đổi quizState, thay đổi script load |
| `docs/ai/core/glossary.md` | Thêm term mới vào codebase |

### Sau mỗi task archive:

| Tài liệu | Nội dung |
|---|---|
| `docs/ai/history/changelog.md` | Thêm entry: ID, tên, ngày, tóm tắt, files thay đổi |

### Nếu task có quyết định kiến trúc quan trọng:

| Tài liệu | Nội dung |
|---|---|
| `docs/ai/history/decisions.md` | Ghi quyết định và lý do |

---

## Task không cần sync product docs

Task không thay đổi behavior/flow/state/architecture (fix typo, style tweak nhỏ)
→ không bắt buộc cập nhật product docs, nhưng vẫn phải cập nhật changelog.

---

## Tài liệu không cập nhật trong task thường

- `docs/ai/core/context.md` — chỉ khi project đổi mục tiêu hoặc platform
- `docs/ai/core/risk-zones.md` — chỉ khi phát hiện risk zone mới
- Templates — không cập nhật trong task thường
