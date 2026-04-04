# Task: [HIRA-001] Quiz Group Filter

## Thông tin

- **ID:** HIRA-001
- **Ngày tạo:** 2026-03-30
- **Trạng thái:** complete
- **Loại:** feature

## Mô tả

Trước khi bắt đầu quiz, người dùng có thể chọn một nhóm kana để giới hạn
phạm vi câu hỏi. Quiz chỉ lấy câu hỏi từ nhóm đã chọn.

Áp dụng cho cả Hiragana và Katakana vì nhóm được định nghĩa theo romaji,
dùng chung cho cả hai dataset.

## Các nhóm ban đầu

| Group ID | Label | Kana |
|---|---|---|
| `all` | All | Toàn bộ dataset |
| `basic_vowels` | Basic vowels | a, i, u, e, o |
| `k_group` | K-group | ka, ki, ku, ke, ko |
| `s_group` | S-group | sa, shi, su, se, so |

## Tiêu chí hoàn thành

- [ ] Màn hình chọn group xuất hiện đúng vị trí trong flow
- [ ] Chọn group → quiz chỉ ra câu hỏi từ nhóm đó
- [ ] Hoạt động với cả Hiragana và Katakana
- [ ] Restart reset group về `all` và quay về màn hình quiz type
- [ ] Không phá vỡ flow hiện tại (difficulty, settings, auto-advance, review)

## Không thuộc phạm vi

- Không thêm group ngoài 4 nhóm đã liệt kê ở trên
- Không thay đổi logic quiz (scoring, advance, review)
- Không sửa style.css vượt quá mức tối thiểu cần thiết
