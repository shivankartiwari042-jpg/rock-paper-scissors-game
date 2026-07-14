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

    if (drawStreak === 3) {
      return "🤝 Three draws... perfectly balanced.";
    }
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

function startListening() {
  if (!recognition || isListening) return;

  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});

  if ("vibrate" in navigator) {
    navigator.vibrate(40);
  }

  isListening = true;
  voiceTranscript.textContent = "";

  recognition.start();

  setTimeout(() => {
    if (isListening) {
      recognition.stop();
    }
  }, 3000);
}

let detectedChoice = "";

recognition.onstart = () => {
  startWave();
  showVoicePanel();

  setVoiceBubble("🎤 Listening...");

  voiceStatus.textContent = "Listening...";
  voiceStatus.className = "voice-status listening";

  voiceBtn.classList.add("listening");

  setOrbState("listening", "Listening...");
};

recognition.onresult = (event) => {
  let transcript = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }

  transcript = transcript.trim().toLowerCase();

  updateTranscript(transcript);
  setVoiceBubble(`You said: "${transcript}"`);

  if (transcript.includes("rock") || transcript.includes("lock")) {
    detectedChoice = "rock";
  } else if (
    transcript.includes("paper") ||
    transcript.includes("pepper")
  ) {
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