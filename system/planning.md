
# Japanese Character Quiz — Final Feature Plan

## Overview

A web-based quiz application for learning Japanese writing systems (Hiragana and Katakana). Users select a quiz type and difficulty level, then proceed through questions with immediate answer submission and automatic progression between questions. The application supports answer review after quiz completion.

---

## Goals and Features

### Core Features

* Support both Hiragana and Katakana quiz modes
* Random character questions with four answer options
* Three difficulty levels (Easy: 10 questions, Medium: 15, Hard: 20)
* Immediate answer submission on selection
* Score tracking
* Progress bar and question counter
* Automatic progression to the next question
* Answer highlighting (correct in green, incorrect in red, showing both selected wrong answer and correct answer)
* Post-quiz review of incorrect answers
* Skip question capability
* Full quiz restart with return to type/difficulty selection

### Non-Features

* No timer per question
* No manual "Next" button during quiz mode
* No modal dialogs or complex navigation

---

## Architecture Constraints

All implementation must strictly adhere to these rules:

1. **All quiz logic lives in `quiz.js`**
   * Question generation, validation, state management
   * Answer submission and progression logic
   * Score tracking and mistake recording

2. **UI rendering and state logic are separated**
   * State changes happen first
   * DOM updates follow state changes
   * No rendering logic mixed with business logic

3. **All quiz state is stored in `quizState` object**
   * No scattered state variables
   * Single source of truth

4. **No inline JavaScript in HTML**
   * Event listeners attached programmatically
   * All logic in script files

5. **No duplicated Hiragana/Katakana logic**
   * One quiz engine
   * Data-driven dataset selection
   * Shared answer handling and progression

---

## User Flow

```
Start Quiz
    ↓
Select Quiz Type (Hiragana / Katakana)
    ↓
Select Difficulty (Easy / Medium / Hard)
    ↓
Quiz Starts
    ↓
Display Question + Answer Options
    ↓
User Clicks Answer Option
    ↓
Answer Evaluated Immediately
    ↓
Visual Feedback (800ms delay showing correct/incorrect highlights)
    ↓
Auto-advance to Next Question
    ↓
[Repeat until totalQuestions reached]
    ↓
Quiz Ends
    ↓
Display Score and Results
    ↓
Show "Review Mistakes" Button (if any)
    ↓
User Can Review Mistakes (manual navigation)
    ↓
User Restart
    ↓
Return to Quiz Type Selection
```

---

## Configuration Objects

### Quiz Type Configuration

```js
const QUIZ_TYPE_CONFIG = {
  hiragana: {
    label: "Hiragana",
    data: HIRAGANA_DATA
  },
  katakana: {
    label: "Katakana",
    data: KATAKANA_DATA
  }
};
```

### Difficulty Configuration

```js
const DIFFICULTY_CONFIG = {
  easy: { totalQuestions: 10 },
  medium: { totalQuestions: 15 },
  hard: { totalQuestions: 20 }
};
```

### Data Format

Both Hiragana and Katakana datasets must follow this structure:

```js
const HIRAGANA_DATA = [
  { kana: "あ", romaji: "a" },
  { kana: "い", romaji: "i" },
  // ... more entries
];

const KATAKANA_DATA = [
  { kana: "ア", romaji: "a" },
  { kana: "イ", romaji: "i" },
  // ... more entries
];
```

---

## Quiz State Structure

```js
const quizState = {
  // Selection state
  quizType: null,           // "hiragana" or "katakana"
  difficulty: null,         // "easy", "medium", or "hard"
  
  // Dataset
  questionSet: null,        // array of character data for selected type
  totalQuestions: 10,       // total questions for this session
  
  // Progress
  questionCount: 0,         // current question index (0-based)
  score: 0,                 // correct answers count
  
  // Current question
  currentQuestion: null,    // { kana, correctRomaji, options }
  isAnswered: false,        // flag to prevent duplicate submissions
  
  // Quiz completion
  quizComplete: false,      // true when all questions answered
  
  // Review data
  incorrectAnswers: [],     // array of { kana, correctRomaji, userAnswer }
  reviewIndex: 0            // current position in review mode
};
```

---

## Quiz Behavior

### Answer Submission Flow

When user clicks an answer option:

1. **Check if already answered**
   * If `isAnswered === true`, ignore the click
   * Otherwise, proceed

