# Big Feature Playbook

Dùng cho task vừa/lớn: nhiều file, đổi flow/state, có rủi ro đáng kể, hoặc cần quyết định thiết kế trước khi code.

## Khi nào dùng

- thay đổi 2-3 file có đổi flow hoặc state
- thay đổi 4+ file
- chạm nhiều layer
- cần task docs để review và theo dõi xuyên session

## Quy trình

1. Đọc `AGENTS.md` và docs liên quan trong `docs/ai/core/` + `docs/ai/product/`
2. Audit impact, có thể dùng Grapuco nếu hữu ích
3. Phân loại task size
4. Tạo task folder trong `docs/ai/tasks/active/HIRA-XXX-slug/`
5. Viết `task.md` và `plan.md`
6. Trình bày plan, chờ duyệt
7. Implement đúng plan đã duyệt
8. Self-review
9. Cập nhật `result.md`
10. Đề xuất manual verify
11. Chỉ archive sau khi user verify và xác nhận đóng task

## Nội dung tối thiểu của plan

- impacted files
- risks
- assumptions
- implementation steps
- docs impact
- verification path

## Guardrails

- Không viết code trước khi plan được duyệt
- Không tự archive
- Nếu phát sinh bug, dùng `diagnose-bug.md`
