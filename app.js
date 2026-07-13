// DOM ELEMENTS
const buttons = document.querySelectorAll(".choice");

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");

const playerChoiceEl = document.getElementById("playerChoice");
const computerChoiceEl = document.getElementById("computerChoice");

const resultEl = document.getElementById("result");

const resetBtn = document.getElementById("resetBtn");
const themeBtn = document.getElementById("themeBtn");

const playerCard = document.getElementById("playerCard");
const computerCard = document.getElementById("computerCard");

const highScoreEl = document.getElementById("highScore");

// Voice Input Elements
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

function updateAssistantMessage(text) {
    assistantMessageEl.style.opacity = 0;
    setTimeout(() => {
        assistantMessageEl.textContent = text;
        assistantMessageEl.style.opacity = 1;
    }, 150);
}
function getAssistantMessage(winner) {
    const streakMessage = getStreakMessage(winner);
    if (streakMessage) {
        return streakMessage;
    }
    if (winner === "player") {
        return randomAssistantMessage("win");
    }
    if (winner === "computer") {
        return randomAssistantMessage("lose");
    }
    return randomAssistantMessage("tie");
}
const assistantMessages = {
  win: [
    "Nice move!",
    "You outplayed me.",
    "That was clever.",
    "Victory looks good on you.",
    "You're getting better!",
  ],
  lose: [
    "I win this round.",
    "Better luck next time.",
    "You'll get me eventually.",
    "That was unfortunate.",
    "I'm on fire!",
  ],
  tie: [
    "Great minds think alike.",
    "A tie again.",
    "Nobody wins this time.",
    "Perfect balance.",
    "Let's try another round.",
  ],
};
function randomAssistantMessage(result) {
  const messages = assistantMessages[result];
  return messages[Math.floor(Math.random() * messages.length)];
}
function getStreakMessage(winner) {
  if (winner === "player") {
    winStreak++;
    loseStreak = 0;
    drawStreak = 0;
    if (winStreak === 3) return "🔥 Three wins in a row!";
    if (winStreak === 5) return "👑 Unstoppable!";
  } else if (winner === "computer") {
    loseStreak++;
    winStreak = 0;
    drawStreak = 0;
    if (loseStreak === 3) return "😬 Time to change tactics.";
    if (loseStreak === 5) return "💀 The computer is dominating!";
  } else {
    drawStreak++;
    winStreak = 0;
    loseStreak = 0;
    if (drawStreak === 3) return "🤝 Three draws... perfectly balanced.";
  }
  return null;
}
function setOrbState(state, text = "") {
  assistantOrb.className = `assistant-orb ${state}`;
  if (text) {
    orbStatus.textContent = text;
  }
}
function showVoicePanel() {
  voicePanel.classList.remove("hidden");
}
function hideVoicePanel() {
  voicePanel.classList.add("hidden");
}
function setVoiceBubble(message) {
  voiceBubble.textContent = message;
}
function startWave() {
  voiceWave.style.opacity = "1";
}
function stopWave() {
  voiceWave.style.opacity = "0";
}
function showSuccessState() {
  voicePanel.classList.remove("error");
  voicePanel.classList.add("success");
}
function showErrorState() {
  voicePanel.classList.remove("success");
  voicePanel.classList.add("error");
}
function clearVoiceState() {
  voicePanel.classList.remove("success", "error");
}
function updateTranscript(text) {
  voiceTranscript.innerHTML = `
        <span class="transcript-label">You said</span>
        <span class="transcript-text">"${text}"</span>
    `;
}

// Speech Recognition Support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
} else {
  voiceBtn.disabled = true;
  voiceStatus.textContent =
    "Voice recognition is not supported on this browser.";
}

// Start Voice Recognition
function startListening() {
  if (!recognition || isListening) return;

  // Play click sound
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  if ("vibrate" in navigator) {
    navigator.vibrate(40);
  }

  isListening = true;

  voiceTranscript.textContent = "";

  recognition.start();

  // Stop automatically after 3 seconds
  setTimeout(() => {
    if (isListening) {
      recognition.stop();
    }
  }, 3000);
}
// Click microphone button
voiceBtn.addEventListener("click", () => {
  startListening();
});

recognition.onstart = () => {
  startWave();
  showVoicePanel();
  setVoiceBubble("🎤 Listening...");
  voiceStatus.textContent = "Listening...";
  voiceStatus.className = "voice-status listening";
  voiceBtn.classList.add("listening");
  setOrbState("listening", "Listening...");
};

