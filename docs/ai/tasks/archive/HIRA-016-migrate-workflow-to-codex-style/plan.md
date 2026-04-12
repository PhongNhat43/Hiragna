# Plan: [HIRA-016] Migrate Repo Workflow from Claude Style to Codex Style

## Thông tin

- **Task size:** lớn
- **Docs impact:** có — dự kiến ảnh hưởng `AGENTS.md`, `CLAUDE.md`, `.claude/`, `docs/WORKFLOW-GUIDE.md`, `docs/ai/templates/`, `scripts/verify.sh`

---

## Assumptions

- Mục tiêu là **bổ sung Codex-first workflow**, không xóa sạch hệ hiện có ngay từ phase đầu.
- Repo sẽ tiếp tục dùng `docs/ai/tasks/...` làm task state on-repo vì phần này vẫn hữu ích cho cross-session continuity.
- Codex desktop app là tác nhân chính về sau; Claude compatibility nếu giữ lại sẽ ở mức transitional, không phải source of truth dài hạn.
- Chưa cần tối ưu cho multi-agent automation trong phase đầu; ưu tiên instruction discovery, task workflow, thread/worktree hygiene.

---

## Current Workflow Inventory

### 1. Entry points và instruction sources hiện có

| File / vùng | Vai trò hiện tại | Nhận xét |
|---|---|---|
| `CLAUDE.md` | Entry point chính cho AI | Phục vụ Claude-first, nhưng phần lớn workflow logic vẫn reusable |
| `.claude/rules/global.md` | Rule nền | Có nhiều rule tốt, nhưng naming và discovery đang Claude-specific |
| `.claude/rules/task-sizing.md` | Phân loại task | Reusable gần như nguyên xi |
| `.claude/rules/bug-handling.md` | Diagnosis-first bug workflow | Reusable |
| `.claude/rules/self-test.md` | Verification discipline | Reusable sau khi rút gọn recipes |
| `.claude/rules/docs-sync.md` | Quy tắc sync docs | Reusable |
| `.claude/skills/*` | Workflow theo loại task | Có thể tái dùng nội dung, nhưng Codex không discover theo slash-skill kiểu Claude |
| `docs/WORKFLOW-GUIDE.md` | Tài liệu workflow đầy đủ | Có giá trị làm canonical deep doc, nhưng đang kể lại thế giới theo Claude terminology |

### 2. Task system hiện có

| Path | Vai trò hiện tại | Đánh giá tái sử dụng |
|---|---|---|
| `docs/ai/tasks/active/...` | Task đang mở | Reusable mạnh |
| `docs/ai/tasks/archive/...` | Task đã đóng | Reusable mạnh |
| `docs/ai/templates/task-record-template.md` | Task template | Reusable nhưng nên normalize cho Codex đọc nhanh hơn |
| `docs/ai/templates/plan-record-template.md` | Plan template | Reusable, cần mở rộng rõ worktree/thread/pilot/risk sections |
| `docs/ai/templates/result-record-template.md` | Result template | Reusable |
| `docs/ai/templates/verification-checklist.md` | Manual verification checklist | Reusable nếu giữ ngắn hơn và chia recipe theo task type |
| `docs/ai/templates/review-checklist.md` | Static review checklist | Reusable |

### 3. Repo/tooling markers đang mang màu Claude style

| File | Dấu hiệu Claude style |
|---|---|
| `CLAUDE.md` | Tên file và wording đều assume Claude là entrypoint |
| `.claude/settings.json` / `.claude/settings.local.json` | Tool permissions và local config theo Claude |
| `.claude/rules/*` | Rule namespace khóa vào Claude |
| `.claude/skills/*` | Cơ chế slash-skill Claude |
| `scripts/verify.sh` | Check mục `=== Claude Code config ===` và verify scaffold Claude-specific |
| `docs/WORKFLOW-GUIDE.md` | Mô tả workflow như một hệ Claude Code hoàn chỉnh |

---

## Key Audit Findings

