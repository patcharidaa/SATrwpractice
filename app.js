const QUESTION_BANK = [
  {
    id: 1,
    category: "Standard English Conventions",
    passage: "The Hubble Space Telescope has transformed astronomers' understanding of distant galaxies. Launched in 1990, the telescope has provided images that are both remarkably detailed and scientifically ____.",
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["valuable", "valuable,", "valuable;", "valuable:"],
    answer: 0,
    explanation: "The blank completes the predicate adjective phrase. No punctuation is needed between the adjective and the period."
  },
  {
    id: 2,
    category: "Information and Ideas",
    passage: "Researchers studying urban trees compared neighborhoods with extensive tree cover to neighborhoods with little vegetation. After accounting for income and population density, they found that neighborhoods with more trees tended to have lower average summer temperatures.",
    question: "Which finding, if true, would most directly support the researchers' conclusion?",
    choices: [
      "Residents in neighborhoods with more trees reported spending more time outdoors.",
      "Temperature differences were greatest during the hottest days of the summer.",
      "The neighborhoods with more trees also had older buildings.",
      "Some tree species were much more common in one neighborhood than another."
    ],
    answer: 1,
    explanation: "A larger temperature difference specifically during hot days would directly reinforce the claim that tree cover is associated with lower summer temperatures."
  },
  {
    id: 3,
    category: "Craft and Structure",
    passage: "Although the critic initially regarded the artist's minimalist sculptures as austere, she later described them as 'quietly insistent,' emphasizing how their simplicity drew viewers' attention to subtle changes in light and shadow.",
    question: "As used in the text, what does 'austere' most nearly mean?",
    choices: ["Severe in appearance", "Expensive to produce", "Difficult to interpret", "Historically significant"],
    answer: 0,
    explanation: "Here, 'austere' describes the sculptures' simple, restrained appearance. The later phrase about simplicity and subtle visual effects reinforces this meaning."
  },
  {
    id: 4,
    category: "Expression of Ideas",
    passage: "A city library recently expanded its collection of large-print books. The library also began advertising the collection in community newsletters and at local senior centers. ____ , circulation of large-print books increased substantially over the following six months.",
    question: "Which choice completes the text with the most logical transition?",
    choices: ["Nevertheless,", "For example,", "As a result,", "In contrast,"],
    answer: 2,
    explanation: "'As a result' correctly signals that the increase in circulation followed the library's expansion and promotion of the collection."
  },
  {
    id: 5,
    category: "Standard English Conventions",
    passage: "Marine biologist Ayana Lewis studies coral reefs, which are among the most diverse ecosystems on Earth. Her research focuses on how changes in ocean temperature ____ coral growth.",
    question: "Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ["affect", "affects", "have affected", "are affecting"],
    answer: 0,
    explanation: "The plural subject 'changes' takes the plural verb 'affect.'"
  },
  {
    id: 6,
    category: "Information and Ideas",
    passage: "In a study of migratory birds, scientists fitted several birds with lightweight tracking devices. The data showed that birds flying along coastlines often changed direction when approaching major storms, whereas birds traveling inland were less likely to alter their routes.",
    question: "Which statement is best supported by the text?",
    choices: [
      "All migratory birds avoid storms by flying inland.",
      "The tracking devices caused birds to change their routes.",
      "Storms may influence the routes of some coastal migratory birds.",
      "Coastal birds migrate shorter distances than inland birds."
    ],
    answer: 2,
    explanation: "The passage reports that coastal birds often changed direction near major storms, directly supporting the conclusion that storms may influence their routes."
  },
  {
    id: 7,
    category: "Craft and Structure",
    passage: "The historian does not dismiss the traditional account outright; rather, she treats it with skepticism, comparing it with newly uncovered letters and financial records.",
    question: "What does the phrase 'does not dismiss ... outright' most nearly indicate?",
    choices: [
      "The historian accepts the traditional account without question.",
      "The historian rejects the traditional account completely.",
      "The historian considers the traditional account but tests it against other evidence.",
      "The historian has not encountered the traditional account."
    ],
    answer: 2,
    explanation: "The contrast between 'does not dismiss' and her use of additional records shows that she considers the account while critically evaluating it."
  },
  {
    id: 8,
    category: "Expression of Ideas",
    passage: "Scientists have long used ice cores to reconstruct past climates. Each layer can preserve particles and gases from the atmosphere at the time the ice formed. ____ , researchers can use ice cores to compare atmospheric conditions across thousands of years.",
    question: "Which choice completes the text with the most logical transition?",
    choices: ["In other words,", "As a consequence,", "Meanwhile,", "For instance,"],
    answer: 1,
    explanation: "'As a consequence' logically connects the preserved atmospheric evidence to the researchers' ability to compare conditions over long periods."
  }
];

