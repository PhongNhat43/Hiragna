# AGENTS.md

`AGENTS.md` là entrypoint instruction chính của repo này cho Codex-style workflow.
Workflow chi tiết và playbooks sống trong `docs/ai/`. `CLAUDE.md` được giữ lại như compatibility shim.

## Project Summary

- Repo: **Hiragna** — web app học tiếng Nhật bằng pure HTML/CSS/JS
- Mục tiêu: thay đổi tối thiểu, đúng scope, dễ review
- Ngôn ngữ mặc định khi trao đổi trong repo này: **tiếng Việt**

## Risk Zones

- `src/quiz.js`: logic/state chính, dễ regression nếu sửa lan
- `src/hiraganaData.js`: config/data phụ thuộc load order
- `src/index.html`: script load order là contract
- `src/progress.js`: session/local persistence

Chi tiết: `docs/ai/core/architecture.md`, `docs/ai/core/risk-zones.md`

## Default Workflow

Với feature, bug fix, refactor, flow change:

1. Audit context và impacted files trước
2. Lên plan trước khi code
3. Chờ người dùng duyệt
4. Implement đúng plan đã duyệt

Task nhỏ có thể chỉ cần mini-plan. Task vừa/lớn phải dùng task folder trong `docs/ai/tasks/active/`.

## Task System

- Task active: `docs/ai/tasks/active/HIRA-XXX-slug/`
- Task archive: `docs/ai/tasks/archive/HIRA-XXX-slug/`
- Files chuẩn theo task:
  - `task.md`
  - `plan.md`
  - `result.md` khi đã implement hoặc cần ghi nhận kết quả

## Reporting And Self-Review

- Không claim "xong" nếu chưa có bằng chứng
- Sau khi implement:
  - self-review diff và logic đã sửa
  - ghi rõ đã verify bằng cách nào
  - ghi rõ phần nào còn chờ người dùng manual verify
- Với workflow/docs task: chạy `bash scripts/verify.sh`

## Thread / Worktree Policy

- Một thread nên gắn với một task chính
- Dùng worktree riêng khi task kéo dài, nhiều file, hoặc repo có task active song song
- Task docs trong `docs/ai/tasks/...` vẫn là source of truth dù dùng worktree riêng

## Discovery Order

1. `AGENTS.md`
2. Task folder liên quan trong `docs/ai/tasks/active/`
3. `docs/ai/core/`
4. `docs/ai/product/`
5. `docs/ai/playbooks/`

## Playbooks

- `docs/ai/playbooks/project-audit.md`
- `docs/ai/playbooks/small-change.md`
- `docs/ai/playbooks/big-feature.md`
- `docs/ai/playbooks/diagnose-bug.md`
- `docs/ai/playbooks/fix-bug.md`
- `docs/ai/playbooks/verification.md`
- `docs/ai/playbooks/docs-sync.md`
- `docs/ai/playbooks/archive-task.md`