// Voice Recognition Results
let detectedChoice = "";

recognition.onresult = (event) => {
  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }

  transcript = transcript.trim().toLowerCase();

  // Live transcript
  updateTranscript(transcript);
  setVoiceBubble(`You said: "${transcript}"`);

  // Detect valid choice
  if (transcript.includes("rock") || transcript.includes("lock")) {
    detectedChoice = "rock";
  } else if (transcript.includes("paper") || transcript.includes("pepper")) {
    detectedChoice = "paper";
  } else if (
    transcript.includes("scissors") ||
    transcript.includes("scissor") ||
    transcript.includes("caesar") ||
    transcript.includes("sizors") ||
    transcript.includes("scisors") ||
    transcript.includes("sizzer") ||
    transcript.includes("scissor's")
  ) {
    detectedChoice = "scissors";
  }
  setOrbState("processing", "Processing...");
};

// Recognition Finished
recognition.onend = () => {
  cancelAnimationFrame(volumeAnimation);
  if (microphoneStream) {
    microphoneStream.getTracks().forEach((track) => track.stop());
  }
  isListening = false;
  voiceBtn.classList.remove("listening");
  stopWave();
  if (detectedChoice) {
    const choice = detectedChoice;
    voiceStatus.textContent = "Processing...";
    voiceStatus.className = "voice-status processing";
    setVoiceBubble("⚙ Processing your voice...");
    detectedChoice = "";
    setTimeout(() => {
      voiceStatus.textContent = `Detected: ${choice}`;
      voiceStatus.className = "voice-status success";
      setVoiceBubble(`✅ ${choice} detected`);
      showSuccessState();
      if (!gameOver) {
        playRound(choice);
      }
    }, 500);
  } else {
    voiceStatus.textContent = "Try Again";
    voiceStatus.className = "voice-status error";
    setVoiceBubble("❌ I didn't understand. Try again.");
    showErrorState();
  }
  setTimeout(() => {
    clearVoiceState();
    setTimeout(hideVoicePanel, 2000);
    voiceStatus.textContent =
      "Tap the microphone and say Rock, Paper or Scissors";
    voiceStatus.className = "voice-status";
    voiceTranscript.innerHTML = "";
    setVoiceBubble("Tap the microphone to speak.");
    setOrbState("idle", "Tap the microphone");
  }, 2000);
};

// Recognition Error
recognition.onerror = () => {
  isListening = false;

  voiceBtn.classList.remove("listening");
  stopWave();

  voiceStatus.textContent = "Try Again";
  voiceStatus.className = "voice-status error";
  setVoiceBubble("❌ Voice recognition failed.");
  showErrorState();

  setTimeout(() => {
    clearVoiceState();
    setTimeout(hideVoicePanel, 2000);
  }, 2000);

  detectedChoice = "";
};

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
// Move Statistics
let moveStats = {
    rock: 0,
    paper: 0,
    scissors: 0
};
// Recent Match History
let matchHistory = [];
// Performance Insights
let currentWinStreak = 0;
let bestWinStreak = 0;

let gameOver = false;
let winStreak = 0;
let loseStreak = 0;
let drawStreak = 0;
let thinkingInterval = null;

// LOCAL STORAGE

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

// Reset
resetBtn.addEventListener("click", resetGame);

// Theme
themeBtn.addEventListener("click", toggleTheme);

// Keyboard
document.addEventListener("keydown", (event) => {
  if (gameOver) return;
  if (event.key === "1") {
    playRound("rock");
  }
  if (event.key === "2") {
    playRound("paper");
  }
  if (event.key === "3") {
    playRound("scissors");
  }
});

