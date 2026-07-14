function unlockAchievement(key, badgeElement) {
  if (achievements[key]) return;

  achievements[key] = true;

  badgeElement.classList.remove("locked");
  badgeElement.classList.add("unlocked");
  badgeElement.classList.add("achievement-unlock");

  saveAchievements();

  setTimeout(() => {
    badgeElement.classList.remove("achievement-unlock");
  }, 800);
}

function renderAchievements() {
  const badges = [
    {
      unlocked: achievements.firstWin,
      element: badgeFirstWin,
    },
    {
      unlocked: achievements.streak3,
      element: badgeStreak3,
    },
    {
      unlocked: achievements.tenWins,
      element: badge10Wins,
    },
    {
      unlocked: achievements.games25,
      element: badge25Games,
    },
    {
      unlocked: achievements.winRate75,
      element: badge75Rate,
    },
  ];

  badges.forEach((badge) => {
    if (badge.unlocked) {
      badge.element.classList.remove("locked");
      badge.element.classList.add("unlocked");
    } else {
      badge.element.classList.remove("unlocked");
      badge.element.classList.add("locked");
    }
  });
}

function updateStatistics() {
  totalGamesEl.textContent = totalGames;
  winsStatEl.textContent = wins;
  lossesStatEl.textContent = losses;
  drawsStatEl.textContent = draws;

  const winRate = totalGames === 0 ? 0 : Math.round((wins / (totalGames-draws)) * 100);

  winRateEl.textContent = `${winRate}%`;
}

function updateMoveStats() {
  const totalMoves =
    moveStats.rock + moveStats.paper + moveStats.scissors;

  const rockPercent = totalMoves
    ? Math.round((moveStats.rock / totalMoves) * 100)
    : 0;

  const paperPercent = totalMoves
    ? Math.round((moveStats.paper / totalMoves) * 100)
    : 0;

  const scissorsPercent = totalMoves
    ? Math.round((moveStats.scissors / totalMoves) * 100)
    : 0;

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
    { name: "Scissors", icon: "✂️", count: moveStats.scissors },
  ];

  const mostUsed = moves.reduce((a, b) =>
    a.count >= b.count ? a : b
  );

  if (totalMoves === 0) {
    document.getElementById("mostUsedMoveName").textContent = "No Data";
    document.getElementById("mostUsedMoveIcon").textContent = "➖";
  } else {
    document.getElementById("mostUsedMoveName").textContent =
      mostUsed.name;
    document.getElementById("mostUsedMoveIcon").textContent =
      mostUsed.icon;
  }
}

function renderMatchHistory() {
  const historyList = document.getElementById("historyList");

  historyList.innerHTML = "";

  if (matchHistory.length === 0) {
    historyList.innerHTML = `
            <div class="history-empty">
                Play a game to see your recent matches.
            </div>
        `;
    return;
  }

  matchHistory.forEach((match) => {
    let resultText = "";
    let resultClass = "";

    if (match.result === "player") {
      resultText = "Win";
      resultClass = "win";
    } else if (match.result === "computer") {
      resultText = "Loss";
      resultClass = "loss";
    } else {
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

function updateMatchHistory(playerMove, computerMove, winner) {
  matchHistory.unshift({
    player: playerMove,
    computer: computerMove,
    result: winner,
  });

  if (matchHistory.length > 10) {
    matchHistory.pop();
  }

  renderMatchHistory();
}

function updatePerformanceInsights(winner) {
  if (winner === "computer") {
    currentWinStreak = 0;
  } 
  
  else if(winner === "player"){
    currentWinStreak++;

    if (currentWinStreak > bestWinStreak) {
      bestWinStreak = currentWinStreak;
    }
  }
  else{
    if (currentWinStreak > bestWinStreak) {
      bestWinStreak = currentWinStreak;
    }
  }

  const moves = [
    { name: "🪨 Rock", count: moveStats.rock },
    { name: "📄 Paper", count: moveStats.paper },
    { name: "✂️ Scissors", count: moveStats.scissors },
  ];

  const favorite = moves.reduce((a, b) =>
    a.count >= b.count ? a : b
  );

  document.getElementById("favoriteMove").textContent =
    favorite.count === 0 ? "-" : favorite.name;

  document.getElementById("currentStreak").textContent =
    currentWinStreak;

  document.getElementById("bestStreak").textContent =
    bestWinStreak;

  const winRate = totalGames ? (wins / totalGames) * 100 : 0;

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

  document.getElementById("performanceRating").textContent =
    rating;
}

function checkAchievements() {
  const gameWinRate =
    gamesPlayed ? (gamesWon / gamesPlayed) * 100 : 0;

  if (gamesWon >= 1) {
    unlockAchievement("firstWin", badgeFirstWin);
  }

  if (currentGameWinStreak >= 3) {
    unlockAchievement("streak3", badgeStreak3);
  }

  if (gamesWon >= 10) {
    unlockAchievement("tenWins", badge10Wins);
  }

  if (gamesPlayed >= 25) {
    unlockAchievement("games25", badge25Games);
  }

  if (gamesPlayed >= 20 && gameWinRate >= 75) {
    unlockAchievement("winRate75", badge75Rate);
  }
}

function resetAllStatistics() {
  totalGames = 0;
  wins = 0;
  losses = 0;
  draws = 0;

  moveStats = {
    rock: 0,
    paper: 0,
    scissors: 0,
  };

  gamesPlayed = 0;
  gamesWon = 0;
  gamesLost = 0;

  currentGameWinStreak = 0;
  bestGameWinStreak = 0;

  currentWinStreak = 0;
  bestWinStreak = 0;

  matchHistory = [];

  achievements = {
    firstWin: false,
    streak3: false,
    tenWins: false,
    games25: false,
    winRate75: false,
  };

  localStorage.removeItem("rpsStats");
  localStorage.removeItem("rpsAchievements");

  updateStatistics();
  updateMoveStats();
  renderMatchHistory();

  document.getElementById("favoriteMove").textContent = "-";
  document.getElementById("currentStreak").textContent = "0";
  document.getElementById("bestStreak").textContent = "0";
  document.getElementById("performanceRating").textContent = "Beginner";

  highScore = 0;
  highScoreEl.textContent = 0;
  localStorage.setItem("highScore", 0);

  renderAchievements();

  resetModal.classList.remove("show");
}