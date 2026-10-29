'use strict';

// Menu mobile
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

// Pequeno modelo didático da hemoglobina: destaca os quatro grupos heme.
document.querySelectorAll('.heme').forEach((heme) => {
  heme.addEventListener('click', () => {
    const wasActive = heme.classList.contains('is-active');
    document.querySelectorAll('.heme').forEach((item) => item.classList.remove('is-active'));
    if (!wasActive) heme.classList.add('is-active');
  });
});

// Simulação do trajeto do oxigênio.
const labScene = document.querySelector('#labScene');
const transportNext = document.querySelector('#transportNext');
const transportReset = document.querySelector('#transportReset');
const sceneLabel = document.querySelector('#sceneLabel');
const sceneExplanation = document.querySelector('#sceneExplanation');
const sceneProgressFill = document.querySelector('#sceneProgressFill');
const labSteps = [...document.querySelectorAll('.lab-step')];
let transportStage = 0;

const transportStages = [
  {
    label: 'ETAPA 1 — PULMÕES',
    explanation: 'Nos alvéolos pulmonares, o oxigênio passa para o sangue e se liga à hemoglobina dentro das hemácias.',
    button: 'Levar às células',
    progress: '33.33%'
  },
  {
    label: 'ETAPA 2 — CIRCULAÇÃO',
    explanation: 'A hemácia percorre os vasos sanguíneos com grande parte do O₂ ligada à hemoglobina. O sangue distribui esse oxigênio pelo corpo.',
    button: 'Liberar oxigênio',
    progress: '66.66%'
  },
  {
    label: 'ETAPA 3 — TECIDOS',
    explanation: 'Nos tecidos, o oxigênio se desprende da hemoglobina e difunde-se para as células, que o utilizam na produção de energia.',
    button: 'Percurso concluído · repetir',
    progress: '100%'
  }
];

function showTransportStage(stage) {
  transportStage = stage;
  const info = transportStages[stage];
  labScene.dataset.stage = String(stage);
  sceneLabel.innerHTML = '<span class="scene-label-dot"></span> ' + info.label;
  sceneExplanation.textContent = info.explanation;
  sceneProgressFill.style.width = info.progress;
  transportNext.innerHTML = info.button + ' <span aria-hidden="true">→</span>';
  labSteps.forEach((step, index) => {
    step.classList.toggle('active', index === stage);
    if (index === stage) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
}

transportNext.addEventListener('click', () => {
  if (transportStage === transportStages.length - 1) showTransportStage(0);
  else showTransportStage(transportStage + 1);
});
transportReset.addEventListener('click', () => showTransportStage(0));
showTransportStage(0);

// Filtro dos cartões de formatos.
const filterButtons = [...document.querySelectorAll('.filter-button')];
const shapeCards = [...document.querySelectorAll('.shape-card')];

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    shapeCards.forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.kind !== filter;
    });
  });
});

// Detalhes acessíveis dos formatos.
const shapeInfo = {
  normal: {
    kicker: 'REFERÊNCIA',
    title: 'Hemácia normal',
    description: 'A hemácia humana madura costuma ter formato de disco bicôncavo: mais fina no centro e mais espessa nas bordas. É flexível e não possui núcleo.',
    meaning: 'É a aparência de referência. A avaliação real também considera o tamanho, a cor, a quantidade de células e outros resultados do hemograma.'
  },
  esferocito: {
    kicker: 'FORMATO ALTERADO',
    title: 'Esferócitos',
    description: 'São hemácias mais arredondadas e densas, que não apresentam a palidez central típica tão evidente. Podem ter menos flexibilidade.',
    meaning: 'Podem aparecer, por exemplo, na esferocitose hereditária ou em algumas anemias hemolíticas autoimunes. O achado precisa ser interpretado com outros dados.'
  },
  dacro: {
    kicker: 'FORMATO ALTERADO',
    title: 'Dacriócitos',
    description: 'Também chamados de células em lágrima, têm uma extremidade arredondada e outra mais pontuda. A forma pode surgir em diferentes condições que afetam a formação ou a passagem das hemácias.',
    meaning: 'Podem estar associados a alterações da medula óssea, mielofibrose, algumas anemias megaloblásticas e talassemia grave, entre outras causas. A forma isolada não fecha um diagnóstico.'
  },
  eliptocito: {
    kicker: 'FORMATO ALTERADO',
    title: 'Eliptócitos',
    description: 'Possuem formato ovalado ou alongado. O grau de alongamento e a quantidade dessas células podem variar.',
    meaning: 'Podem aparecer em condições hereditárias, deficiência de ferro e outras alterações do sangue. O formato, por si só, não informa se a pessoa tem anemia.'
  },
  esquizocito: {
    kicker: 'FORMATO ALTERADO',
    title: 'Esquizócitos',
    description: 'São fragmentos de hemácias, muitas vezes com contornos irregulares ou aspecto de capacete. Não são apenas hemácias inteiras com formato diferente.',
    meaning: 'Podem indicar fragmentação mecânica das células, inclusive em algumas doenças dos pequenos vasos. Quando encontrados em quantidade relevante, exigem avaliação clínica rápida.'
  },
  falciforme: {
    kicker: 'FORMATO ALTERADO',
    title: 'Hemácia falciforme',
    description: 'Pode assumir forma de foice, especialmente em condições com hemoglobina S. Essas células podem ficar mais rígidas e frágeis.',
    meaning: 'A doença falciforme é genética e pode causar anemia hemolítica, episódios de dor e outras complicações. O diagnóstico é feito por exames específicos, não apenas pela ilustração do formato.'
  }
};

