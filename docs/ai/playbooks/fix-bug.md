# Fix Bug Playbook

Dùng khi root cause đã rõ và hướng sửa đã được người dùng đồng ý.

## Điều kiện trước khi sửa

Chỉ implement khi đã có đủ:

- root cause rõ ràng
- bằng chứng cụ thể
- hướng sửa được duyệt
- đã xác định bug còn trong scope hay đã tách task riêng

Nếu chưa đủ, quay lại `diagnose-bug.md`.

## Quy trình

1. Đọc context của task hoặc bug task liên quan
2. Liệt kê file bị ảnh hưởng
3. Dừng nếu file vượt scope đã duyệt
4. Implement fix tối thiểu
5. Self-review:
   - fix đúng root cause
   - không tạo regression rõ
   - không sửa ngoài scope
6. Cập nhật `result.md` và `plan.md` nếu cần
7. Đưa manual verify steps

## Guardrails

- Không chẩn đoán lại từ đầu nếu bug còn mơ hồ
- Không mở rộng sang refactor hoặc feature ngoài bug
- Không archive task ở playbook này
