# Workflow Main

Tài liệu này cô đọng toàn bộ workflow đang dùng trong project theo mô hình Codex-first. Phạm vi của tài liệu này chỉ gồm:

- cách làm việc
- quy trình theo vòng đời task
- cách tổ chức thư mục và tài liệu
- các playbooks / skills hiện có

Tài liệu này không mô tả codebase hay chi tiết implementation của product.

---

## 1. Entry Point Và Source Of Truth

### Entry point chính

- `AGENTS.md` là entrypoint instruction chính của repo
- `CLAUDE.md` được giữ như compatibility shim

### Discovery order

Khi bắt đầu một task, thứ tự đọc tài liệu chuẩn là:

1. `AGENTS.md`
2. Task folder liên quan trong `docs/ai/tasks/active/`
3. `docs/ai/core/`
4. `docs/ai/product/`
5. `docs/ai/playbooks/`

### Nguyên tắc source of truth

- Workflow hiện tại được định nghĩa bởi `AGENTS.md` + `docs/ai/playbooks/`
- Task state sống trong `docs/ai/tasks/...`
- Lịch sử task đã đóng sống trong `docs/ai/history/changelog.md`
- `CLAUDE.md` không còn là nguồn điều phối chính

---

## 2. Workflow Mặc Định

Workflow chuẩn cho feature, bug fix, refactor, flow change:

1. Audit context và impacted files
2. Lên plan trước khi code
3. Chờ người dùng duyệt
4. Implement đúng plan đã duyệt
5. Self-review
6. Ghi verification và manual verify path
7. Chỉ archive khi user xác nhận đóng task

### Quy tắc cốt lõi

- Không code trước khi plan được duyệt với task vừa/lớn
- Không claim "xong" nếu chưa có bằng chứng
- Không tự archive task khi người dùng chưa xác nhận đóng
- Nếu scope phình ra hoặc phát hiện root cause khác, phải cập nhật lại plan hoặc tách task

---

## 3. Phân Loại Task

### Task nhỏ

Dùng khi:

- thay đổi 1 file, hoặc 2 file rất cục bộ
- không đổi flow lớn
- không đổi state structure
- có thể mô tả gọn trong 2-3 câu

Cách làm:

1. Audit ngắn
2. Mini-plan
3. Chờ xác nhận
4. Implement
5. Self-review

Thông thường không cần tạo task folder, trừ khi user yêu cầu hoặc scope bắt đầu phình ra.

### Task vừa / lớn

Dùng khi:

- đổi flow hoặc state
- chạm nhiều file
- có rủi ro regression đáng kể
- cần theo dõi qua nhiều lượt hoặc nhiều session

Cách làm:

1. Audit có bằng chứng
2. Tạo task folder
3. Viết `task.md` và `plan.md`
4. Trình bày plan
5. Chờ duyệt
6. Implement
7. Viết `result.md`
8. Đề xuất manual verify
9. Archive khi closure conditions đủ

---

## 4. Quy Trình Theo Loại Công Việc

### Feature / flow change

Luồng chuẩn:

1. Audit impacted files
2. Phân loại task size
3. Nếu là task vừa/lớn thì tạo task docs
4. Viết plan
5. Chờ duyệt
6. Implement theo plan
7. Self-review
8. Manual verify
9. Archive

### Bug

Diagnosis và fix là hai bước tách biệt.

Luồng chuẩn:

1. Diagnose trước
2. Xác định root cause bằng bằng chứng
3. Đề xuất fix tối thiểu
4. Chờ duyệt
5. Implement fix
6. Self-review
7. Manual verify

Nếu bug vượt scope task hiện tại:

- ghi nhận vào `result.md` của task hiện tại nếu cần
- tạo task mới trong `docs/ai/tasks/active/`

### Docs / workflow change

Luồng chuẩn:

1. Audit doc structure hiện tại
2. Xác định file docs nào là current truth
3. Viết plan nếu thay đổi chạm nhiều entrypoints hoặc playbooks
4. Implement docs patch
5. Chạy `bash scripts/verify.sh`
6. Self-review links, references, shims

---

