function loadAchievements() {
  const saved = localStorage.getItem("rpsAchievements");
  if (saved) {
    achievements = JSON.parse(saved);
  }
}

function saveAchievements() {
  localStorage.setItem("rpsAchievements", JSON.stringify(achievements));
}

function saveStats() {
  localStorage.setItem(
    "rpsStats",
    JSON.stringify({
      totalGames,
      wins,
      losses,
      draws,
      moveStats,
      gamesPlayed,
      gamesWon,
      gamesLost,
      currentGameWinStreak,
      bestGameWinStreak,
      currentWinStreak,
      bestWinStreak,
      matchHistory,
    }),
  );
}

function loadStats() {
  const saved = localStorage.getItem("rpsStats");
  if (!saved) return;

  const stats = JSON.parse(saved);

  totalGames = stats.totalGames ?? 0;
  wins = stats.wins ?? 0;
  losses = stats.losses ?? 0;
  draws = stats.draws ?? 0;

  moveStats = stats.moveStats ?? {
    rock: 0,
    paper: 0,
    scissors: 0,
  };

  gamesPlayed = stats.gamesPlayed ?? 0;
  gamesWon = stats.gamesWon ?? 0;
  gamesLost = stats.gamesLost ?? 0;

  currentGameWinStreak = stats.currentGameWinStreak ?? 0;
  bestGameWinStreak = stats.bestGameWinStreak ?? 0;

  currentWinStreak = stats.currentWinStreak ?? 0;
  bestWinStreak = stats.bestWinStreak ?? 0;

  matchHistory = stats.matchHistory ?? [];
}

function exportStatistics() {
  const exportData = {
    exportedOn: new Date().toLocaleString(),

    roundStatistics: {
      totalGames,
      wins,
      losses,
      draws,
      winRate: totalGames
        ? `${Math.round((wins / totalGames) * 100)}%`
        : "0%",
    },

    moveStatistics: moveStats,

    matchStatistics: {
      gamesPlayed,
      gamesWon,
      gamesLost,
    },

    streaks: {
      currentGameWinStreak,
      bestGameWinStreak,
      currentWinStreak,
      bestWinStreak,
    },

    achievements,

    recentMatches: matchHistory,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `rps-stats-${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}