1. Workflow cốt lõi tốt hơn naming. Phần có giá trị nhất là task discipline, diagnosis-first, docs-sync, và on-repo task memory; không nên bỏ.
2. Repo đang có **instruction sprawl**: `CLAUDE.md`, `.claude/rules/*`, `.claude/skills/*`, `docs/WORKFLOW-GUIDE.md`, templates. Với Codex, cần một entrypoint ngắn, rõ, ưu tiên discovery theo tuyến chính.
3. Task system `docs/ai/tasks/...` đủ trưởng thành để giữ lại làm state backbone. Vấn đề không nằm ở task system mà ở entrypoint và cách hướng agent tìm đúng file.
4. Repo hiện có **nhiều active tasks song song** (`HIRA-009`, `012`, `014`, `015`). Điều này xung đột với startup behavior kiểu “có task active thì hỏi tiếp tục task nào” nếu chỉ có một thread/session. Codex cần policy rõ hơn cho thread/worktree ownership.
5. Docs workflow đang mô tả một số năng lực đã triển khai nhưng khó discover đúng nếu agent không đọc đúng thứ tự. Đây là lý do cần `AGENTS.md` làm routing layer.
6. `.claude/skills/*` vẫn tồn tại và có nội dung hữu ích, nhưng cơ chế của chúng không phải native contract của Codex desktop app. Nên xem đây là source material để hợp nhất, không nên giữ là primary UX.
7. `scripts/verify.sh` đang kiểm tra scaffold Claude-style, nên nếu migrate mà không cập nhật verify recipe thì repo sẽ tiếp tục “dạy” agent theo worldview cũ.

---

## Migration Goals

1. Thiết lập `AGENTS.md` ở root làm entrypoint instruction ngắn, ưu tiên Codex.
2. Giảm số bước discovery để một agent mới có thể vào đúng task trong ít hop nhất.
3. Giữ `docs/ai/tasks/...` làm task memory system, nhưng chuẩn hóa format để machine-readable hơn.
4. Biến workflow mặc định thành:
   `audit -> plan -> wait for approval -> implement -> self-review -> user verify -> archive`
5. Định nghĩa rõ thread/worktree policy để nhiều task active không gây lẫn trạng thái.
6. Rút gọn verification/setup recipes thành vài recipe ngắn, dễ copy và dễ áp dụng.
7. Cho phép coexistence một thời gian với Claude artifacts, nhưng xác định rõ cái nào là transitional.

---

## Proposed `AGENTS.md` Structure

### Mục tiêu cấu trúc

`AGENTS.md` nên là file ngắn, định tuyến tốt, không lặp lại toàn bộ `docs/WORKFLOW-GUIDE.md`.

### Cấu trúc đề xuất

1. **Project snapshot**
   - app type, stack, cách chạy
   - nguyên tắc “minimal changes, no surprise refactor”

2. **Default operating workflow**
   - audit trước
   - task sizing
   - task vừa/lớn: tạo folder + `task.md` + `plan.md` + chờ duyệt
   - implement chỉ sau khi được duyệt

3. **Instruction discovery order**
   - `AGENTS.md`
   - relevant task folder trong `docs/ai/tasks/active/`
   - `docs/ai/core/*`
   - `docs/ai/product/*`
   - workflow deep docs khi cần

4. **Task system contract**
   - naming format
   - required files theo phase
   - active vs archive

5. **Thread/worktree policy**
   - một thread chính cho một task
   - khi task đủ lớn hoặc song song mới tách worktree/thread
   - active task phải ghi owner thread/worktree trong plan khi cần

6. **Verification recipes**
   - docs workflow
   - pure JS/UI changes
   - task-only/docs-only changes

7. **Reference map**
   - link tới `docs/WORKFLOW-GUIDE.md`
   - link tới templates
   - link tới risk/architecture docs

---

## Task/Template Normalization

### Giữ lại

- `task.md`, `plan.md`, `result.md`
- `active/` và `archive/`
- task ID pattern `HIRA-XXX-slug`

### Nên chuẩn hóa

1. `task.md`
   - thêm mục `Context / Why now`
   - thêm `Dependencies / overlaps`
   - giữ acceptance criteria ngắn, checklist-friendly

2. `plan.md`
   - thêm `Assumptions`
   - thêm `Current workflow inventory` cho workflow/docs tasks
   - thêm `Thread/worktree policy`
   - thêm `Verification recipes`
   - thêm `Migration phases`
   - thêm `Pilot strategy`

3. `result.md`
   - giữ nguyên tinh thần hiện tại
   - thêm mục `Docs migrated / deprecated` khi task là workflow migration

4. templates
   - wording trung tính hơn: bỏ phụ thuộc vào Claude terminology
   - ưu tiên headings rõ, ít prose, dễ scan bởi agent