## 5. Verification Và Reporting

### Self-review là bắt buộc

Sau khi implement phải tự kiểm tra:

- logic đã sửa có đúng không
- có vượt scope đã duyệt không
- có regression rõ ràng ở flow liên quan không
- docs / references có stale không nếu task chạm workflow

### Cách ghi verification

Trong `result.md` phải ghi rõ:

- đã verify bằng cách nào
- phần nào là self-review
- phần nào còn cần user manual verify

### Workflow/docs task

Với task workflow hoặc docs, phải chạy:

```bash
bash scripts/verify.sh
```

### Không được claim

Không được nói:

- "đã xong"
- "đã ổn"
- "đã pass"

nếu chưa có bằng chứng phù hợp.

---

## 6. Closure Conditions

Một task chỉ được đóng/archive khi đủ:

1. implementation đã xong
2. self-review đã xong
3. verification đã được ghi rõ
4. user đã xác nhận đóng task

Ngoài ra:

- `result.md` phải đủ nội dung
- changelog phải được cập nhật khi archive
- không còn blocker chưa được ghi nhận đúng

---

## 7. Thread / Worktree Policy

### Thread policy

- một thread nên gắn với một task chính
- không trộn nhiều task lớn trong cùng một thread nếu có thể tránh

### Worktree policy

Dùng worktree riêng khi:

- task kéo dài
- task chạm nhiều file
- có nhiều task active song song

Nguyên tắc:

- task docs trong `docs/ai/tasks/...` vẫn là source of truth
- worktree chỉ là môi trường làm việc, không thay thế task record

---

## 8. Cấu Trúc Thư Mục Tài Liệu

### Root level

```text
AGENTS.md
CLAUDE.md
workFlow_main.md
docs/
```

### `docs/ai/`

```text
docs/ai/
├── core/
├── product/
├── playbooks/
├── tasks/
│   ├── active/
│   └── archive/
├── history/
└── templates/
```

### Ý nghĩa từng khu vực

#### `docs/ai/core/`

Chứa tài liệu nền tảng, tương đối ổn định:

- `context.md`
- `architecture.md`
- `glossary.md`
- `risk-zones.md`

Mục tiêu:

- cung cấp bối cảnh dài hạn
- chỉ ra vùng rủi ro
- cung cấp từ điển thuật ngữ

#### `docs/ai/product/`

Chứa current truth về product:

- `current-features.md`
- `current-flows.md`

Mục tiêu:

- mô tả hệ thống đang có thật ở hiện tại
- dùng để sync sau mỗi task có impact

#### `docs/ai/playbooks/`

Chứa workflow procedural theo từng loại việc:

- `project-audit.md`
- `small-change.md`
- `big-feature.md`
- `diagnose-bug.md`
- `fix-bug.md`
- `verification.md`
- `docs-sync.md`
- `archive-task.md`

#### `docs/ai/tasks/active/`

Chứa các task đang mở.

Format:

```text
docs/ai/tasks/active/HIRA-XXX-slug/
```

Mỗi task folder chuẩn gồm:

- `task.md`
- `plan.md`
- `result.md`

#### `docs/ai/tasks/archive/`

Chứa các task đã đóng hoàn toàn.

Format giữ nguyên:

```text
docs/ai/tasks/archive/HIRA-XXX-slug/
```

#### `docs/ai/history/`

Chứa lịch sử và quyết định:

- `changelog.md`
- `decisions.md`

#### `docs/ai/templates/`

Chứa templates và checklist tái sử dụng:

- `task-record-template.md`
- `plan-record-template.md`
- `result-record-template.md`
- `review-checklist.md`
- `verification-checklist.md`

---

## 9. Template Task Folder

### `task.md`

Mục đích:

- mô tả task là gì
- định nghĩa completion criteria
- ghi rõ out-of-scope

Thông tin thường có:

- ID
- ngày tạo
- trạng thái
- loại task
- mô tả
- tiêu chí hoàn thành
- không thuộc phạm vi

### `plan.md`

Mục đích:

- biến yêu cầu thành plan có thể implement
- làm rõ impacted files, risks, assumptions, verification path

