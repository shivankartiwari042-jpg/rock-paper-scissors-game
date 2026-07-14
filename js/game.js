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

    saveStats();

    checkGameWinner();

    if (!gameOver) {
      enableButtons();
    }
  }, 1200);
}

function getComputerChoice() {
  const random = Math.floor(Math.random() * choices.length);
  return choices[random];
}

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

function updateScore() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function checkGameWinner() {
  if (playerScore >= 5) {
    gameOver = true;

    celebrate();

    playerCard.classList.add("winner");

    resultFade("🏆 Congratulations! You Won The Game!");

    gamesPlayed++;
    gamesWon++;

    currentGameWinStreak++;

    bestGameWinStreak = Math.max(
      bestGameWinStreak,
      currentGameWinStreak
    );

    checkAchievements();

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

    gamesPlayed++;
    gamesLost++;

    currentGameWinStreak = 0;

    checkAchievements();
  }
}

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