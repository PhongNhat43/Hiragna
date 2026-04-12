# Claude Compatibility Shim

File này được giữ lại để tương thích với workflow cũ.

## Source Of Truth Mới

- Root instructions: `AGENTS.md`
- Procedural workflows: `docs/ai/playbooks/`
- Task state: `docs/ai/tasks/`
- Core/product context: `docs/ai/core/`, `docs/ai/product/`

## Kỳ vọng khi đọc file này

- Không coi `CLAUDE.md` là entrypoint chính nữa
- Ưu tiên đọc `AGENTS.md` trước
- Nếu cần workflow cụ thể:
  - audit → `docs/ai/playbooks/project-audit.md`
  - task nhỏ → `docs/ai/playbooks/small-change.md`
  - task vừa/lớn → `docs/ai/playbooks/big-feature.md`
  - chẩn đoán bug → `docs/ai/playbooks/diagnose-bug.md`
  - fix bug → `docs/ai/playbooks/fix-bug.md`
  - self-review → `docs/ai/playbooks/verification.md`
  - sync docs → `docs/ai/playbooks/docs-sync.md`
  - archive task → `docs/ai/playbooks/archive-task.md`

## Transitional Note

- `.claude/rules/*` và `.claude/skills/*` vẫn được giữ lại để compatibility và đối chiếu migration
- Không xóa các file legacy này cho đến khi repo review xong mapping mới