### Đề xuất không đổi trong phase đầu

- Không đổi path `docs/ai/tasks/...`
- Không đổi archive semantics
- Không đổi lịch sử task cũ

---

## Thread/Worktree Policy

### Nguyên tắc đề xuất cho Codex desktop app

1. **Một thread = một task mục tiêu chính**
   - Thread chỉ nên gắn với một task active chính tại một thời điểm.

2. **Một worktree riêng cho task khi có một trong các điều kiện sau**
   - task kéo dài nhiều phiên
   - task chạm nhiều file/rủi ro cao
   - repo đang có task khác active song song
   - cần giữ diff sạch để review

3. **Task docs vẫn sống ở repo chính**
   - Dù dùng worktree riêng, task folder vẫn là source of truth.

4. **Khi mở task mới**
   - kiểm tra `docs/ai/tasks/active/`
   - nếu task khác đang active nhưng không cùng scope, không ép “resume”; thay vào đó xác định task hiện tại sẽ dùng thread/worktree riêng hay không

5. **Plan nên ghi ownership khi task lớn**
   - branch/worktree path dự kiến
   - task nào đang overlap nếu có

### Ý nghĩa với repo hiện tại

Policy này giải quyết mismatch giữa:
- repo cho phép nhiều task active song song
- nhưng `CLAUDE.md` hiện mô tả startup flow gần như single-threaded

---

## Verification/Setup Recipes

### Recipe 1 — Docs/workflow-only

- đọc diff docs
- chạy `bash scripts/verify.sh`
- kiểm tra stale references: `CLAUDE.md`, `AGENTS.md`, `.claude/`, templates, workflow guide

### Recipe 2 — Source/UI change

- đọc impacted files
- trace affected flow trong `src/`
- chạy `bash scripts/verify.sh`
- ghi rõ phần nào chỉ self-review, phần nào cần người dùng manual verify

### Recipe 3 — Task-doc-only

- kiểm tra folder naming
- kiểm tra `task.md` và `plan.md` có đủ section required
- không cần claim runtime verification

### Setup gaps hiện tại cần giải quyết ở phase sau

- `scripts/verify.sh` chưa biết `AGENTS.md`
- verify script vẫn xem Claude config là canonical scaffold
- chưa có quick-start ngắn cho Codex ở root ngoài `CLAUDE.md`

---

## Migration Phases

### Phase 0 — Audit and planning

- audit workflow hiện tại
- tạo task docs và migration plan
- chưa sửa repo production

### Phase 1 — Add Codex entrypoint

- thêm `AGENTS.md`
- giữ `CLAUDE.md` trong trạng thái transitional
- định nghĩa discovery order và workflow mặc định

### Phase 2 — Normalize task/docs templates

- cập nhật template wording
- thêm section phục vụ Codex style
- giữ tương thích với task cũ

### Phase 3 — Align tooling and verification

- cập nhật `scripts/verify.sh`
- thêm checks cho `AGENTS.md`
- reframe từ “Claude Code config” sang “AI workflow config”

### Phase 4 — Deprecation cleanup

- quyết định fate của `.claude/skills/*`
- quyết định giữ hay rút gọn `CLAUDE.md`
- cập nhật `docs/WORKFLOW-GUIDE.md` thành workflow-neutral hoặc Codex-first

### Phase 5 — Pilot and refine

- chạy pilot trên 1-2 task mới
- xem Codex có discover đúng file, giữ scope đúng, và không nhầm active task hay không

---

## Impacted Files

### Giữ nguyên trong phase hiện tại

- `CLAUDE.md`
- `.claude/rules/*`
- `.claude/skills/*`
- `docs/WORKFLOW-GUIDE.md`
- `docs/ai/templates/*`
- `scripts/verify.sh`

### Dự kiến bị ảnh hưởng ở phase implement

