# Verification Playbook

Dùng để self-review và ghi claim trạng thái sau khi implement.

## Nguyên tắc

- Không claim "xong" nếu chưa có bằng chứng
- Self-review luôn bắt buộc
- Runtime verify chỉ claim khi thật sự chạy và đọc được output phù hợp

## Self-Review Checklist

- trace logic ở vùng đã sửa
- xác nhận không vượt scope đã duyệt
- kiểm tra regression rõ ràng ở flow liên quan
- kiểm tra stale references trong docs nếu task chạm workflow/docs

## Theo loại task

### UI / flow change

- trace transitions, state reset, entry/exit points

### Bug fix

- xác nhận fix đúng root cause
- kiểm tra logic liên quan không bị ảnh hưởng rõ ràng

### Docs / workflow change

- chạy `bash scripts/verify.sh`
- kiểm tra references mới và legacy shims

## Cách ghi kết quả

Trong `result.md`, ghi rõ:

- các check đã pass kèm bằng chứng ngắn
- phần nào mới chỉ self-review
- phần nào còn chờ manual verify của người dùng