const shapeDialog = document.querySelector('#shapeDialog');
const dialogClose = document.querySelector('#dialogClose');
const dialogArt = document.querySelector('#dialogArt');
const dialogKicker = document.querySelector('#dialogKicker');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogDescription = document.querySelector('#dialogDescription');
const dialogMeaning = document.querySelector('#dialogMeaning');
let lastShapeTrigger = null;

shapeCards.forEach((card) => {
  card.addEventListener('click', () => {
    const info = shapeInfo[card.dataset.shape];
    const originalArt = card.querySelector('.shape-cell').cloneNode(true);
    lastShapeTrigger = card;
    dialogArt.replaceChildren(originalArt);
    dialogKicker.textContent = info.kicker;
    dialogTitle.textContent = info.title;
    dialogDescription.textContent = info.description;
    dialogMeaning.textContent = info.meaning;
    shapeDialog.showModal();
  });
});

dialogClose.addEventListener('click', () => shapeDialog.close());
shapeDialog.addEventListener('click', (event) => {
  if (event.target === shapeDialog) shapeDialog.close();
});
shapeDialog.addEventListener('close', () => {
  if (lastShapeTrigger) lastShapeTrigger.focus();
});

// Quiz: seleciona resposta, mostra explicação e calcula a pontuação.
const quizQuestions = [
  {
    question: 'Qual é a principal função das hemácias?',
    answers: ['Produzir hormônios', 'Transportar oxigênio', 'Combater todas as bactérias'],
    correct: 1,
    explanation: 'Isso! A hemoglobina dentro das hemácias transporta a maior parte do oxigênio no sangue.'
  },
  {
    question: 'Qual proteína se liga reversivelmente ao oxigênio?',
    answers: ['Insulina', 'Colágeno', 'Hemoglobina'],
    correct: 2,
    explanation: 'Correto! A hemoglobina possui grupos heme com ferro, que permitem a ligação reversível ao O₂.'
  },
  {
    question: 'Onde as hemácias são produzidas?',
    answers: ['Na medula óssea', 'Nos alvéolos pulmonares', 'No estômago'],
    correct: 0,
    explanation: 'Isso mesmo. Em condições habituais, as hemácias são formadas na medula óssea.'
  },
  {
    question: 'O que é um dacriócito?',
    answers: ['Uma hemácia em formato de lágrima', 'Um tipo de glóbulo branco', 'Uma molécula de oxigênio'],
    correct: 0,
    explanation: 'Exato. Dacriócito é o nome dado a uma hemácia com uma ponta que lembra uma lágrima.'
  },
  {
    question: 'O que significa encontrar um formato alterado no exame?',
    answers: ['Sempre confirma uma doença específica', 'Precisa ser interpretado com os outros dados', 'Significa sempre falta de ferro'],
    correct: 1,
    explanation: 'Perfeito. O formato é uma pista, mas o diagnóstico depende do conjunto de exames e do contexto clínico.'
  }
];

let quizQuestion = document.querySelector('#quizQuestion');
let quizAnswers = document.querySelector('#quizAnswers');
let quizFeedback = document.querySelector('#quizFeedback');
let quizNext = document.querySelector('#quizNext');
let quizHint = document.querySelector('#quizHint');
const quizProgressText = document.querySelector('#quizProgressText');
const quizScoreLabel = document.querySelector('#quizScoreLabel');
const quizProgress = document.querySelector('#quizProgress');
const quizContent = document.querySelector('#quizContent');
let quizIndex = 0;
let quizScore = 0;
let answerLocked = false;

