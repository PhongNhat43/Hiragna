#!/bin/bash
# verify.sh — Kiểm tra scaffold và task workflow structure của project Hiragna

PASS=0; FAIL=0

check() {
  if [ -e "$1" ]; then
    echo "  OK      $1"
    ((PASS++))
  else
    echo "  MISSING $1"
    ((FAIL++))
  fi
}

echo "=== Source files ==="
check "src/index.html"
check "src/style.css"
check "src/quiz.js"
check "src/hiraganaData.js"

echo ""
echo "=== Claude Code config ==="
check "CLAUDE.md"
check ".claude/settings.json"
check ".claude/rules/global.md"
check ".claude/rules/bug-handling.md"
check ".claude/rules/docs-sync.md"
check ".claude/rules/self-test.md"
check ".claude/rules/task-sizing.md"

echo ""
echo "=== Core docs ==="
check "docs/ai/core/context.md"
check "docs/ai/core/architecture.md"
check "docs/ai/core/glossary.md"
check "docs/ai/core/risk-zones.md"

echo ""
echo "=== Product docs ==="
check "docs/ai/product/current-features.md"
check "docs/ai/product/current-flows.md"

echo ""
echo "=== History ==="
check "docs/ai/history/changelog.md"
check "docs/ai/history/decisions.md"

echo ""
echo "=== Task workflow templates ==="
check "docs/ai/templates/task-record-template.md"
check "docs/ai/templates/plan-record-template.md"
check "docs/ai/templates/result-record-template.md"
check "docs/ai/templates/review-checklist.md"
check "docs/ai/templates/verification-checklist.md"

echo ""
echo "=== Task directories ==="
check "docs/ai/tasks/active"
check "docs/ai/tasks/archive"

echo ""
echo "Kết quả: $PASS OK / $FAIL MISSING"
[ $FAIL -eq 0 ] && echo "Scaffold hợp lệ." && exit 0 || exit 1