// PLAY ROUND
function playRound(playerChoice) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
    disableButtons();
    removeWinnerGlow();
    playerChoiceEl.classList.remove("bounce");
    computerChoiceEl.classList.remove("bounce");
    startThinkingAnimation();
    setTimeout(() => {
    stopThinkingAnimation();
    const computerChoice = getComputerChoice();
    moveStats[playerChoice]++;
    playerChoiceEl.textContent = icons[playerChoice];
    computerChoiceEl.textContent = icons[computerChoice];
    playerChoiceEl.classList.add("bounce");
    computerChoiceEl.classList.add("bounce");
    const winner = getWinner(playerChoice, computerChoice);
    const message = getAssistantMessage(winner);
    if (winner === "player") {
      playerScore++;
      wins++;
      totalGames++;
      animateScore(playerScoreEl);
      winSound.currentTime = 0;
      winSound.play().catch(() => {});
      resultFade("🎉 You Win This Round!");
      updateAssistantMessage(message);
    } else if (winner === "computer") {
      computerScore++;
      losses++;
      totalGames++;
      animateScore(computerScoreEl);
      loseSound.currentTime = 0;
      loseSound.play().catch(() => {});
      shakeScreen();
      resultFade("💻 Computer Wins This Round!");
      updateAssistantMessage(message);
    } else {
      draws++;
      totalGames++;
      drawSound.currentTime = 0;
      drawSound.play().catch(() => {});
      resultFade("🤝 It's a Draw!");
      updateAssistantMessage(message);
    }
    updateScore();
    updateStatistics();
    updateMoveStats();
    updateMatchHistory(playerChoice, computerChoice, winner);
    updatePerformanceInsights(winner);
    checkGameWinner();
    if (!gameOver) {
      enableButtons();
    }
  }, 1200);
}

// THINKING ANIMATION
function startThinkingAnimation() {
  const frames = ["🤔", "🤔.", "🤔..", "🤔..."];
  let index = 0;
  computerChoiceEl.textContent = frames[0];
  resultEl.textContent = "Computer is thinking";
  thinkingInterval = setInterval(() => {
    computerChoiceEl.textContent = frames[index];
    index++;
    if (index >= frames.length) {
      index = 0;
    }
  }, 250);
}

function stopThinkingAnimation() {
  clearInterval(thinkingInterval);
}

// COMPUTER CHOICE
function getComputerChoice() {
  const random = Math.floor(Math.random() * choices.length);
  return choices[random];
}

// WINNER LOGIC
function getWinner(player, computer) {
  if (player === computer) {
    return "draw";
  }
  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "player";
  }
  return "computer";
}

// UPDATE SCORE
function updateScore() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}
//UPDATE STATISTICS
function updateStatistics(){
    totalGamesEl.textContent = totalGames;
    winsStatEl.textContent = wins;
    lossesStatEl.textContent = losses;
    drawsStatEl.textContent = draws;
    const winRate =
        totalGames === 0
        ? 0
        : Math.round((wins / totalGames) * 100)
    winRateEl.textContent = `${winRate}%`;
}
function updateMoveStats() {
    const totalMoves =moveStats.rock + moveStats.paper + moveStats.scissors;
    const rockPercent = totalMoves ? Math.round((moveStats.rock / totalMoves) * 100) : 0;
    const paperPercent = totalMoves ? Math.round((moveStats.paper / totalMoves) * 100) : 0;
    const scissorsPercent = totalMoves ? Math.round((moveStats.scissors / totalMoves) * 100) : 0;
    document.getElementById("rockUsage").textContent =
        `${moveStats.rock} (${rockPercent}%)`;
    document.getElementById("paperUsage").textContent =
        `${moveStats.paper} (${paperPercent}%)`;
    document.getElementById("scissorsUsage").textContent =
        `${moveStats.scissors} (${scissorsPercent}%)`;
    document.getElementById("rockBar").style.width = `${rockPercent}%`;
    document.getElementById("paperBar").style.width = `${paperPercent}%`;
    document.getElementById("scissorsBar").style.width = `${scissorsPercent}%`;
    const moves = [
        { name: "Rock", icon: "🪨", count: moveStats.rock },
        { name: "Paper", icon: "📄", count: moveStats.paper },
        { name: "Scissors", icon: "✂️", count: moveStats.scissors }
    ];
    const mostUsed = moves.reduce((a, b) => a.count >= b.count ? a : b);
    if (totalMoves === 0) {
        document.getElementById("mostUsedMoveName").textContent = "No Data";
        document.getElementById("mostUsedMoveIcon").textContent = "➖";
    } else {
        document.getElementById("mostUsedMoveName").textContent = mostUsed.name;
        document.getElementById("mostUsedMoveIcon").textContent = mostUsed.icon;
    }
}

