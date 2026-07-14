// DOM ELEMENTS
const buttons = document.querySelectorAll(".choice");

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");

const playerChoiceEl = document.getElementById("playerChoice");
const computerChoiceEl = document.getElementById("computerChoice");

const resultEl = document.getElementById("result");

const resetStatsBtn = document.getElementById("resetStatsBtn");
const exportStatsBtn = document.getElementById("exportStatsBtn");

const resetModal = document.getElementById("resetModal");
const cancelResetBtn = document.getElementById("cancelResetBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");
const resetBtn = document.getElementById("resetBtn");
const themeBtn = document.getElementById("themeBtn");

const playerCard = document.getElementById("playerCard");
const computerCard = document.getElementById("computerCard");

const highScoreEl = document.getElementById("highScore");

// Achievement Badges
const badgeFirstWin = document.getElementById("badge-first-win");
const badgeStreak3 = document.getElementById("badge-streak-3");
const badge10Wins = document.getElementById("badge-10-wins");
const badge25Games = document.getElementById("badge-25-games");
const badge75Rate = document.getElementById("badge-75-rate");

// Voice Elements
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");
const orbStatus = document.getElementById("orbStatus");
const voiceTranscript = document.getElementById("voiceTranscript");
const voicePanel = document.getElementById("voicePanel");
const voiceBubble = document.getElementById("voiceBubble");
const voiceWave = document.getElementById("voiceWave");
const assistantOrb = document.getElementById("assistantOrb");
const assistantMessageEl = document.getElementById("assistantMessage");

let microphoneStream;
let volumeAnimation;

const totalGamesEl = document.getElementById("totalGames");
const winsStatEl = document.getElementById("winsStat");
const lossesStatEl = document.getElementById("lossesStat");
const drawsStatEl = document.getElementById("drawsStat");
const winRateEl = document.getElementById("winRate");

// SOUNDS
const clickSound = new Audio("assets/click.mp3");
const winSound = new Audio("assets/win.mp3");
const loseSound = new Audio("assets/lose.mp3");
const drawSound = new Audio("assets/draw.mp3");

clickSound.volume = 0.4;
winSound.volume = 0.5;
loseSound.volume = 0.5;
drawSound.volume = 0.5;

// GAME DATA
const choices = ["rock", "paper", "scissors"];

const icons = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

let playerScore = 0;
let computerScore = 0;

let totalGames = 0;
let wins = 0;
let losses = 0;
let draws = 0;

let moveStats = {
  rock: 0,
  paper: 0,
  scissors: 0,
};

let gamesPlayed = 0;
let gamesWon = 0;
let gamesLost = 0;

let currentGameWinStreak = 0;
let bestGameWinStreak = 0;

let achievements = {
  firstWin: false,
  streak3: false,
  tenWins: false,
  games25: false,
  winRate75: false,
};

let matchHistory = [];

let currentWinStreak = 0;
let bestWinStreak = 0;

let gameOver = false;

let winStreak = 0;
let loseStreak = 0;
let drawStreak = 0;

let thinkingInterval = null;

let highScore = Number(localStorage.getItem("highScore")) || 0;
highScoreEl.textContent = highScore;

// Theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
}

// EVENT LISTENERS
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameOver) return;
    playRound(button.dataset.choice);
  });
});

resetStatsBtn.addEventListener("click", () => {
  resetModal.classList.add("show");
});

cancelResetBtn.addEventListener("click", () => {
  resetModal.classList.remove("show");
});

resetModal.addEventListener("click", (e) => {
  if (e.target === resetModal) {
    resetModal.classList.remove("show");
  }
});

resetBtn.addEventListener("click", resetGame);

themeBtn.addEventListener("click", toggleTheme);

document.addEventListener("keydown", (event) => {
  if (gameOver) return;

  if (event.key === "1") playRound("rock");
  if (event.key === "2") playRound("paper");
  if (event.key === "3") playRound("scissors");
});

voiceBtn.addEventListener("click", () => {
  startListening();
});

confirmResetBtn.addEventListener("click", resetAllStatistics);

exportStatsBtn.addEventListener("click", exportStatistics);

// INITIALIZE
loadStats();
loadAchievements();

updateScore();
updateStatistics();
updateMoveStats();
renderMatchHistory();
updatePerformanceInsights();
renderAchievements();

highScoreEl.textContent = highScore;