Thông tin thường có:

- task size
- docs impact
- phân tích yêu cầu
- files bị ảnh hưởng
- rủi ro
- các bước thực hiện
- self-review plan
- runtime/manual verify plan

### `result.md`

Mục đích:

- chốt những gì đã làm thật
- ghi verification
- ghi manual verify
- ghi docs impact

Thông tin thường có:

- trạng thái
- files changed
- thay đổi chính
- self-review
- manual verify steps
- docs updated
- vấn đề còn mở

---

## 10. Playbooks / Skills Hiện Có

Repo hiện đang dùng các workflow skills ở mức project documentation thông qua `docs/ai/playbooks/`.

### 1. `project-audit`

Dùng khi:

- cần audit một phần hoặc toàn bộ repo
- cần impact analysis
- cần blast radius
- cần architecture / flow findings

Output mong muốn:

- audit ngắn
- key findings
- impacted areas / files
- assumptions hoặc confidence level

### 2. `small-change`

Dùng khi:

- scope nhỏ
- file impact ít
- không đổi flow lớn

Yêu cầu báo cáo:

- impacted files
- vì sao scope vẫn nhỏ
- self-review
- manual verify path

### 3. `big-feature`

Dùng khi:

- task vừa/lớn
- nhiều file
- đổi flow/state
- cần task docs để review qua nhiều lượt

### 4. `diagnose-bug`

Dùng khi:

- bug chưa rõ nguyên nhân

Nguyên tắc:

- trace bằng bằng chứng
- không vừa diagnose vừa fix

### 5. `fix-bug`

Dùng khi:

- root cause đã rõ
- hướng sửa đã được duyệt

Nguyên tắc:

- fix tối thiểu
- không mở rộng ngoài root cause

### 6. `verification`

Dùng khi:

- cần self-review
- cần chuẩn hóa cách claim verification

### 7. `docs-sync`

Dùng khi:

- task đã thay đổi current truth của docs
- cần xác định doc nào phải sync

### 8. `archive-task`

Dùng khi:

- task hoàn tất
- self-review xong
- verification đủ
- user đã xác nhận đóng task

---

## 11. Cách Làm Việc Thực Tế

### Khi nhận task mới

1. đọc `AGENTS.md`
2. kiểm tra có task active liên quan không
3. đọc `docs/ai/core/` và `docs/ai/product/` nếu cần
4. phân loại task nhỏ hay vừa/lớn
5. chọn playbook phù hợp

### Khi làm task vừa/lớn

1. tạo task folder
2. viết `task.md`
3. viết `plan.md`
4. chờ duyệt
5. implement
6. cập nhật `result.md`
7. self-review
8. manual verify
9. archive

### Khi làm task nhỏ

1. audit ngắn
2. mini-plan
3. chờ xác nhận
4. sửa trực tiếp
5. self-review
6. hướng dẫn manual verify nếu cần

### Khi đóng task

1. kiểm tra `result.md`
2. xác định docs impact
3. cập nhật `changelog.md`
4. move task từ `active/` sang `archive/`

---

## 12. Ghi Chú Về Tài Liệu Lịch Sử

- `docs/WORKFLOW-GUIDE.md` là tài liệu lịch sử dài hơn, có giá trị tham khảo
- `workFlow_main.md` là bản tổng hợp thực dụng, Codex-first, dùng để onboard nhanh
- khi có khác biệt, ưu tiên:
  1. `AGENTS.md`
  2. `docs/ai/playbooks/`
  3. task docs hiện hành

---

## 13. Tóm Tắt Ngắn

Workflow hiện tại của project là:

```text
AGENTS.md
  -> task docs nếu có
  -> core docs
  -> product docs
  -> playbooks

Task mới
  -> audit
  -> plan
  -> chờ duyệt
  -> implement
  -> self-review
  -> manual verify
  -> archive
```

Task state được quản lý trong:

```text
docs/ai/tasks/active/
docs/ai/tasks/archive/
docs/ai/history/changelog.md
```

Workflow được thực thi qua:

```text
docs/ai/playbooks/*.md
docs/ai/templates/*.md
```