| File / path | Dự kiến thay đổi |
|---|---|
| `AGENTS.md` | Tạo mới, làm root entrypoint |
| `CLAUDE.md` | Rút gọn hoặc chuyển thành compatibility shim / legacy reference |
| `docs/WORKFLOW-GUIDE.md` | Cập nhật từ Claude-first sang workflow-neutral hoặc Codex-first |
| `docs/ai/templates/task-record-template.md` | Normalize wording/sections |
| `docs/ai/templates/plan-record-template.md` | Thêm sections mới |
| `docs/ai/templates/result-record-template.md` | Có thể bổ sung section migration/deprecation |
| `scripts/verify.sh` | Đổi scaffold checks sang AI-workflow-neutral |
| `.claude/rules/*` | Có thể giữ, rút gọn, hoặc reference từ `AGENTS.md` |
| `.claude/skills/*` | Đánh dấu transitional hoặc hợp nhất nội dung |

---

## Keep / Merge / Deprecate Proposal

### Nên giữ

- `docs/ai/tasks/active/` và `archive/`
- `docs/ai/core/*`
- `docs/ai/product/*`
- phần lớn nội dung rules: task sizing, bug handling, self-test, docs-sync

### Nên hợp nhất

- logic điều hướng ở `CLAUDE.md` + phần workflow summary trong `docs/WORKFLOW-GUIDE.md`
- nội dung hữu ích từ `.claude/skills/*` vào `AGENTS.md` và templates
- verification guidance rải rác vào bộ recipe ngắn hơn

### Nên deprecated dần

- `CLAUDE.md` như entrypoint primary
- wording “Claude Code config” trong `scripts/verify.sh`
- `.claude/skills/*` như UX chính cho workflow execution

### Chưa nên deprecated ngay

- `.claude/rules/*` nếu chúng vẫn là nơi chứa policy chi tiết
- `.claude/settings*.json` nếu còn cần cho người dùng Claude song song

---

## Risks

| Rủi ro | Mức độ | Ghi chú |
|---|---|---|
| Tạo thêm một layer docs nhưng không giảm confusion | Cao | `AGENTS.md` phải ngắn và làm đúng vai trò router, không copy nguyên workflow guide |
| Deprecate quá sớm làm gãy compatibility với quy trình cũ | Trung bình | Cần transitional phase rõ |
| Codex thread/worktree policy quá nặng so với repo nhỏ | Trung bình | Policy nên opt-in theo task size, không bắt buộc cho mọi task |
| Template normalization làm task cũ khó đọc hoặc lệch format | Thấp | Chỉ áp dụng cho task mới |
| Verify script không cập nhật đồng bộ | Cao | Nếu bỏ sót, repo sẽ tiếp tục tự-check theo worldview cũ |
| Mismatch giữa docs và thực tế file tree | Trung bình | Đã thấy dấu hiệu này trong lịch sử skills/workflow; phase pilot cần rà lại |

---

## Acceptance Criteria

- Có một entrypoint mới ở root dành cho Codex (`AGENTS.md`) trong phase implement
- Agent mới có thể hiểu thứ tự đọc tài liệu mà không cần suy đoán
- Task vừa/lớn vẫn đi theo `task.md` + `plan.md` + chờ duyệt trước khi code
- `docs/ai/tasks/...` tiếp tục dùng được làm task memory system
- Repo có policy đủ rõ để nhiều active tasks không làm lẫn thread/worktree
- Verification recipe đủ ngắn để dùng thường xuyên
- `scripts/verify.sh` không còn hardcode worldview Claude-first
- Claude-specific artifacts nếu còn giữ phải được ghi rõ là transitional hoặc compatibility-only

---

## Pilot Migration Strategy

1. **Pilot 1: workflow-doc-only**
   - tạo `AGENTS.md`
   - cập nhật verify script
   - normalize templates nhẹ
   - chưa đụng source app

2. **Pilot 2: apply trên một task mới nhỏ/vừa**
   - dùng Codex-style entrypoint + task template mới
   - quan sát agent có đi đúng `audit -> plan -> wait -> implement` không

3. **Pilot 3: parallel task sanity check**
   - giữ nhiều task active
   - xác nhận policy thread/worktree giúp tránh resume nhầm task

4. **Review sau pilot**
   - nếu Codex discovery ổn, mới quyết định mức độ rút gọn `CLAUDE.md` và `.claude/skills/*`

---

## Đề xuất triển khai sau khi duyệt

1. Tạo `AGENTS.md` bản đầu tiên, ngắn và làm router
2. Update template `plan.md` và `task.md` theo cấu trúc mới
3. Update `scripts/verify.sh`
4. Reframe `docs/WORKFLOW-GUIDE.md`
5. Chốt strategy cho `CLAUDE.md` và `.claude/skills/*`