function updateMatchHistory(playerMove, computerMove, winner) {
    const historyList = document.getElementById("historyList");
    matchHistory.unshift({
        player: playerMove,
        computer: computerMove,
        result: winner
    });
    if (matchHistory.length > 10) {
        matchHistory.pop();
    }
    historyList.innerHTML = "";
    matchHistory.forEach(match => {
        let resultText = "";
        let resultClass = "";
        if (match.result === "player") {
            resultText = "Win";
            resultClass = "win";
        }
        else if (match.result === "computer") {
            resultText = "Loss";
            resultClass = "loss";
        }
        else {
            resultText = "Draw";
            resultClass = "draw";
        }
        historyList.innerHTML += `
            <div class="history-item">
                <div class="history-left">
                    <span>${icons[match.player]}</span>
                    <span class="history-vs">vs</span>
                    <span>${icons[match.computer]}</span>
                </div>
                <div class="history-result ${resultClass}">
                    ${resultText}
                </div>
            </div>
        `;
    });
}

function updatePerformanceInsights(winner) {
    // Update streaks
    if (winner === "player") {
        currentWinStreak++;
        if (currentWinStreak > bestWinStreak) {
            bestWinStreak = currentWinStreak;
        }
    } else {
        currentWinStreak = 0;
    }
    // Favorite Move
    const moves = [
        { name: "🪨 Rock", count: moveStats.rock },
        { name: "📄 Paper", count: moveStats.paper },
        { name: "✂️ Scissors", count: moveStats.scissors }
    ];
    const favorite = moves.reduce((a, b) => a.count >= b.count ? a : b);
    document.getElementById("favoriteMove").textContent =
        (favorite.count === 0) ? "-" : favorite.name;
    document.getElementById("currentStreak").textContent = currentWinStreak;
    document.getElementById("bestStreak").textContent = bestWinStreak;
    // Performance Rating
    const winRate = totalGames
        ? (wins / totalGames) * 100
        : 0;
    let rating = "Beginner";
    if (winRate >= 90) {
        rating = "Master";
    } else if (winRate >= 75) {
        rating = "Expert";
    } else if (winRate >= 60) {
        rating = "Skilled";
    } else if (winRate >= 45) {
        rating = "Improving";
    }
    document.getElementById("performanceRating").textContent = rating;
}

// SCORE ANIMATION
function animateScore(element) {
  element.classList.add("animate");
  element.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.4)" },
      { transform: "scale(1)" },
    ],
    {
      duration: 300,
    },
  );
  setTimeout(() => {
    element.classList.remove("animate");
  }, 300);
}

// GAME WINNER
function checkGameWinner() {
  if (playerScore >= 5) {
    gameOver = true;
    celebrate();
    playerCard.classList.add("winner");
    resultFade("🏆 Congratulations! You Won The Game!");
    if (playerScore > highScore) {
      highScore = playerScore;
      localStorage.setItem("highScore", highScore);
      highScoreEl.textContent = highScore;
    }
  } else if (computerScore >= 5) {
    gameOver = true;
    computerCard.classList.add("winner");
    shakeScreen();
    resultFade("💀 Computer Won The Game!");
  }
}

// BUTTONS
function disableButtons() {
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function enableButtons() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

// RESULT FADE
function resultFade(text) {
  resultEl.style.opacity = 0;
  setTimeout(() => {
    resultEl.textContent = text;
    resultEl.style.opacity = 1;
  }, 150);
}

// WINNER GLOW
function removeWinnerGlow() {
  playerCard.classList.remove("winner");
  computerCard.classList.remove("winner");
}

// SHAKE SCREEN
function shakeScreen() {
  const container = document.querySelector(".container");
  container.classList.add("shake");
  setTimeout(() => {
    container.classList.remove("shake");
  }, 450);
}

// CONFETTI
function celebrate() {
  confetti({
    particleCount: 220,
    spread: 110,
    origin: { y: 0.65 },
  });
}

// THEME
function toggleTheme() {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

// RESET
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  totalGames = 0;
  wins = 0;
  losses = 0;
  draws = 0;
  gameOver = false;
  updateScore();
  updateStatistics();
  enableButtons();
  removeWinnerGlow();
  stopThinkingAnimation();
  playerChoiceEl.textContent = "?";
  computerChoiceEl.textContent = "?";
  resultFade("Choose your weapon");
  winStreak = 0;
  loseStreak = 0;
  drawStreak = 0;

  updateAssistantMessage("Ready for another battle.");
}

// INITIALIZE
updateScore();
updateStatistics();
highScoreEl.textContent = highScore;