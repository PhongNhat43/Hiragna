# Workflow Guide — AI-Assisted Development

> Tài liệu này mô tả toàn bộ workflow và template hệ thống đã được xây dựng và kiểm chứng qua thực tế. Dùng để onboard AI mới, người cộng tác mới, hoặc áp dụng vào project khác.

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Entry Point — CLAUDE.md](#3-entry-point--claudemd)
4. [Hệ thống Rules](#4-hệ-thống-rules)
5. [Hệ thống Skills](#5-hệ-thống-skills)
6. [Hệ thống tài liệu docs/ai/](#6-hệ-thống-tài-liệu-docsai)
7. [Vòng đời một task](#7-vòng-đời-một-task)
8. [Task Sizing — phân loại task](#8-task-sizing--phân-loại-task)
9. [Bug Handling](#9-bug-handling)
10. [Verification-before-completion](#10-verification-before-completion)
11. [Docs Sync](#11-docs-sync)
12. [Memory System](#12-memory-system)
13. [Nguyên tắc cốt lõi](#13-nguyên-tắc-cốt-lõi)
14. [Cách áp dụng vào project mới](#14-cách-áp-dụng-vào-project-mới)

---

## 1. Tổng quan

Đây là một workflow cộng tác giữa người dùng và AI (Claude Code) được thiết kế để:

- **Có kiểm soát:** AI không được tự ý code trước khi có plan được duyệt
- **Có tài liệu:** Mọi thay đổi đều được ghi lại, có thể truy vết
- **Có quy trình:** Diagnosis trước fix, plan trước implement, verify trước archive
- **Tối thiểu hóa rủi ro:** Thay đổi đúng scope, không refactor ngoài yêu cầu
- **Xuyên session:** Task state sống trong repo, không phụ thuộc vào hội thoại

Workflow này được đo ni đóng giày cho single-dev project nhưng dễ mở rộng cho team.

---

## 2. Cấu trúc thư mục

```
project-root/
├── CLAUDE.md                          # Entry point — AI đọc trước tiên
├── .claude/
│   ├── rules/
│   │   ├── global.md                  # Quy tắc giao tiếp và làm việc
│   │   ├── task-sizing.md             # Phân loại task nhỏ/vừa/lớn
│   │   ├── bug-handling.md            # Quy trình xử lý bug
│   │   ├── self-test.md               # Self-review và verification rules
│   │   └── docs-sync.md               # Quy tắc đồng bộ tài liệu
│   └── skills/
│       ├── small-change/SKILL.md      # Task nhỏ
│       ├── big-feature/SKILL.md       # Task vừa/lớn
│       ├── diagnose-bug/SKILL.md      # Chẩn đoán bug
│       ├── fix-bug/SKILL.md           # Thực thi bug fix
│       ├── docs-sync/SKILL.md         # Đồng bộ tài liệu
│       └── archive-task/SKILL.md      # Đóng và archive task
└── docs/ai/
    ├── core/
    │   ├── context.md                 # Bối cảnh và mục tiêu project
    │   ├── architecture.md            # Kiến trúc, layers, state objects
    │   ├── glossary.md                # Thuật ngữ riêng của project
    │   └── risk-zones.md              # Vùng code nguy hiểm cần cẩn thận
    ├── product/
    │   ├── current-features.md        # Tính năng hiện tại (luôn cập nhật)
    │   └── current-flows.md           # Flow màn hình, navigation, state reset
    ├── history/
    │   ├── changelog.md               # Lịch sử các task đã archive
    │   └── decisions.md               # Quyết định thiết kế quan trọng
    ├── tasks/
    │   ├── active/                    # Task đang làm
    │   │   └── HIRA-XXX-ten-task/
    │   │       ├── task.md
    │   │       ├── plan.md
    │   │       └── result.md
    │   └── archive/                   # Task đã hoàn tất
    └── templates/
        ├── task-record-template.md
        ├── plan-record-template.md
        └── result-record-template.md
```

---

## 3. Entry Point — CLAUDE.md

`CLAUDE.md` là file đầu tiên AI đọc mỗi khi bắt đầu session. Nó chứa:

### Tài liệu bắt buộc đọc trước khi làm việc
```
docs/ai/core/context.md       — bối cảnh project
docs/ai/core/architecture.md  — kiến trúc kỹ thuật
.claude/rules/global.md       — quy tắc làm việc
docs/ai/product/current-features.md
docs/ai/product/current-flows.md
```

### Hành vi khi bắt đầu session mới
AI kiểm tra `docs/ai/tasks/active/`:
- **Có task đang mở** → đọc task.md + result.md, surface cho user, hỏi có muốn tiếp tục không
- **Không có task nào** → tiến hành bình thường

### Quy trình làm việc (tóm tắt trong CLAUDE.md)
Phân loại yêu cầu → classify task size → tạo hồ sơ nếu cần → implement → self-review → verify → archive

### Skills reference
```
/small-change, /big-feature, /diagnose-bug, /fix-bug, /docs-sync, /archive-task
```

---

## 4. Hệ thống Rules

Rules là tập hợp các quy tắc cứng, AI phải tuân thủ tuyệt đối. Được tổ chức theo chủ đề.

### `global.md` — Quy tắc gốc

**Ngôn ngữ và giao tiếp:**
- Luôn trả lời tiếng Việt
- Ngắn gọn, thực dụng

**Nguyên tắc làm việc:**
- Hiểu đúng yêu cầu trước khi hành động — nếu mơ hồ, hỏi lại
- Thay đổi tối thiểu, đúng scope
- **Không implement trước khi người dùng xác nhận** — kể cả task nhỏ

**Sau khi implement:**
1. Self-review bắt buộc, mỗi check phải có bằng chứng cụ thể
2. Cập nhật `result.md`
3. Đề xuất user manual verify

**Điều kiện archive (4 điều kiện, đủ hết mới archive):**
1. Code implement xong
2. `result.md` đầy đủ
3. Người dùng đã verify
4. Người dùng xác nhận đóng task

---

### `task-sizing.md` — Phân loại task

| Size | Điều kiện | Xử lý |
|---|---|---|
| **Nhỏ** | 1-2 file, không đổi flow/state, mô tả trong 2-3 câu | Phân tích ngắn → xác nhận → implement |
| **Vừa** | 2-3 file, có đổi flow hoặc state, có rủi ro regression | Task folder + plan.md → duyệt plan → implement |
| **Lớn** | 4+ file, multi-layer, đổi kiến trúc | Task folder đầy đủ, plan có risk analysis |

**Nguyên tắc khi không chắc:** Luôn ưu tiên lên mức cao hơn.

---

### `bug-handling.md` — Quy trình bug

**Tuyệt đối không fix ngay.** Diagnosis và implement là hai bước tách biệt.

```
1. Diagnosis — truy bằng chứng, không đoán sớm
2. Phân loại scope:
   - Còn trong scope: do task hiện tại gây ra VÀ nằm trong file đã duyệt
   - Vượt scope: tồn tại từ trước, ngoài file đã duyệt, fix đòi hỏi thay đổi lớn
3. Đề xuất fix tối thiểu
4. Chờ người dùng xác nhận
5a. Bug trong scope → cập nhật plan.md → implement → cập nhật result.md
5b. Bug vượt scope → ghi vào result.md → tạo task mới
```

**Điều kiện archive khi có bug liên quan:**
- Bug trong scope và đã fix → archive bình thường
- Bug vượt scope, đã ghi nhận, đã tạo task mới → đủ điều kiện archive
- Bug chưa ghi nhận hoặc chưa có task mới → **không được archive**

---

### `self-test.md` — Verification rules

**Nguyên tắc Verification-before-completion:**
> Không được claim "xong", "đã ổn", "đã pass" nếu không có bằng chứng phù hợp.

Bằng chứng yêu cầu:
- Khi runtime verify chưa bật: code trace + logic analysis cụ thể
- Khi runtime verify đã bật: output lệnh thật được đọc và trích dẫn

Không được claim dựa trên cảm giác hay suy đoán.

**Hai loại kiểm tra:**

| Loại | Mô tả | Trạng thái |
|---|---|---|
| **Self-review** | Rà soát tĩnh — đọc code, trace logic, không chạy app | Luôn bắt buộc |
| **Runtime verify** | Chạy app thật, thao tác thật | Tạm vô hiệu hóa |

**Ghi vào result.md:**
```markdown
- [x] Check item — pass: trace quiz.js:517, logic đúng
- [ ] Check item — fail: mô tả cụ thể

Đã verify (self-review): [liệt kê]
Chờ người dùng verify: [liệt kê manual steps]
```

---

### `docs-sync.md` — Quy tắc đồng bộ docs

Docs phản ánh current state — không phải ý định ban đầu. Task hoàn tất mà docs không sync = docs đã lỗi thời.

| Tài liệu | Cập nhật khi |
|---|---|
| `current-features.md` | Thêm/xóa/sửa feature |
| `current-flows.md` | Đổi flow màn hình, state reset |
| `architecture.md` | Thêm config object, đổi state structure, đổi script load |
| `changelog.md` | **Bắt buộc sau mỗi task archive** |
| `decisions.md` | Có quyết định kiến trúc quan trọng |

---

## 5. Hệ thống Skills

Skills là các slash commands có workflow được định nghĩa sẵn. Gọi bằng cách gõ `/skill-name`.

---

### `/small-change`
**Dùng khi:** Task nhỏ, 1-2 file, scope rõ, không đổi flow.

**Workflow:**
1. Phân tích ngắn: file bị ảnh hưởng, rủi ro chính, mini-plan
2. **Chờ xác nhận** rõ ràng từ người dùng
3. Implement theo mini-plan
4. Self-review

---

### `/big-feature`
**Dùng khi:** Task vừa hoặc lớn, nhiều file, đổi flow, có rủi ro.

**Workflow:**
1. Đọc tài liệu bắt buộc (CLAUDE.md, docs/ai/core/, docs/ai/product/)
2. Phân loại task size
3. Tạo task folder `docs/ai/tasks/active/HIRA-XXX-ten-task/`
   - `task.md` — mô tả, scope, files bị ảnh hưởng, overlap
   - `plan.md` — impacted files, risks, design decisions, implementation steps, docs impact
4. **Trình bày tóm tắt plan → Chờ duyệt**
5. Implement theo đúng plan đã duyệt
6. Self-review
7. Cập nhật `result.md`
8. Đề xuất user verify → Chờ xác nhận
9. Sync docs + archive khi user xác nhận đóng task

---

### `/diagnose-bug`
**Dùng khi:** Phát hiện bug, cần tìm root cause. **Không tự sửa.**

**Workflow:**
1. Phân loại scope (trong hay ngoài task hiện tại)
2. Chẩn đoán có bằng chứng — trace code, không đoán sớm
3. Kết luận root cause kèm bằng chứng mạnh nhất
4. Đề xuất fix tối thiểu
5. **Chờ người dùng xác nhận** trước khi implement bất kỳ thứ gì

---

### `/fix-bug`
**Dùng khi:** Đã có root cause rõ và người dùng đã đồng ý hướng sửa. **Không dùng để diagnosis.**

**Workflow:**
1. Kiểm tra điều kiện: root cause rõ? hướng fix đã duyệt? — nếu chưa → yêu cầu quay lại `/diagnose-bug`
2. Đọc context (task folder nếu có)
3. Xác định file bị ảnh hưởng
4. Implement fix tối thiểu — đúng root cause, không mở rộng
5. Self-review
6. Cập nhật `result.md` nếu có task folder
7. Đưa ra manual verify steps

---

### `/docs-sync`
**Dùng khi:** Sau khi implement xong, trước hoặc khi archive. Phân tích tài liệu nào cần sync.

**Workflow:**
1. Đọc context (task folder hoặc $ARGUMENTS)
2. Phân tích impact của từng file docs
3. Trình bày kết quả: cần update / không cần / lý do
4. Cập nhật file đã xác định, tối thiểu và đúng phần liên quan

---

### `/archive-task`
**Dùng khi:** Task đã implement xong, user đã verify, muốn đóng task.

**Workflow (4 bước):**
1. Xác định task (từ argument hoặc liệt kê active/)
2. Kiểm tra 4 điều kiện archive — **dừng nếu bất kỳ điều kiện nào chưa đạt**
3. Kiểm tra docs impact, sync các file cần update (bao gồm MEMORY.md nếu có feedback mới)
4. Tóm tắt → chờ xác nhận lần cuối → move folder active/ → archive/

**4 điều kiện archive:**
1. Implement xong
2. `result.md` đầy đủ
3. Không còn open issues
4. User đã verify và xác nhận đóng task

---

## 6. Hệ thống tài liệu docs/ai/

### `core/` — Tài liệu nền tảng (ít thay đổi)

| File | Nội dung | Cập nhật khi |
|---|---|---|
| `context.md` | Mục tiêu project, target users, tech constraints | Project đổi mục tiêu hoặc platform |
| `architecture.md` | Layer structure, config objects, state objects | Thêm layer, đổi state, đổi script load |
| `glossary.md` | Thuật ngữ riêng của codebase | Thêm term mới |
| `risk-zones.md` | Vùng code nguy hiểm, dễ gây regression | Phát hiện risk zone mới |

---

### `product/` — Tài liệu current state (thường xuyên cập nhật)

| File | Nội dung | Cập nhật khi |
|---|---|---|
| `current-features.md` | Danh sách tất cả tính năng đang hoạt động | Sau mỗi task thêm/sửa/xóa feature |
| `current-flows.md` | Flow màn hình, navigation graph, state reset | Sau mỗi task đổi navigation hoặc flow |

> **Quan trọng:** Đây là "single source of truth" về product hiện tại. AI đọc file này để biết tính năng nào đang có, tránh regression.

---

### `history/` — Lịch sử (append-only)

| File | Nội dung |
|---|---|
| `changelog.md` | Một entry per task: ID, ngày, tóm tắt, files thay đổi |
| `decisions.md` | Quyết định kiến trúc quan trọng kèm lý do — không xóa |

---

### `tasks/` — Task management

**Active tasks** (`tasks/active/HIRA-XXX-ten-task/`):
```
task.md    — Mô tả, scope, files bị ảnh hưởng, overlap với features hiện có
plan.md    — Impacted files, risks, design decisions, implementation steps
result.md  — Kết quả thực tế, self-review, manual verify steps, open issues
```

**Archive** (`tasks/archive/`): Task đã hoàn tất, không chỉnh sửa.

**Templates** (`tasks/templates/`): Blank templates để điền khi tạo task mới.

---

### Task ID convention

Format: `HIRA-XXX` (prefix theo project name). Tăng dần. Ví dụ:
- `HIRA-000` — workflow bootstrap
- `HIRA-001` — first feature
- `HIRA-010` — task thứ 10

---

## 7. Vòng đời một task

### Task nhỏ
```
Yêu cầu
  ↓
Phân tích ngắn (file, rủi ro, mini-plan)
  ↓
Chờ xác nhận ← GATE
  ↓
Implement
  ↓
Self-review (có bằng chứng)
  ↓
Đề xuất user verify
```

### Task vừa/lớn
```
Yêu cầu
  ↓
Đọc tài liệu bắt buộc
  ↓
Phân loại task size
  ↓
Tạo task folder + task.md + plan.md
  ↓
Trình bày plan → Chờ duyệt ← GATE
  ↓
Implement theo plan
  ↓
Self-review (mỗi check có bằng chứng)
  ↓
Cập nhật result.md
  ↓
Đề xuất manual verify → Chờ xác nhận ← GATE
  ↓
/docs-sync → sync docs cần thiết
  ↓
/archive-task → kiểm tra 4 điều kiện → move to archive
```

---

## 8. Task Sizing — phân loại task

### Task nhỏ — đủ TẤT CẢ điều kiện sau:
- Thay đổi 1 file, hoặc 2 file rất cục bộ
- Không đổi flow màn hình, không đổi state structure
- Scope rõ ràng, rủi ro regression thấp
- Mô tả được trong 2-3 câu

### Task vừa — ÍT NHẤT MỘT trong các điều kiện:
- Thay đổi 2-3 file
- Có đổi flow hoặc thêm state mới
- Rủi ro regression ở tính năng liên quan
- Cần thiết kế trước

### Task lớn — ÍT NHẤT MỘT trong các điều kiện:
- Thay đổi 4+ file hoặc multi-layer
- Đổi kiến trúc, thêm config object mới
- Ảnh hưởng toàn bộ flow chính
- Có design decision cần ghi vào decisions.md

**Khi không chắc → ưu tiên lên mức cao hơn.**

---

## 9. Bug Handling

### Nguyên tắc bất biến
Không fix ngay. **Diagnosis và implement là hai bước tách biệt.**

### Phân loại scope
| Loại | Dấu hiệu |
|---|---|
| **Trong scope** | Do task hiện tại gây ra VÀ nằm trong file đã duyệt trong plan.md |
| **Vượt scope** | Tồn tại từ trước task, nằm ngoài file plan.md, hoặc fix đòi thay đổi lớn |

### Quy trình
1. **Dùng `/diagnose-bug`** — trace evidence, kết luận root cause
2. Phân loại scope
3. Đề xuất fix tối thiểu + chờ xác nhận
4. **Dùng `/fix-bug`** — implement sau khi có xác nhận
5. Ghi nhận vào result.md

---

## 10. Verification-before-completion

Inspired by Superpowers "evidence before claims".

### Quy tắc
> Không được claim "xong", "đã ổn", "đã pass" chỉ bằng suy đoán.

### Bằng chứng chấp nhận được
- **Self-review (runtime verify chưa bật):** Phải trace cụ thể — file nào, dòng nào, logic nào. Không được chỉ đánh checkmark.
- **Runtime verify (khi được bật):** Output lệnh thật, đọc và trích dẫn kết quả.

### Ranh giới bắt buộc ghi rõ
```
Đã verify (self-review): [những gì đã trace được]
Chờ người dùng verify: [những gì cần test thực tế]
```

---

## 11. Docs Sync

### Nguyên tắc
Docs không phải ý định — docs là current state. Một task hoàn tất mà không sync docs = docs đã sai.

### Không được archive nếu docs cần sync mà chưa sync.

### Checklist sync khi archive

| File | Cần update khi |
|---|---|
| `current-features.md` | Thêm/xóa/sửa feature behavior |
| `current-flows.md` | Đổi flow, navigation, state reset |
| `architecture.md` | Thêm layer, đổi state, đổi config |
| `changelog.md` | **Luôn luôn** |
| `decisions.md` | Có design decision quan trọng |
| `CLAUDE.md` | Đổi workflow cốt lõi, thêm skill, đổi rules |
| `MEMORY.md` | Có feedback/preference mới từ người dùng |

---

## 12. Memory System

### Auto-memory (`~/.claude/projects/.../memory/`)
Claude Code tự động load `MEMORY.md` mỗi session. Lưu:
- **user**: vai trò, preferences, kiến thức của người dùng
- **feedback**: hướng dẫn về cách làm việc (cả correction lẫn confirmation)
- **project**: thông tin về ongoing work, deadlines, decisions
- **reference**: pointer đến external resources

### Cập nhật khi archive
Skill `/archive-task` có checklist kiểm tra MEMORY.md — cập nhật nếu task có feedback hoặc preference mới đáng nhớ xuyên session.

### Thứ tự ưu tiên để AI "nhớ" tốt
```
1. CLAUDE.md           — luôn loaded, workflow rules
2. MEMORY.md           — luôn loaded, facts về người dùng
3. architecture.md     — đọc đầu session, kiến trúc
4. current-features.md — đọc đầu session, tránh regression
5. current-flows.md    — đọc đầu session, navigation
6. decisions.md        — đọc khi cần, tránh re-debate
7. tasks/archive/      — đọc khi cần tra cứu lịch sử cụ thể
```

---

## 13. Nguyên tắc cốt lõi

### Thay đổi tối thiểu
- Chỉ sửa file trực tiếp liên quan đến task
- Không refactor code xung quanh
- Không thêm tính năng ngoài yêu cầu
- Không tạo file mới nếu không cần thiết

### Plan trước code
- Không implement trước khi có plan được duyệt
- Task vừa/lớn bắt buộc có task.md và plan.md
- Plan phải có risk analysis

### Diagnosis trước fix
- Không fix bug trước khi có root cause rõ
- Không vừa debug vừa tự sửa
- Diagnosis và implement là hai bước tách biệt

### Evidence trước claim
- Không nói "xong" mà không có trace cụ thể
- Phân biệt rõ: đã verify bằng self-review vs. chờ user manual verify

### Task state trong repo, không trong hội thoại
- Hội thoại bị giới hạn context window, bị mất khi session hết
- Task state (task.md, plan.md, result.md) phải sống trong repo

---

## 14. Cách áp dụng vào project mới

### Bước 1 — Copy phần generic (không cần sửa)
```bash
.claude/rules/          # copy toàn bộ
.claude/skills/         # copy toàn bộ
docs/ai/tasks/          # copy structure, xóa nội dung tasks cụ thể
docs/ai/history/changelog.md  # giữ format, xóa entries
docs/ai/history/decisions.md  # giữ format, xóa entries
docs/ai/templates/      # copy toàn bộ
```

### Bước 2 — Viết lại phần project-specific
```
docs/ai/core/context.md      ← mục tiêu, tech stack, constraints của project mới
docs/ai/core/architecture.md ← layer structure, state objects, key files
docs/ai/core/glossary.md     ← terms riêng
docs/ai/core/risk-zones.md   ← vùng code nguy hiểm
docs/ai/product/current-features.md  ← tính năng hiện tại
docs/ai/product/current-flows.md     ← flow và navigation
```

### Bước 3 — Cập nhật CLAUDE.md
Giữ nguyên structure, rewrite:
- Danh sách tài liệu bắt buộc đọc
- Architecture summary table (layer → file → constraints)
- Self-check list phù hợp với project mới

### Bước 4 — Thêm rules project-specific nếu cần
Ví dụ cho banking Swift app:
```
.claude/rules/swift-constraints.md
  - No hardcoded credentials
  - Keychain for sensitive data
  - MainActor cho UI updates
  - No force unwrap trong production code
```

### Bước 5 — Đặt task ID prefix
Chọn prefix phù hợp với project (ví dụ: `BANK-XXX`, `APP-XXX`) và ghi vào CLAUDE.md.

### Bước 6 — Khởi động bằng "workflow bootstrap task"
Tạo `XXX-000-workflow-bootstrap` để document việc setup workflow — thói quen tốt, tạo entry đầu tiên trong changelog.

---

## Quick Reference

### Khi nào dùng skill nào?

| Tình huống | Skill |
|---|---|
| Sửa nhỏ, 1-2 file | `/small-change` |
| Feature mới hoặc thay đổi lớn | `/big-feature` |
| Phát hiện bug, chưa biết nguyên nhân | `/diagnose-bug` |
| Biết root cause, muốn fix | `/fix-bug` |
| Cần sync tài liệu sau implement | `/docs-sync` |
| Muốn đóng task đã verify | `/archive-task` |

### Các gates không được bỏ qua

```
Task nhỏ:   [Phân tích] → GATE: xác nhận → [Implement]
Task vừa/lớn: [Plan] → GATE: duyệt plan → [Implement] → GATE: user verify → [Archive]
Bug:         [Diagnosis] → GATE: xác nhận fix → [Implement]
Archive:     GATE: 4 điều kiện + docs sync
```

### Những thứ AI không được tự làm
- Implement trước khi có xác nhận
- Fix bug trước khi có root cause
- Archive trước khi user verify
- Claim "xong" mà không có trace bằng chứng
- Sửa ngoài scope đã duyệt
- Refactor code không liên quan đến task