function renderQuizQuestion() {
  const question = quizQuestions[quizIndex];
  answerLocked = false;
  quizQuestion.textContent = question.question;
  quizAnswers.replaceChildren();
  quizFeedback.hidden = true;
  quizFeedback.textContent = '';
  quizNext.disabled = true;
  quizNext.innerHTML = quizIndex === quizQuestions.length - 1 ? 'Ver resultado <span aria-hidden="true">→</span>' : 'Próxima <span aria-hidden="true">→</span>';
  quizHint.textContent = 'Escolha uma resposta.';
  quizProgressText.textContent = `PERGUNTA ${String(quizIndex + 1).padStart(2, '0')} DE ${String(quizQuestions.length).padStart(2, '0')}`;
  quizScoreLabel.textContent = `${quizScore} ${quizScore === 1 ? 'ponto' : 'pontos'}`;
  quizProgress.style.width = `${((quizIndex + 1) / quizQuestions.length) * 100}%`;

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-answer';
    button.textContent = answer;
    button.addEventListener('click', () => selectQuizAnswer(answerIndex));
    quizAnswers.appendChild(button);
  });
}

function selectQuizAnswer(answerIndex) {
  if (answerLocked) return;
  answerLocked = true;
  const question = quizQuestions[quizIndex];
  const buttons = [...quizAnswers.querySelectorAll('.quiz-answer')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('correct');
    else if (index === answerIndex) button.classList.add('incorrect');
  });
  const isCorrect = answerIndex === question.correct;
  if (isCorrect) quizScore++;
  quizFeedback.textContent = (isCorrect ? 'Resposta correta! ' : 'Ainda não. ') + question.explanation;
  quizFeedback.hidden = false;
  quizHint.textContent = isCorrect ? 'Você acertou esta pergunta.' : 'Veja a alternativa destacada em verde.';
  quizScoreLabel.textContent = `${quizScore} ${quizScore === 1 ? 'ponto' : 'pontos'}`;
  quizNext.disabled = false;
}

function renderQuizResult() {
  const percentage = Math.round((quizScore / quizQuestions.length) * 100);
  const message = percentage === 100
    ? 'Excelente! Você acertou todas as perguntas.'
    : percentage >= 60
      ? 'Bom trabalho! Você entendeu boa parte dos conceitos.'
      : 'Vale revisar as seções e tentar novamente. Aprender também é corrigir as respostas.';
  quizProgress.style.width = '100%';
  quizProgressText.textContent = 'QUIZ CONCLUÍDO';
  quizScoreLabel.textContent = `${quizScore}/${quizQuestions.length} pontos`;
  quizContent.replaceChildren();

  const resultIcon = document.createElement('div');
  resultIcon.className = 'quiz-result-icon';
  resultIcon.textContent = percentage >= 60 ? '✓' : '↻';
  const heading = document.createElement('h3');
  heading.textContent = `Você acertou ${quizScore} de ${quizQuestions.length}!`;
  const paragraph = document.createElement('p');
  paragraph.className = 'quiz-result-message';
  paragraph.textContent = `${percentage}% de aproveitamento. ${message}`;
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'button button-primary quiz-retry';
  retry.innerHTML = 'Tentar novamente <span aria-hidden="true">↻</span>';
  retry.addEventListener('click', () => {
    quizIndex = 0;
    quizScore = 0;
    quizContent.innerHTML = '<h3 id="quizQuestion"></h3><div class="quiz-answers" id="quizAnswers"></div><div class="quiz-feedback" id="quizFeedback" hidden></div><div class="quiz-footer"><span id="quizHint">Escolha uma resposta.</span><button class="button button-primary" id="quizNext" disabled>Próxima <span aria-hidden="true">→</span></button></div>';
    quizQuestion = quizContent.querySelector('#quizQuestion');
    quizAnswers = quizContent.querySelector('#quizAnswers');
    quizFeedback = quizContent.querySelector('#quizFeedback');
    quizNext = quizContent.querySelector('#quizNext');
    quizHint = quizContent.querySelector('#quizHint');
    renderQuizQuestion();
  });
  quizContent.append(resultIcon, heading, paragraph, retry);
  document.querySelector('#quizQuestionCount').textContent = String(quizQuestions.length).padStart(2, '0');
}

quizContent.addEventListener('click', (event) => {
  if (!event.target.closest('#quizNext')) return;
  if (!answerLocked) return;
  if (quizIndex < quizQuestions.length - 1) {
    quizIndex++;
    renderQuizQuestion();
  } else {
    renderQuizResult();
  }
});

renderQuizQuestion();
