# SAT R&W Practice

Static SAT Reading & Writing practice site for GitHub Pages.

## Included

- 1,845 imported SAT Reading & Writing questions
- Standard English Conventions
- Information and Ideas
- Craft and Structure
- Expression of Ideas
- Easy / Medium / Hard filters
- Mixed randomized practice
- 10 / 20 / 30 / 40 / 50 / 100 question sessions
- Immediate answer feedback and rationales
- Session score and category breakdown

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Do not open `index.html` directly if your browser blocks local `fetch()` requests; use the local server above.

## GitHub Pages

Upload `index.html`, `styles.css`, `app.js`, and `questions.json` to the repository root, then enable GitHub Pages from the `main` branch and `/ (root)` folder.

## Question data

`questions.json` contains the imported question data with question ID, domain, skill, difficulty, passage, prompt, four choices, correct answer, and rationale.
