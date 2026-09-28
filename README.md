# SAT R&W Practice — Starter

A no-build, vanilla HTML/CSS/JS starter for an SAT Reading & Writing practice site.

## Run it

Open `index.html` in a browser.

For development, you can also run a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Add your question bank

Edit `QUESTION_BANK` in `app.js`.

Each question has:

- `id`
- `category`
- `passage`
- `question`
- `choices` — exactly four choices
- `answer` — zero-based index
- `explanation`

Supported categories:

- Standard English Conventions
- Information and Ideas
- Craft and Structure
- Expression of Ideas

The current questions are original starter questions, not copied from the College Board Question Bank.
