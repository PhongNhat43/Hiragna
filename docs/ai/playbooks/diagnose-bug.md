# Diagnose Bug Playbook

Dùng khi bug chưa có root cause rõ ràng. Diagnosis và implement là hai bước tách biệt.

## Quy trình

1. Phân loại scope:
   - trong scope nếu do task hiện tại gây ra và nằm trong vùng đã duyệt
   - vượt scope nếu tồn tại từ trước, ngoài vùng đã duyệt, hoặc cần blast radius lớn
2. Trace bug bằng bằng chứng:
   - đọc code liên quan
   - trace flow từng bước
   - dùng Grapuco khi bug liên quan cross-file flow hoặc dependency
3. Kết luận root cause kèm bằng chứng mạnh nhất
4. Đề xuất fix tối thiểu
5. Chờ người dùng xác nhận trước khi implement

## Nếu bug còn trong scope

- cập nhật `plan.md` nếu cần
- sau khi được duyệt mới sửa
- cập nhật `result.md`

## Nếu bug vượt scope

- ghi nhận vào `result.md` của task hiện tại
- tạo task mới trong `docs/ai/tasks/active/`

## Guardrails

- Không vừa debug vừa tự sửa code
- Không mở rộng fix ngoài root cause đã xác định
