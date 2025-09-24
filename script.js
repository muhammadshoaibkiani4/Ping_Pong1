// Get canvas elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fireworksCanvas = document.getElementById("fireworksCanvas");
const fCtx = fireworksCanvas.getContext("2d");
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Game settings
let paddleHeight = 100;
let paddleWidth = 15;
let ballSize = 12;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;
let gameOver = false;

// Controls
let keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Draw paddles
function drawPaddles() {
  ctx.fillStyle = "red"; // Player 1
  ctx.fillRect(10, player1Y, paddleWidth, paddleHeight);

  ctx.fillStyle = "blue"; // Player 2
  ctx.fillRect(canvas.width - 25, player2Y, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fill();
}

// Move paddles
function movePaddles() {
  if (keys["w"] && player1Y > 0) player1Y -= 6;
  if (keys["s"] && player1Y < canvas.height - paddleHeight) player1Y += 6;

  if (keys["ArrowUp"] && player2Y > 0) player2Y -= 6;
  if (keys["ArrowDown"] && player2Y < canvas.height - paddleHeight)
    player2Y += 6;
}

// Move ball
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom collision
  if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Paddle collision
  if (
    ballX - ballSize < 25 &&
    ballY > player1Y &&
    ballY < player1Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballSize > canvas.width - 25 &&
    ballY > player2Y &&
    ballY < player2Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX - ballSize < 0) {
    player2Score++;
    resetBall();
  }
  if (ballX + ballSize > canvas.width) {
    player1Score++;
    resetBall();
  }
}

// Reset ball
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

// Draw scoreboard
function updateScore() {
  document.getElementById(
    "score1"
  ).innerText = `Player 1 (🔴): ${player1Score}`;
  document.getElementById(
    "score2"
  ).innerText = `Player 2 (🔵): ${player2Score}`;

  if (player1Score >= 10 || player2Score >= 10) {
    gameOver = true;
    showWinner(player1Score >= 10 ? "Player 1 (🔴)" : "Player 2 (🔵)");
  }
}

// Show winner + fireworks
function showWinner(winner) {
  document.getElementById(
    "winnerMessage"
  ).innerText = `${winner} Wins! 🎉`;
  document.getElementById("winnerMessage").classList.remove("hidden");
  launchFireworks();
}

// Fireworks
let particles = [];
function launchFireworks() {
  setInterval(() => {
    let x = Math.random() * fireworksCanvas.width;
    let y = Math.random() * fireworksCanvas.height * 0.5;
    for (let i = 0; i < 50; i++) {
      particles.push({
        x,
        y,
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 6 - 3,
        life: 100,
        color: `hsl(${Math.random() * 360},100%,50%)`,
      });
    }
  }, 500);

  function animateFireworks() {
    fCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    particles.forEach((p, i) => {
      fCtx.fillStyle = p.color;
      fCtx.fillRect(p.x, p.y, 3, 3);
      p.x += p.speedX;
      p.y += p.speedY;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animateFireworks);
  }

  animateFireworks();
}

// Main loop
function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddles();
  drawBall();
  movePaddles();
  moveBall();
  updateScore();
  requestAnimationFrame(gameLoop);
}

gameLoop();
