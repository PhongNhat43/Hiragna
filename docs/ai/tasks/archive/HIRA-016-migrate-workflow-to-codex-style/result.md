# Result: [HIRA-016] Migrate Repo Workflow from Claude Style to Codex Style

## Trạng thái

Done

---

## Files changed

| File | Thay đổi |
|---|---|
| `AGENTS.md` | Tạo mới Codex-first entrypoint |
| `.codex/config.toml` | Tạo mới project-scoped Codex config |
| `docs/ai/playbooks/*.md` | Tạo playbooks map từ `.claude/skills/*` và procedural rules |
| `CLAUDE.md` | Rút gọn thành compatibility shim |
| `.claude/rules/*.md` | Thêm transitional notes |
| `.claude/skills/*/SKILL.md` | Thêm transitional notes |
| `scripts/verify.sh` | Đổi wording và checks sang AI-workflow-neutral / Codex-compatible |
| `docs/ai/history/changelog.md` | Thêm entry archive cho HIRA-016 |

---

## Thay đổi chính

Thiết lập `AGENTS.md` làm source of truth mới ở root, tạo `docs/ai/playbooks/` làm nơi chứa workflow procedural đã map từ `.claude/skills/*` và các rules dài, giữ `CLAUDE.md` cùng `.claude/` như lớp compatibility tạm thời để không mất tri thức cũ trong lúc migration.

---

## Self-review

- [x] Mapping có đích Codex-first rõ ràng — pass: `AGENTS.md` trỏ discovery order sang `docs/ai/playbooks/`, `CLAUDE.md` đổi thành shim
- [x] Không xóa mù legacy data — pass: giữ `.claude/rules/*`, `.claude/skills/*`, chỉ thêm transitional notes
- [x] Procedural logic đã được map sang repo docs mới — pass: tạo `project-audit.md`, `small-change.md`, `big-feature.md`, `diagnose-bug.md`, `fix-bug.md`, `verification.md`, `docs-sync.md`, `archive-task.md`
- [x] Verify script đã đổi wording trung tính / Codex-compatible — pass: `scripts/verify.sh` không còn section “Claude Code config”
- [x] Scaffold mới đọc được đầy đủ — pass: chạy `bash scripts/verify.sh` cho kết quả `36 OK / 0 MISSING`

**Đã verify (self-review):** cấu trúc file mới, source-of-truth routing, legacy compatibility strategy, verify script wording, scaffold check pass.

**Chờ người dùng verify:** không còn mục blocking. Người dùng đã chọn archive `HIRA-016` mà không chờ pilot task.

---

## Manual verify steps

1. Mở `AGENTS.md` và xác nhận nội dung đủ ngắn, đúng vai trò router.
2. Mở `docs/ai/playbooks/` và xác nhận mapping từ `.claude/skills/*` sang playbooks là hợp lý.
3. Chạy `bash scripts/verify.sh` và kiểm tra scaffold mới phản ánh Codex-first workflow.
4. Mở `CLAUDE.md` để xác nhận nó đã là compatibility shim, không còn là source of truth chính.

---

## Docs updated

- [x] `AGENTS.md`
- [ ] `docs/ai/product/current-features.md`
- [ ] `docs/ai/product/current-flows.md`
- [ ] `docs/ai/core/architecture.md`
- [x] `docs/ai/history/changelog.md`
- [ ] `docs/ai/history/decisions.md`

---

## Vấn đề còn mở

- Không có blocking issue cho việc archive.
- Transitional follow-up đã được chấp nhận để xử lý ở task riêng nếu cần: `.claude/settings*.json` vẫn là legacy config; `docs/WORKFLOW-GUIDE.md` vẫn còn Claude-first wording.
