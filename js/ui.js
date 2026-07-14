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

function resultFade(text) {
  resultEl.style.opacity = 0;

  setTimeout(() => {
    resultEl.textContent = text;
    resultEl.style.opacity = 1;
  }, 150);
}

function removeWinnerGlow() {
  playerCard.classList.remove("winner");
  computerCard.classList.remove("winner");
}

function shakeScreen() {
  const container = document.querySelector(".container");

  container.classList.add("shake");

  setTimeout(() => {
    container.classList.remove("shake");
  }, 450);
}

function celebrate() {
  confetti({
    particleCount: 220,
    spread: 110,
    origin: {
      y: 0.65,
    },
  });
}

function toggleTheme() {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}