# Coding Rules

## Architecture Rules

1. Quiz logic must be implemented only in `quiz.js`.
2. UI rendering must be separated from logic functions.
3. All quiz state must be stored in a single `quizState` object.

---

## State Management

All quiz state must be stored in: quizState


Example fields:

- score
- currentQuestion
- timer
- totalQuestions
- incorrectAnswers

---

## Event Handling

All UI interactions must go through event listeners.

Buttons must never contain inline JavaScript.

Example (correct):

button.addEventListener("click", handleAnswer)

Example (incorrect):

<button onclick="handleAnswer()">

---

## Code Quality

Functions must be small and modular.

Example functions:

initializeQuiz()
generateQuestion()
generateAnswerOptions()
validateAnswer()
startTimer()
stopTimer()
renderQuestion()
renderScore()
renderProgress()

# Global Rules

## Language

All AI explanations, planning, and logs must be written in Vietnamese.

Exceptions:
- Programming languages (JavaScript, HTML, CSS)
- Technical keywords

Example:

Correct:
"Chức năng này dùng để quản lý trạng thái của quiz."

Incorrect:
"This function manages quiz state."
