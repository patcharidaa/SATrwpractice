let QUESTION_BANK = [];

const state = {
  mode: null,
  difficulty: 'Mixed',
  count: 20,
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  selected: null,
  byCategory: {}
};

const CATEGORY_INFO = {
  'Standard English Conventions': ['✎', 'Grammar, punctuation, sentence structure, and usage'],
  'Information and Ideas': ['◈', 'Central ideas, evidence, inference, and quantitative information'],
  'Craft and Structure': ['⌕', 'Words in context, purpose, structure, and rhetorical choices'],
  'Expression of Ideas': ['↗', 'Transitions and rhetorical synthesis']
};

const app = document.getElementById('app');

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[c]));
}

async function init() {
  try {
    const res = await fetch('questions.json');
    if (!res.ok) throw new Error('Could not load question bank');
    QUESTION_BANK = await res.json();
    renderHome();
  } catch (err) {
    app.innerHTML = `<main class="container"><section class="card center"><h1>Couldn’t load the question bank</h1><p class="muted">Make sure <code>questions.json</code> is in the same folder as this page.</p><p>${escapeHTML(err.message)}</p></section></main>`;
  }
}

function renderHome() {
  const categories = Object.entries(CATEGORY_INFO).map(([name, [icon, desc]]) => `
    <button class="category ${state.mode === name ? 'selected' : ''}" onclick="selectMode('${name}')">
      <div class="icon">${icon}</div>
      <h2>${name}</h2>
      <p>${desc}</p>
      <span class="category-count">${QUESTION_BANK.filter(q => q.category === name).length} questions</span>
    </button>
  `).join('');

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">SAT <span>R&W</span> Practice</div>
      <div class="muted">${QUESTION_BANK.length.toLocaleString()} questions loaded</div>
    </header>
    <main class="container">
      <section class="hero">
        <div class="eyebrow">SAT READING & WRITING</div>
        <h1>What do you want to practice?</h1>
        <p>Choose a domain or scramble the entire question bank. Every question includes its difficulty, answer, and explanation.</p>
      </section>

      <div class="grid">
        ${categories}
        <button class="category mixed ${state.mode === 'Mixed' ? 'selected' : ''}" onclick="selectMode('Mixed')">
          <div class="icon">🎲</div>
          <h2>Mixed — Randomize Everything</h2>
          <p>Pull questions from every R&W domain in a completely shuffled order.</p>
          <span class="category-count">${QUESTION_BANK.length.toLocaleString()} questions</span>
        </button>
      </div>

      <section class="settings card">
        <div>
          <h2>Session settings</h2>
          <p class="muted">${state.mode ? `Selected: ${state.mode}` : 'Select a domain above to begin.'}</p>
        </div>
        <div class="settings-grid">
          <label>Difficulty
            <select id="difficulty">
              ${['Mixed','Easy','Medium','Hard'].map(x => `<option ${state.difficulty===x?'selected':''}>${x}</option>`).join('')}
            </select>
          </label>
          <label>Questions
            <select id="count">
              ${[10,20,30,40,50,100].map(x => `<option value="${x}" ${state.count===x?'selected':''}>${x}</option>`).join('')}
            </select>
          </label>
        </div>
        <button class="btn primary start" onclick="startSession()" ${state.mode ? '' : 'disabled'}>Start practice →</button>
      </section>
    </main>
  `;
}

function selectMode(mode) {
  state.mode = mode;
  renderHome();
}

function startSession() {
  state.difficulty = document.getElementById('difficulty').value;
  state.count = Number(document.getElementById('count').value);

  let pool = state.mode === 'Mixed'
    ? QUESTION_BANK
    : QUESTION_BANK.filter(q => q.category === state.mode);

  if (state.difficulty !== 'Mixed') {
    pool = pool.filter(q => q.difficulty === state.difficulty);
  }

  state.questions = shuffle(pool).slice(0, Math.min(state.count, pool.length));
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.selected = null;
  state.byCategory = {};
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  const total = state.questions.length;
  const progress = (state.index / total) * 100;

  const choices = q.choices.map((choice, i) => `
    <button class="choice ${state.answered && i === q.answer ? 'correct' : ''} ${state.answered && i === state.selected && i !== q.answer ? 'wrong' : ''}"
      onclick="answer(${i})" ${state.answered ? 'disabled' : ''}>
      <span class="letter">${String.fromCharCode(65 + i)}</span>
      <span>${escapeHTML(choice)}</span>
    </button>
  `).join('');

  const explanation = state.answered ? `
    <div class="explanation">
      <div class="result-note ${state.selected === q.answer ? 'correct-text' : 'wrong-text'}">
        ${state.selected === q.answer ? '✓ Correct' : '✗ Incorrect'}
      </div>
      <strong>Correct answer: ${String.fromCharCode(65 + q.answer)}. ${escapeHTML(q.choices[q.answer])}</strong>
      <div class="rationale">${escapeHTML(q.explanation)}</div>
    </div>
  ` : '';

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">SAT <span>R&W</span> Practice</div>
      <button class="btn secondary" onclick="renderHome()">Exit</button>
    </header>
    <main class="container practice-wrap">
      <div class="session-head">
        <div class="session-meta">
          <span>${escapeHTML(state.mode)} · ${escapeHTML(state.difficulty)}</span>
          <span>Question ${state.index + 1} of ${total}</span>
        </div>
        <div class="progress"><div style="width:${progress}%"></div></div>
      </div>

      <section class="card">
        <div class="question-top">
          <span class="tag">${escapeHTML(q.category)}</span>
          <span class="difficulty ${q.difficulty.toLowerCase()}">${escapeHTML(q.difficulty)}</span>
        </div>
        <div class="skill">${escapeHTML(q.skill)}</div>
        <div class="passage">${escapeHTML(q.passage)}</div>
        <div class="question">${escapeHTML(q.question)}</div>
        <div class="choices">${choices}</div>
        ${explanation}
        <div class="actions">
          <button class="btn secondary" onclick="renderHome()">Change topic</button>
          <button class="btn primary" onclick="nextQuestion()" ${state.answered ? '' : 'disabled'}>
            ${state.index === total - 1 ? 'See results' : 'Next question →'}
          </button>
        </div>
      </section>
    </main>
  `;
}

