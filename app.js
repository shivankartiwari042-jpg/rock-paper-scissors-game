// ==========================================================
// ROCK PAPER SCISSORS
// Portfolio Edition
// Part 1
// ==========================================================

// ==========================
// DOM ELEMENTS
// ==========================

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


// ==========================
// SOUNDS
// ==========================

const clickSound = new Audio("assets/click.mp3");
const winSound = new Audio("assets/win.mp3");
const loseSound = new Audio("assets/lose.mp3");
const drawSound = new Audio("assets/draw.mp3");

clickSound.volume = 0.4;
winSound.volume = 0.5;
loseSound.volume = 0.5;
drawSound.volume = 0.5;


// ==========================
// GAME DATA
// ==========================

const choices = ["rock", "paper", "scissors"];

const icons = {

    rock: "✊",

    paper: "✋",

    scissors: "✌️"

};

let playerScore = 0;
let computerScore = 0;

let gameOver = false;

let thinkingInterval = null;


// ==========================
// LOCAL STORAGE
// ==========================

let highScore = Number(localStorage.getItem("highScore")) || 0;

highScoreEl.textContent = highScore;


// Theme

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="light"){

    document.body.classList.add("light");

}


// ==========================
// EVENT LISTENERS
// ==========================

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        if(gameOver) return;

        playRound(button.dataset.choice);

    });

});


// Reset

resetBtn.addEventListener("click",resetGame);


// Theme

themeBtn.addEventListener("click",toggleTheme);


// Keyboard

document.addEventListener("keydown",event=>{

    if(gameOver) return;

    if(event.key==="1"){

        playRound("rock");

    }

    if(event.key==="2"){

        playRound("paper");

    }

    if(event.key==="3"){

        playRound("scissors");

    }

});


// ==========================
// PLAY ROUND
// ==========================

function playRound(playerChoice){
    clickSound.currentTime = 0;

    clickSound.play().catch(() => {});

    disableButtons();

    removeWinnerGlow();

    playerChoiceEl.classList.remove("bounce");
    computerChoiceEl.classList.remove("bounce");

    startThinkingAnimation();

    setTimeout(()=>{

        stopThinkingAnimation();

        const computerChoice = getComputerChoice();

        playerChoiceEl.textContent = icons[playerChoice];
        computerChoiceEl.textContent = icons[computerChoice];

        playerChoiceEl.classList.add("bounce");
        computerChoiceEl.classList.add("bounce");

        const winner = getWinner(playerChoice,computerChoice);

        if(winner==="player"){

            playerScore++;

            animateScore(playerScoreEl);

            winSound.currentTime = 0;

            winSound.play().catch(() => {});

            resultFade("🎉 You Win This Round!");

        }

        else if(winner==="computer"){

            computerScore++;

            animateScore(computerScoreEl);

            loseSound.currentTime = 0;

            loseSound.play().catch(() => {});

            shakeScreen();

            resultFade("💻 Computer Wins This Round!");

        }

        else{

            drawSound.currentTime = 0;

            drawSound.play().catch(() => {});

            resultFade("🤝 It's a Draw!");

        }

        updateScore();

        checkGameWinner();

        if(!gameOver){

            enableButtons();

        }

    },1200);

}


// ==========================
// THINKING ANIMATION
// ==========================

function startThinkingAnimation(){

    const frames = [

        "🤔",

        "🤔.",

        "🤔..",

        "🤔..."

    ];

    let index = 0;

    computerChoiceEl.textContent = frames[0];

    resultEl.textContent = "Computer is thinking";

    thinkingInterval = setInterval(()=>{

        computerChoiceEl.textContent = frames[index];

        index++;

        if(index>=frames.length){

            index=0;

        }

    },250);

}


function stopThinkingAnimation(){

    clearInterval(thinkingInterval);

}
// ==========================================================
// PART 2
// Continue below Part 1
// ==========================================================


// ==========================
// COMPUTER CHOICE
// ==========================

function getComputerChoice(){

    const random=Math.floor(Math.random()*choices.length);

    return choices[random];

}


// ==========================
// WINNER LOGIC
// ==========================

function getWinner(player,computer){

    if(player===computer){

        return "draw";

    }

    if(

        (player==="rock" && computer==="scissors") ||

        (player==="paper" && computer==="rock") ||

        (player==="scissors" && computer==="paper")

    ){

        return "player";

    }

    return "computer";

}


// ==========================
// UPDATE SCORE
// ==========================

function updateScore(){

    playerScoreEl.textContent=playerScore;

    computerScoreEl.textContent=computerScore;

}


// ==========================
// SCORE ANIMATION
// ==========================

function animateScore(element){

    element.classList.add("animate");

    element.animate(

        [

            {transform:"scale(1)"},

            {transform:"scale(1.4)"},

            {transform:"scale(1)"}

        ],

        {

            duration:300

        }

    );

    setTimeout(()=>{

        element.classList.remove("animate");

    },300);

}


// ==========================
// GAME WINNER
// ==========================

function checkGameWinner(){

    if(playerScore>=5){

        gameOver=true;

        celebrate();

        playerCard.classList.add("winner");

        resultFade("🏆 Congratulations! You Won The Game!");

        if(playerScore>highScore){

            highScore=playerScore;

            localStorage.setItem("highScore",highScore);

            highScoreEl.textContent=highScore;

        }

    }

    else if(computerScore>=5){

        gameOver=true;

        computerCard.classList.add("winner");

        shakeScreen();

        resultFade("💀 Computer Won The Game!");

    }

}


// ==========================
// BUTTONS
// ==========================

function disableButtons(){

    buttons.forEach(button=>{

        button.disabled=true;

    });

}


function enableButtons(){

    buttons.forEach(button=>{

        button.disabled=false;

    });

}


// ==========================
// RESULT FADE
// ==========================

function resultFade(text){

    resultEl.style.opacity=0;

    setTimeout(()=>{

        resultEl.textContent=text;

        resultEl.style.opacity=1;

    },150);

}


// ==========================
// WINNER GLOW
// ==========================

function removeWinnerGlow(){

    playerCard.classList.remove("winner");

    computerCard.classList.remove("winner");

}


// ==========================
// SHAKE SCREEN
// ==========================

function shakeScreen(){

    const container=document.querySelector(".container");

    container.classList.add("shake");

    setTimeout(()=>{

        container.classList.remove("shake");

    },450);

}


// ==========================
// CONFETTI
// ==========================

function celebrate(){

    confetti({

        particleCount:220,

        spread:110,

        origin:{y:.65}

    });

}


// ==========================
// THEME
// ==========================

function toggleTheme(){

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

    }

    else{

        localStorage.setItem("theme","dark");

    }

}


// ==========================
// RESET
// ==========================

function resetGame(){

    playerScore=0;

    computerScore=0;

    gameOver=false;

    updateScore();

    enableButtons();

    removeWinnerGlow();

    stopThinkingAnimation();

    playerChoiceEl.textContent="?";

    computerChoiceEl.textContent="?";

    resultFade("Choose your weapon");

}


// ==========================
// INITIALIZE
// ==========================

updateScore();

highScoreEl.textContent=highScore;