2. **Evaluate answer**
   * Set `isAnswered = true` to prevent duplicate submissions
   * Check if `selectedRomaji === correctRomaji`
   * If correct: increment `score`
   * If incorrect: add to `incorrectAnswers` array with { kana, correctRomaji, userAnswer }

3. **Visual feedback (immediate)**
   * Disable all answer buttons
   * Highlight selected button
     * If correct: green background
     * If incorrect: red background
   * Show the correct answer with green highlight (even if user selected wrong one)

4. **Auto-advance (after 800ms delay)**
   * Increment `questionCount`
   * Check if `questionCount < totalQuestions`
   * If yes: call `renderQuestion()` to load next question
   * If no: call `showResult()` to display final score and review option

### Skip Question

When user clicks Skip:

1. Mark the question as incorrect (add to `incorrectAnswers` with appropriate marker)
2. Increment `questionCount`
3. Load next question automatically
4. Skip does not change the score (no points awarded or deducted)

---

## Answer Highlighting

### During Quiz

When an answer is submitted:

* **Clicked button styling:**
  * If correct: green background (`#bbf7d0`)
  * If incorrect: red background (`#fecaca`)

* **Show correct answer:**
  * If user clicked wrong: also highlight the correct button in green
  * If user clicked correct: only that button is green
  * All other buttons remain neutral
  * All buttons are disabled to prevent further clicks

### In Review Mode

* Do not show highlights
* Display character, user's selected answer, and correct answer as text
* Show whether user selected correctly or incorrectly

---

## Review Mode

### Activation

After quiz ends:

* If `incorrectAnswers.length > 0`:
  * Display "Review Mistakes" button
  * User can click to enter review mode

### Behavior

In review mode:

* Show the question and answers (no styling highlights)
* For each incorrect question, display:
  * The character (kana)
  * The user's selected answer (or "Skipped" if skipped)
  * The correct answer
* User can navigate between incorrect questions manually
* Typically with Previous/Next buttons (if not already implemented)
* Review is read-only—no scoring changes
* User can exit review and go to restart

### Important Constraint

* Review mode must work for both Hiragana and Katakana questions
* `quizState.incorrectAnswers` must preserve which quiz type it came from (if needed for display)

---

## Edge Cases and Safety

### Preventing Duplicate Submissions

* `isAnswered` flag is set immediately when user clicks
* If user rapidly clicks multiple buttons, only the first click is processed
* Any click after `isAnswered = true` is ignored

### Preventing Double Auto-Advance

* `advanceToNextQuestion()` is the only function that increments `questionCount`
* It's called from either:
  * Answer click handler (after 800ms delay)
  * Skip handler
* Once `questionCount` is incremented, the next `renderQuestion()` loads a different question

### Skipped Questions

* Skipped questions are recorded in `incorrectAnswers` array (they count as incorrect for review)
* They do not increment the score
* They do not cause quiz to end early

### Dataset Edge Cases

* If dataset has fewer entries than `totalQuestions`, questions may repeat (this is allowed)
* The application generates questions by randomly selecting from the dataset

### Restart Reset

When user clicks Restart:

```js
quizState.quizType = null;
quizState.questionSet = null;
quizState.difficulty = null;
quizState.totalQuestions = 10;
quizState.questionCount = 0;
quizState.score = 0;
quizState.quizComplete = false;
quizState.incorrectAnswers = [];
quizState.reviewIndex = 0;
quizState.isAnswered = false;
```

Then return to quiz type selection screen.

---

## Feature Completion Criteria

The feature is considered complete when:

1. **Quiz Type Selection**
   * User can select Hiragana or Katakana
   * Selection transitions to difficulty screen

2. **Difficulty Selection**
   * User can select Easy, Medium, or Hard
   * Selection initializes quiz with correct `totalQuestions`

3. **Question Generation**
   * Only Hiragana characters appear in Hiragana mode
   * Only Katakana characters appear in Katakana mode
   * Questions are generated from the correct dataset
   * Four answer options are provided for each question
   * Options are randomized and include the correct answer

4. **Answer Submission**
   * Clicking an answer immediately evaluates it
   * No Next button appears during quiz
   * Correct answers are highlighted in green
   * Incorrect answers are highlighted in red with correct answer shown
   * 800ms delay shows feedback before advancing
   * Double-clicks or rapid clicks don't cause issues

