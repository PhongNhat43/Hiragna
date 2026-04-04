# Task: [HIRA-003] Kanji Mode

## Thông tin

- **ID:** HIRA-003
- **Ngày tạo:** 2026-03-30
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Thêm Kanji như một chế độ học mới, ngang hàng với Hiragana và Katakana. Người dùng chọn "Kanji" tại màn hình quiz type, sau đó đi qua đúng flow hiện tại (difficulty → group filter → settings → quiz).

Format quiz: hiển thị ký tự kanji, người dùng chọn nghĩa tiếng Anh đúng.

## Dataset ban đầu (N5)

| Nhóm | Kanji | Nghĩa |
|---|---|---|
| Numbers | 一二三四五六七八九十百千 | one, two, ... thousand |
| Nature | 山川木火水土日月 | mountain, river, tree, fire, water, earth, sun, moon |
| People | 人口女男子父母 | person, mouth, woman, man, child, father, mother |

## Tiêu chí hoàn thành

- [ ] Nút "Kanji" xuất hiện trên màn hình quiz type selection
- [ ] Group filter hiển thị đúng nhóm cho từng quiz type (Kanji có nhóm riêng)
- [ ] Quiz Kanji hoạt động đúng: hiện kanji, chọn nghĩa
- [ ] Không phá vỡ Hiragana/Katakana flow
- [ ] Restart reset đúng về quiz type screen

## Không thuộc phạm vi

- Không thêm readings (onyomi/kunyomi) — chỉ dùng nghĩa tiếng Anh
- Không thay đổi logic quiz (scoring, advance, review)
- Không sửa style.css vượt quá mức tối thiểu