const CATEGORY_INFO = {
  "Standard English Conventions": ["✎", "Grammar, punctuation, sentence structure, and usage"],
  "Information and Ideas": ["◈", "Central ideas, evidence, inference, and quantitative information"],
  "Craft and Structure": ["⌕", "Words in context, purpose, structure, and rhetorical choices"],
  "Expression of Ideas": ["↗", "Transitions, organization, and rhetorical synthesis"]
};

const state = {
  mode: null,
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  selected: null,
  byCategory: {}
};

const app = document.getElementById("app");

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
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function renderHome() {
  const categories = Object.entries(CATEGORY_INFO).map(([name, [icon, desc]]) => `
    <button class="category" onclick="startSession('${name}')">
      <div class="icon">${icon}</div>
      <h2>${name}</h2>
      <p>${desc}</p>
    </button>
  `).join("");

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">SAT <span>R&W</span> Practice</div>
      <div class="muted">Original practice bank</div>
    </header>
    <main class="container">
      <section class="hero">
        <h1>What do you want to practice?</h1>
        <p>Pick a Reading & Writing domain, or let the app scramble everything together.</p>
      </section>
      <div class="grid">
        ${categories}
        <button class="category mixed" onclick="startSession('Mixed')">
          <div class="icon">🎲</div>
          <h2>Mixed — Randomize Everything</h2>
          <p>Questions from every R&W domain in a completely shuffled order.</p>
        </button>
      </div>
    </main>
  `;
}

function startSession(mode) {
  state.mode = mode;
  state.questions = mode === "Mixed"
    ? shuffle(QUESTION_BANK)
    : shuffle(QUESTION_BANK.filter(q => q.category === mode));
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
  const progress = ((state.index) / total) * 100;

  const choices = q.choices.map((choice, i) => `
    <button
      class="choice ${state.answered && i === q.answer ? "correct" : ""}
      ${state.answered && i === state.selected && i !== q.answer ? "wrong" : ""}"
      onclick="answer(${i})"
      ${state.answered ? "disabled" : ""}
    >
      <span class="letter">${String.fromCharCode(65 + i)}</span>
      <span>${escapeHTML(choice)}</span>
    </button>
  `).join("");

  const explanation = state.answered ? `
    <div class="explanation">
      <div class="result-note ${state.selected === q.answer ? "correct-text" : "wrong-text"}">
        ${state.selected === q.answer ? "✓ Correct" : "✗ Incorrect"}
      </div>
      <strong>Correct answer: ${String.fromCharCode(65 + q.answer)}. ${escapeHTML(q.choices[q.answer])}</strong>
      <div>${escapeHTML(q.explanation)}</div>
    </div>
  ` : "";

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">SAT <span>R&W</span> Practice</div>
      <button class="btn secondary" onclick="renderHome()">Exit</button>
    </header>
    <main class="container practice-wrap">
      <div class="session-head">
        <div class="session-meta">
          <span>${escapeHTML(state.mode)}</span>
          <span>Question ${state.index + 1} of ${total}</span>
        </div>
        <div class="progress"><div style="width:${progress}%"></div></div>
      </div>

      <section class="card">
        <div class="tag">${escapeHTML(q.category)}</div>
        <div class="passage">${escapeHTML(q.passage)}</div>
        <div class="question">${escapeHTML(q.question)}</div>
        <div class="choices">${choices}</div>
        ${explanation}

        <div class="actions">
          <button class="btn secondary" onclick="renderHome()">Change topic</button>
          <button class="btn primary" onclick="nextQuestion()" ${state.answered ? "" : "disabled"}>
            ${state.index === total - 1 ? "See results" : "Next question →"}
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
  if (state.index === state.questions.length - 1) {
    renderResults();
    return;
  }
  state.index++;
  state.answered = false;
  state.selected = null;
  renderQuestion();
}

function renderResults() {
  const pct = Math.round((state.score / state.questions.length) * 100);
  const rows = Object.entries(state.byCategory).map(([cat, data]) => `
    <div class="row">
      <span>${escapeHTML(cat)}</span>
      <strong>${data.correct}/${data.total}</strong>
    </div>
  `).join("");

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">SAT <span>R&W</span> Practice</div>
    </header>
    <main class="container practice-wrap">
      <section class="card results">
        <div class="tag">${escapeHTML(state.mode)} session complete</div>
        <h1>Nice work.</h1>
        <div class="score">${state.score}/${state.questions.length}</div>
        <p class="muted">${pct}% correct</p>
        <div class="breakdown">${rows}</div>
        <div class="actions">
          <button class="btn secondary" onclick="renderHome()">Choose another topic</button>
          <button class="btn primary" onclick="startSession('${escapeHTML(state.mode)}')">Practice again</button>
        </div>
      </section>
    </main>
  `;
}

renderHome();