5. **Progress Tracking**
   * Progress bar reflects correct `totalQuestions`
   * Question counter shows current position (e.g., "5 / 10")
   * Progress updates after each answer

6. **Score Tracking**
   * Score increments only on correct answers
   * Score displays throughout quiz
   * Final score displays at end

7. **Auto-Advance**
   * Next question loads automatically after 800ms feedback delay
   * No manual action required

8. **Skip Functionality**
   * Skip button is present and clickable
   * Skipped questions appear in review
   * Skip does not increment score
   * Quiz advances to next question

9. **Quiz Completion**
   * Quiz ends after all `totalQuestions` are answered
   * Final score screen displays
   * "Review Mistakes" button appears if any incorrect answers exist

10. **Review Mode**
    * Review button works and displays all incorrect answers
    * Each incorrect answer shows character, user answer, and correct answer
    * User can navigate through incorrect answers
    * Review works for both Hiragana and Katakana sessions

11. **Restart**
    * Restart button returns to quiz type selection screen
    * All state is fully reset
    * Quiz can be restarted with different type/difficulty

12. **No Duplicated Logic**
    * One quiz engine handles both Hiragana and Katakana
    * Configuration drives dataset selection
    * No separate code paths for each quiz type

---

## Verification Checklist

### Pre-Quiz Screens

- [ ] Quiz type screen appears on page load with Hiragana and Katakana buttons
- [ ] Clicking Hiragana transitions to difficulty screen
- [ ] Clicking Katakana transitions to difficulty screen
- [ ] Difficulty screen shows Easy, Medium, Hard options
- [ ] Selecting difficulty starts the quiz

### Hiragana Easy Mode (10 questions)

- [ ] Only Hiragana characters appear
- [ ] Quiz has 10 questions
- [ ] Selecting an answer triggers visual feedback
- [ ] Green highlight appears for correct answer
- [ ] After answer, next question loads automatically
- [ ] At question 10, quiz ends
- [ ] Final score displays

### Katakana Easy Mode (10 questions)

- [ ] Only Katakana characters appear
- [ ] Quiz has 10 questions
- [ ] Selecting an answer triggers visual feedback
- [ ] Green highlight appears for correct answer
- [ ] After answer, next question loads automatically
- [ ] At question 10, quiz ends
- [ ] Final score displays

### Difficulty Variations

- [ ] Medium mode has 15 questions
- [ ] Hard mode has 20 questions
- [ ] Progress bar and counter reflect correct totals

### Answer Behavior

- [ ] Correct answer selection: green highlight only on selected button
- [ ] Incorrect answer selection: red highlight on selected button, green on correct button
- [ ] Buttons are disabled after answer selection
- [ ] Rapid clicking after answer does not submit twice
- [ ] 800ms delay shows feedback before advancing

### Skip Button

- [ ] Skip button skips current question
- [ ] Skipped question appears in review as incorrect
- [ ] Quiz advances to next question
- [ ] Skipped questions don't increment score

### Review Mode

- [ ] Review button appears after quiz with incorrect answers
- [ ] Review displays all incorrect questions
- [ ] Shows character, user answer, and correct answer for each
- [ ] Can navigate through incorrect answers

### Score Tracking

- [ ] Score increments only on correct answers
- [ ] Score displays during quiz
- [ ] Final score is accurate after completion

### Progress Bar

- [ ] Progress bar fills proportionally as questions are answered
- [ ] Correct total counted (10, 15, or 20)
- [ ] Counter displays "X / Total"

### Restart

- [ ] Restart button returns to quiz type selection
- [ ] All state is reset
- [ ] Can start new quiz with different type/difficulty  
- [ ] Previous score/progress doesn't carry over

### No Timer

- [ ] No timer element visible
- [ ] No time-based auto-advance
- [ ] Users can take as long as needed per question

### No Next Button

- [ ] Next button never appears during normal quiz mode
- [ ] Only available during review (if implemented there)

---

## Suggested Implementation Slices

### Slice 1: Add Katakana Data and Configuration

**Goal:** Support both Hiragana and Katakana datasets through configuration

* Add Katakana dataset to `hiraganaData.js` with same structure as Hiragana
* Create `QUIZ_TYPE_CONFIG` object mapping type to dataset
* No UI changes yet
* Keep existing Hiragana quiz working unchanged
* Test: Verify datasets load correctly

