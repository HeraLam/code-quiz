var questEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initEl = document.querySelector("#initials");
var feedbkEl = document.querySelector("#feedback");
var correct = "./assets/sfx/correct.wav";
var incorrect = "./assets/sfx/incorrect.wav";
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
  var startEl = document.getElementById("start-screen");
  startEl.setAttribute("class", "hide");
  questEl.removeAttribute("class");
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  getQuestion();
}

function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach(function(choice, i) {
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);
    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = questionClick;
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 15;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    feedbkEl.textContent = "Wrong!";
    feedbkEl.style.color = "grey";
    feedbkEl.style.fontSize = "250%";
    (new Audio(incorrect)).play()
  } else {
    feedbkEl.textContent = "Correct!";
    feedbkEl.style.color = "grey";
    feedbkEl.style.fontSize = "250%";
    (new Audio(correct)).play()
  }
  feedbkEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbkEl.setAttribute("class", "feedback hide");
  }, 1000);
  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  clearInterval(timerId);
  var endScrEl = document.getElementById("end-screen");
  endScrEl.removeAttribute("class");
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  questEl.setAttribute("class", "hide");
}

function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  var initials = initEl.value.trim();
  if (initials !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];
    var newScore = {
      score: time,
      initials: initials
    };
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

startBtn.onclick = startQuiz;
submitBtn.onclick = saveHighscore;
initEl.onkeyup = checkForEnter;