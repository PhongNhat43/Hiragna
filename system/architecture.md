# System Architecture

## Overview

The application consists of three layers:

1. UI Layer
2. Quiz Logic Layer
3. Data Layer

---

## UI Layer

Files:
src/index.html
src/style.css

Responsibilities:
- Render quiz interface
- Display timer
- Display progress
- Display answer options
- Display results

UI does NOT contain quiz logic.

---

## Quiz Logic Layer

File:
src/quiz.js

Responsibilities:
- Manage quiz state
- Generate questions
- Validate answers
- Track score
- Handle timer
- Handle skip
- Handle review incorrect answers

---

## Data Layer

File:
src/hiraganaData.js

Responsibilities:
- Store Hiragana characters
- Store romaji mapping

Example:

{
  kana: "あ",
  romaji: "a"
}