function answer(index) {
  if (state.answered) return;
  const q = state.questions[state.index];
  state.selected = index;
  state.answered = true;
  if (index === q.answer) state.score++;

  state.byCategory[q.category] ??= { correct: 0, total: 0 };
  state.byCategory[q.category].total++;
  if (index === q.answer) state.byCategory[q.category].correct++;
  renderQuestion();
}

function nextQuestion() {
  if (!state.answered) return;
  if (state.index === state.questions.length - 1) return renderResults();
  state.index++;
  state.answered = false;
  state.selected = null;
  renderQuestion();
}

function renderResults() {
  const pct = Math.round((state.score / state.questions.length) * 100);
  const rows = Object.entries(state.byCategory).map(([cat, data]) => `
    <div class="row"><span>${escapeHTML(cat)}</span><strong>${data.correct}/${data.total}</strong></div>
  `).join('');

  app.innerHTML = `
    <header class="topbar"><div class="brand">SAT <span>R&W</span> Practice</div></header>
    <main class="container practice-wrap">
      <section class="card results">
        <div class="tag">${escapeHTML(state.mode)} · ${escapeHTML(state.difficulty)}</div>
        <h1>Session complete.</h1>
        <div class="score">${state.score}/${state.questions.length}</div>
        <p class="muted">${pct}% correct</p>
        <div class="breakdown">${rows}</div>
        <div class="actions">
          <button class="btn secondary" onclick="renderHome()">Choose another topic</button>
          <button class="btn primary" onclick="startSession()">Practice again</button>
        </div>
      </section>
    </main>
  `;
}

init();
