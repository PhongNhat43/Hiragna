# Archive Task Playbook

Dùng khi task đã implement xong, self-review xong, người dùng đã verify, và muốn đóng task.

## Quy trình

1. Xác định task cần archive trong `docs/ai/tasks/active/`
2. Đọc `task.md`, `plan.md`, `result.md`
3. Kiểm tra điều kiện:
   - implement xong
   - `result.md` đủ nội dung
   - không còn open issues chưa được ghi nhận đúng
   - người dùng đã verify và xác nhận đóng task
4. Xác định docs impact và sync nếu cần
5. Tóm tắt ngắn trước khi move
6. Chỉ sau xác nhận cuối cùng mới move task sang `archive/`

## Docs Thường Cần Kiểm Tra

- `docs/ai/product/current-features.md`
- `docs/ai/product/current-flows.md`
- `docs/ai/core/architecture.md`
- `docs/ai/history/changelog.md`
- `docs/ai/history/decisions.md`
- `AGENTS.md`
- `CLAUDE.md`

## Guardrails

- Không archive khi còn open issues chưa được ghi nhận
- Không archive khi docs cần sync mà chưa sync
- Không sửa `src/` ở bước này