### Slice 2: Extend Quiz State for Multi-Type Support

**Goal:** Prepare quiz state to handle quiz type and dataset selection

* Add `quizType` and `questionSet` to `quizState`
* Update question generation to use `quizState.questionSet` instead of hardcoded dataset
* Update all question-related logic to reference the selected dataset
* Test: Verify question generation works with dynamic dataset

### Slice 3: Add Quiz Type Selection UI

**Goal:** Let users choose between Hiragana and Katakana before starting

* Add quiz type selection screen to HTML with two buttons
* Style the buttons to match existing design
* Attach event listeners to buttons in quiz.js
* On button click: set `quizState.quizType`, set `quizState.questionSet`, show difficulty screen
* Test: Verify clicking buttons transitions correctly

### Slice 4: Implement Immediate Answer Submission and Auto-Advance

**Goal:** Remove manual Next button and auto-progress after answer selection

* Modify `handleAnswer()` to call `advanceToNextQuestion()` after 800ms delay instead of showing Next button
* Create `advanceToNextQuestion()` function that increments question count and loads next question or results
* Ensure `isAnswered` flag prevents duplicate submissions
* Hide Next button from display during quiz
* Test: Verify answers submit immediately and quiz auto-advances without needing Next button

### Slice 5: Implement Correct/Incorrect Answer Highlighting

**Goal:** Show visual feedback for answer selection with both wrong and correct highlighted

* In `handleAnswer()`: when answer is incorrect, highlight both the selected wrong button (red) and the correct button (green)
* Add 800ms delay before auto-advance to show the highlights
* Ensure all buttons are disabled after answer to prevent further clicks
* Test: Verify incorrect answers show both red (selected) and green (correct) highlights

### Slice 6: Implement Skip Question

**Goal:** Allow users to skip questions and have them counted as incorrect

* Add skip button functionality
* When Skip clicked: record as incorrect answer and auto-advance
* Skipped questions appear in review
* Test: Verify skipped questions work correctly and appear in review

### Slice 7: Implement Review Mistakes

**Goal:** Display incorrect answers after quiz completion

* Create `showResult()` function showing final score and review button
* Implement review mode display showing character, user answer, and correct answer
* Test: Verify review works after both Hiragana and Katakana quizzes

### Slice 8: Implement Restart and Full State Reset

**Goal:** Allow users to fully reset and restart from type selection

* Implement Restart button functionality
* Reset all `quizState` properties
* Return to quiz type selection screen
* Test: Verify restart works and state is fully cleared

---

## Implementation Reference

### Key Functions

| Function | Purpose |
| --- | --- |
| `generateQuestion()` | Create a new question from selected dataset |
| `validateAnswer(romaji)` | Check if answer is correct, update score |
| `handleAnswer(option, btn)` | Process user's answer selection |
| `advanceToNextQuestion()` | Move to next question or show results |
| `renderQuestion()` | Display question and answer options |
| `showResult()` | Display final score and review button |
| `renderProgress()` | Update progress bar and counter |

### Key State Properties

| Property | Purpose |
| --- | --- |
| `quizType` | Selected quiz type ("hiragana" or "katakana") |
| `questionSet` | Array of question data for selected type |
| `difficulty` | Selected difficulty ("easy", "medium", "hard") |
| `totalQuestions` | Total questions for this session |
| `questionCount` | Current question index |
| `score` | Number of correct answers |
| `isAnswered` | Prevents duplicate answer submissions |
| `incorrectAnswers` | Array of incorrectly answered questions |

---

## Architecture Notes

1. **No Timer Logic:** All timer-related code has been removed. The application no longer tracks or displays time per question.

2. **Immediate Feedback:** Answer evaluation and visual feedback happen in `handleAnswer()`. Auto-advance happens after an 800ms delay to allow users to see the feedback.

3. **Shared Quiz Engine:** Both Hiragana and Katakana use the same generation, validation, and progression logic. The only difference is which dataset (`questionSet`) is used.

4. **State-Driven Design:** Configuration objects and `quizState` drive all behavior. No hardcoded values or special cases for each quiz type.

5. **Clear Separation:** Quiz logic (state, validation, progression) is in `quiz.js`. DOM manipulation and rendering happens in event listeners and render functions within `quiz.js`.

---
