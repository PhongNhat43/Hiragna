# Task: [HIRA-013] Kana Coverage & Adaptive Quiz

## Thông tin

- **ID:** HIRA-013
- **Ngày tạo:** 2026-04-07
- **Trạng thái:** active
- **Loại:** feature

## Mô tả

Hai vấn đề cần giải quyết theo thứ tự:

1. **Dataset thiếu hụt nghiêm trọng**: Hiragana và katakana hiện chỉ có 20/46 ký tự cơ bản. Thiếu toàn bộ các hàng な, は, ま, や, ら, わ và ん. GROUP_CONFIG không phản ánh coverage thực tế.

2. **Quiz mixing không thông minh**: Selection hiện tại là tuần tự đơn giản — không phân biệt item yếu/mạnh, không tránh lặp gần, không ưu tiên item mới. Cần adaptive algorithm dựa trên per-item stats.

Sau hai phase cốt lõi trên, mở rộng tiếp sang dakuten/handakuten và yoon.

## Tiêu chí hoàn thành

- [ ] Phase 1: Hiragana + Katakana có đủ 46 ký tự cơ bản, GROUP_CONFIG có đủ group tương ứng
- [ ] Phase 2: Adaptive quiz V1 hoạt động — item yếu xuất hiện nhiều hơn, item vừa gặp không lặp ngay, item mới được introduce đủ
- [ ] Phase 3: Dakuten (が/ざ/だ/ば行) và handakuten (ぱ行) được thêm vào data và GROUP_CONFIG
- [ ] Phase 4: Yoon được thêm vào data và GROUP_CONFIG
- [ ] Không phá vỡ tính năng hiện có (quiz, flashcard, weak-review, PT, session restore)

## Không thuộc phạm vi

- Thay đổi UI/flow màn hình
- Kanji expansion
- Pronunciation Trainer content mới
- Thay đổi kiến trúc 3 lớp (UI/Logic/Data)
