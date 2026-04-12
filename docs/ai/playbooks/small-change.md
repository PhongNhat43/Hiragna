# Small Change Playbook

Dùng cho task nhỏ: 1-2 file, scope rõ, không đổi flow lớn, rủi ro thấp.

## Điều kiện

Task nhỏ khi đủ các dấu hiệu sau:

- thay đổi 1 file, hoặc 2 file rất cục bộ
- không đổi flow màn hình hoặc state structure
- có thể mô tả gọn trong 2-3 câu

Nếu không chắc, nâng lên `big-feature.md`.

## Quy trình

1. Phân tích ngắn:
   - file bị ảnh hưởng
   - rủi ro chính nếu có
   - mini-plan
2. Chờ người dùng xác nhận
3. Implement đúng mini-plan
4. Self-review diff và logic liên quan

## Guardrails

- Không tạo task folder trừ khi người dùng yêu cầu hoặc scope phình ra
- Không mở rộng scope, không refactor xung quanh
- Nếu phát sinh bug, chuyển sang `diagnose-bug.md`
- Có thể dùng Grapuco cho blast radius, nhưng không bắt buộc

## Report

- impacted files
- vì sao scope vẫn là task nhỏ
- self-review
- manual verify path nếu cần
