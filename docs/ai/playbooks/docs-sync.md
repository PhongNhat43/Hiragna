# Docs Sync Playbook

Dùng sau khi implement để xác định docs nào cần cập nhật nhằm phản ánh current truth.

## Quy trình

1. Xác định nguồn context:
   - task folder nếu có
   - hoặc diff hiện tại nếu là task nhỏ
2. Với từng file docs chính, xác định:
   - cần update
   - không cần update
   - chưa chắc, cần hỏi thêm
3. Chỉ chỉnh phần liên quan trực tiếp đến task
4. Không sửa `src/`

## Docs Thường Liên Quan

- `docs/ai/product/current-features.md`
- `docs/ai/product/current-flows.md`
- `docs/ai/core/architecture.md`
- `docs/ai/core/glossary.md`
- `docs/ai/history/changelog.md`
- `docs/ai/history/decisions.md`
- `AGENTS.md` nếu task đổi workflow entrypoint
- `CLAUDE.md` nếu task đổi compatibility behavior

## Guardrails

- Docs phản ánh current state, không phản ánh ý định
- Nếu impact lớn hoặc mơ hồ, trình bày đề xuất trước khi sửa
