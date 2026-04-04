# HIRA-008 — Plan

## Impacted files
- `src/progress.js`
- `src/quiz.js`

## Quyết định thiết kế

### sessionStorage vs localStorage
Dùng `sessionStorage` — cleared khi tab đóng, nhưng survive F5 reload trong cùng tab. Phù hợp với use case "nhớ màn hình trong session hiện tại".

### Session key
`hiragna_session` — nhất quán với naming convention hiện có (`hiragna_progress`, `hiragna_weak_items`).

### Dữ liệu lưu vào session
Lưu đúng những gì cần để restore màn hình đó, không lưu dư:

```
mode-selection-screen → { screen }
quiztype-screen       → { screen, mode }
difficulty-screen     → { screen, mode, quizType }
group-filter-screen   → { screen, mode, quizType, difficulty, totalQuestions }
settings-screen       → { screen, mode, quizType, difficulty, totalQuestions,
                          selectedGroup, autoAdvance, feedbackDelay, reviewEnabled }
progress-screen       → { screen }
main-quiz             → { screen: 'mode-selection-screen' }  ← intentional downgrade
flashcard-screen      → { screen: 'mode-selection-screen' }  ← intentional downgrade
```

### clearSession khi nào
- `restartBtn` click (về mode-selection)
- `fcRestartBtn` click (về mode-selection)
- `backFromQuiztypeBtn` click (về mode-selection)
- `backFromProgressBtn` click (về mode-selection)

Không cần clear khi navigate forward — overwrite tự nhiên.

### Khôi phục settings-screen
Settings screen cần re-apply `.active` class trên các setting buttons sau khi restore. Tạo hàm `applySettingsButtons()` để làm việc này.

### Khôi phục group-filter-screen
Cần gọi `renderGroupButtons()` để render lại group buttons theo `quizType`. `selectedGroup` sẽ tự reset về default của `renderGroupButtons()` (group đầu tiên) — chấp nhận được vì group selection chưa được lưu tại màn này (chỉ lưu sau khi vào settings).

## Risks
- **Session stale/corrupted:** Wrap restore logic trong try/catch, fallback về mode-selection nếu lỗi
- **QUIZ_TYPE_CONFIG dependency:** Restore cần `QUIZ_TYPE_CONFIG[quizType]` valid — validate trước khi dùng
- **settings-screen restore:** Cần đồng bộ cả `quizState` fields lẫn UI button active states

## Các bước implement

### progress.js
1. Thêm `SESSION_KEY = 'hiragna_session'`
2. Thêm `saveSession(data)` — ghi vào sessionStorage
3. Thêm `loadSession()` — đọc từ sessionStorage, trả về null nếu không có
4. Thêm `clearSession()` — xóa session

### quiz.js
5. Thêm hàm `applySettingsButtons()` — re-apply `.active` trên setting buttons theo quizState hiện tại
6. Thêm hàm `restoreSession()` — đọc session, restore màn hình và state tương ứng; fallback về mode-selection nếu lỗi
7. Thêm `saveSession(...)` tại mỗi screen transition:
   - show `mode-selection-screen`
   - show `quiztype-screen`
   - show `difficulty-screen`
   - show `group-filter-screen`
   - show `settings-screen`
   - show `main-quiz` (save 'mode-selection-screen')
   - show `flashcard-screen` (save 'mode-selection-screen')
   - show `progress-screen`
8. Thêm `clearSession()` tại:
   - `restartBtn` click
   - `fcRestartBtn` click
   - `backFromQuiztypeBtn` click
   - `backFromProgressBtn` click
9. Thay thế initial display logic ở cuối `DOMContentLoaded` bằng call `restoreSession()`

## Self-review plan
- [ ] F5 tại quiztype-screen → restore đúng màn và mode
- [ ] F5 tại difficulty-screen → restore đúng màn, mode, quizType
- [ ] F5 tại group-filter-screen → restore đúng màn, buttons render đúng
- [ ] F5 tại settings-screen → restore đúng màn + active states đúng
- [ ] F5 tại progress-screen → restore progress screen, data hiển thị đúng
- [ ] F5 tại main-quiz (mid-quiz) → về mode-selection
- [ ] F5 tại flashcard-screen → về mode-selection
- [ ] Restart → clear session → F5 → mode-selection (không restore)
- [ ] Back về mode-selection → clear session → F5 → mode-selection
- [ ] Không regression: back buttons, quiz flow, flashcard flow vẫn đúng

## Docs impact
- `docs/ai/core/architecture.md` — thêm sessionStorage layer
- `docs/ai/product/current-flows.md` — ghi chú session persistence behavior
- `docs/ai/history/changelog.md` — entry HIRA-008
