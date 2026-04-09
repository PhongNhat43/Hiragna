# Changelog

Mỗi entry tương ứng một task đã archive. Cập nhật bắt buộc trước khi archive task.

---

## [HIRA-013] Kana Coverage & Adaptive Quiz — 2026-04-07

**Phase 1:** Hoàn thiện dataset hiragana và katakana từ 20 lên 98 ký tự (46 basic + 25 dakuten/handakuten + 27 yoon). Thêm 16 GROUP_CONFIG groups per type (từ 4 lên 16). Romanization theo Hepburn chuẩn (ぢ=di, づ=du để tránh conflict).

**Phase 2:** Adaptive Quiz V1. Thay sequential pick bằng `pickWeighted()` — weighted random selection theo accuracy × recency × absence. Thêm `hiragna_item_stats` storage (per-item `{correct, wrong, lastSeenTs, streak}`). Thêm `recentItems[]` vào quizState. Mixed mode không track item stats (V1). Reset Progress xóa cả item stats.

**Phase 3:** Dakuten (が/ざ/だ/ば行) + Handakuten (ぱ行) — 25 items/type, 5 groups mới.

**Phase 4:** Yoon — 27 items/type (21 basic + 6 dakuten voiced), 2 groups mới (`yoon_basic`, `yoon_dakuten`).

Files: `src/hiraganaData.js`, `src/progress.js`, `src/quiz.js`

---

## [HIRA-011] Grapuco Workflow Integration — 2026-04-05

Thêm rule dùng Grapuco vào workflow hiện tại như công cụ hỗ trợ tùy chọn. Rule chính ở `global.md` (nguyên tắc, phân loại khi nào dùng, checklist). Tạo skill `/project-audit` mới ưu tiên Grapuco. Bổ sung 1 dòng Grapuco vào `big-feature` (Bước 1), `diagnose-bug` (Bước 2), `small-change` (ràng buộc optional). `CLAUDE.md` thêm reference ngắn. Không đổi workflow cốt lõi, không bắt buộc Grapuco cho task nhỏ.

Files: `.claude/rules/global.md`, `CLAUDE.md`, `.claude/skills/project-audit/SKILL.md` (mới), `.claude/skills/big-feature/SKILL.md`, `.claude/skills/diagnose-bug/SKILL.md`, `.claude/skills/small-change/SKILL.md`

---

## [HIRA-010] Quiz Logic Audit & Fix — 2026-04-04

Audit toàn bộ quiz engine, phát hiện và fix 3 bugs P1 + 1 vấn đề P2. Bug 1: `optionsArea` ẩn vĩnh viễn sau review + restart — fix bằng reset display trong `renderQuestion()`. Bug 2: `skipBtn` ẩn tương tự — fix cùng chỗ. Bug 3: stale setTimeout crash khi restart trong feedbackDelay window — fix bằng null guard. P2: câu hỏi lặp trong session — fix bằng sequential pick (`questionCount % dataSet.length`) với pre-shuffle khi bắt đầu quiz. Thêm maxAttempts guard cho while loop trong `generateQuestion()`.

Files: `quiz.js`

---

## [HIRA-008] Session Persistence — 2026-04-04

Thêm cơ chế lưu màn hình hiện tại vào `sessionStorage` để khôi phục sau khi reload (F5). Các màn hình setup và progress được restore đầy đủ cùng state. Mid-quiz và mid-flashcard intentionally về mode-selection. Thêm `saveSession`, `loadSession`, `clearSession` vào `progress.js`. Thêm `restoreSession`, `applySettingsButtons` vào `quiz.js`, gắn save/clear vào toàn bộ screen transitions.

Files: `progress.js`, `quiz.js`

---

## [HIRA-007] Back Navigation — 2026-04-03

Thêm nút "Quay Lại" vào 2 màn hình còn thiếu: `quiztype-screen` (về mode-selection) và `difficulty-screen` (về quiztype). State reset đúng theo từng bước: back từ quiztype reset `mode`, back từ difficulty reset `quizType` và `questionSet`. Style dùng class `.back-btn` nhất quán với các back button hiện có.

Files: `index.html`, `quiz.js`, `style.css`

---

## [HIRA-006] Adaptive Review System — 2026-04-02

Thêm Weak Items tracking và Weak Review Mode. Khi trả lời sai/skip → ký tự ghi vào weak items. Khi trả lời đúng → tự động xóa khỏi weak items (adaptive). Nút "Weak Review" trên mode-selection-screen cho phép quiz chỉ các ký tự yếu, bỏ qua difficulty/group/settings. Dashboard cập nhật thêm cột Weak count và nút Reset Weak Items. Bug fix: `generateQuestion()` crash khi weak items < 4 — dùng full dataset làm option pool khi cần.

Files: `progress.js`, `quiz.js`, `index.html`, `style.css`

---

## [HIRA-005] Learning Progress Dashboard + localStorage Persistence — 2026-04-02

Thêm hệ thống lưu tiến trình học vào localStorage và màn hình Progress Dashboard.
Tạo `progress.js` (persistence layer độc lập) với `loadProgress()`, `saveProgress()`, `resetProgress()`.
Progress tự động lưu sau mỗi Quiz Mode completion. Dashboard hiển thị Overall stats + breakdown theo 3 quiz types.
Nút "View Progress" trên mode-selection-screen, nút "Reset Progress" có confirm dialog.
Flashcard Mode không track trong v1.

Files: `progress.js` (mới), `index.html`, `quiz.js`, `style.css`

---

## [HIRA-004] Flashcard Mode — 2026-03-31

Thêm Flashcard Mode song song với Quiz Mode. Người dùng chọn mode từ màn hình đầu tiên mới (mode-selection-screen).
Flashcard tái sử dụng quiz type selection, group filter, và dataset hiện có — không tạo engine riêng.
Flow: mode → quiz type → group → flashcard session (shuffle cards, show/hide answer, knew/review, summary).
Cả Quiz Mode và Flashcard Mode restart đều về mode-selection-screen.

Files: `index.html`, `quiz.js`, `style.css`

---

## [HIRA-003] Kanji Mode — 2026-03-30

Thêm Kanji như quiz type thứ ba. Dataset 27 ký tự N5 chia 3 nhóm (numbers, nature, people).
Đổi `KANA_GROUP_CONFIG` thành `GROUP_CONFIG` per quiz type để hỗ trợ nhóm riêng cho từng chế độ.
Group buttons render động bằng JS thay vì hardcode HTML.

Files: `hiraganaData.js`, `quiz.js`, `index.html`

---

## [HIRA-002] Question History — 2026-03-30

Thêm `questionHistory[]` track toàn bộ câu đã trả lời. Thêm nút "Review All" luôn xuất hiện sau quiz,
không phụ thuộc vào `reviewEnabled`. Mỗi entry hiển thị kana, đáp án chọn, đáp án đúng, status Correct/Incorrect.

Files: `quiz.js`, `index.html`

---

## [HIRA-001] Quiz Group Filter — 2026-03-30

Thêm màn hình Group Filter trước Settings. Người dùng chọn nhóm kana để giới hạn phạm vi quiz.
4 nhóm: All, Basic vowels, K-group, S-group. Dùng chung cho Hiragana và Katakana qua `KANA_GROUP_CONFIG`.

Files: `hiraganaData.js`, `quiz.js`, `index.html`, `style.css`

---

## [HIRA-000] Workflow Bootstrap — 2026-03-30

Thiết lập cấu trúc docs, workflow task, rules AI cho project.
Tạo `docs/ai/`, `.claude/rules/`, templates, CLAUDE.md.
