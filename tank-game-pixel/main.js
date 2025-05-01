// Pixel Tank Game - Subway Surfers style gameplay ending at 999 points for 30/4 Vietnam commemoration

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const lanes = [120, 240, 360]; // x positions for 3 lanes
const laneCount = lanes.length;
const tankWidth = 40;
const tankHeight = 40;
const obstacleWidth = 40;
const obstacleHeight = 40;
const speedInitial = 4;
const speedIncreaseInterval = 100; // increase speed every 100 points
const speedIncreaseAmount = 0.5;

let tankLane = 1; // start in middle lane
let tankY = canvas.height - tankHeight - 20;

let obstacles = [];
let obstacleSpawnInterval = 1500; // milliseconds
let lastObstacleSpawn = 0;

let score = 0;
let speed = speedInitial;
let gameOver = false;

const keys = {
  left: false,
  right: false,
};

const tankColor = '#4ade80'; // green tank color
const obstacleColor = '#ef4444'; // red obstacles

// Load pixel font for text rendering
ctx.font = '20px "Press Start 2P"';

// Event listeners for lane switching
window.addEventListener('keydown', (e) => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    if (tankLane > 0) {
      tankLane--;
    }
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    if (tankLane < laneCount - 1) {
      tankLane++;
    }
  }
});

function drawTank() {
  ctx.fillStyle = tankColor;
  // Draw simple pixel tank shape
  const x = lanes[tankLane] - tankWidth / 2;
  const y = tankY;
  ctx.fillRect(x, y + 10, tankWidth, 20); // body
  ctx.fillRect(x + 10, y, 20, 10); // turret
  ctx.fillRect(x + 5, y + 30, 30, 10); // tracks
}

function drawObstacle(obstacle) {
  ctx.fillStyle = obstacleColor;
  ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * laneCount);
  const x = lanes[lane] - obstacleWidth / 2;
  const y = -obstacleHeight;
  obstacles.push({ x, y, lane });
}

function updateObstacles(deltaTime) {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].y += speed;
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
      updateScore();
      if (score % speedIncreaseInterval === 0) {
        speed += speedIncreaseAmount;
      }
      if (score >= 999) {
        endGame();
      }
    }
  }
}

function checkCollision() {
  const tankX = lanes[tankLane] - tankWidth / 2;
  const tankYTop = tankY;
  const tankYBottom = tankY + tankHeight;

  for (const obstacle of obstacles) {
    const obsX = obstacle.x;
    const obsY = obstacle.y;
    if (
      tankLane === obstacle.lane &&
      obsY + obstacleHeight > tankYTop + 10 &&
      obsY < tankYBottom - 10
    ) {
      return true;
    }
  }
  return false;
}

function updateScore() {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.textContent = `Score: ${score}`;
}

function endGame() {
  gameOver = true;
  const endScreen = document.getElementById('endScreen');
  endScreen.classList.remove('hidden');
}

function restartGame() {
  obstacles = [];
  score = 0;
  speed = speedInitial;
  tankLane = 1;
  gameOver = false;
  updateScore();
  const endScreen = document.getElementById('endScreen');
  endScreen.classList.add('hidden');
  lastTime = 0;
  requestAnimationFrame(gameLoop);
}

document.getElementById('restartBtn').addEventListener('click', restartGame);

let lastTime = 0;
function gameLoop(timestamp = 0) {
  if (gameOver) return;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw lanes
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  for (let i = 1; i < laneCount; i++) {
    const x = (lanes[i - 1] + lanes[i]) / 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  drawTank();

  if (timestamp - lastObstacleSpawn > obstacleSpawnInterval) {
    spawnObstacle();
    lastObstacleSpawn = timestamp;
  }

  updateObstacles(deltaTime);

  for (const obstacle of obstacles) {
    drawObstacle(obstacle);
  }

  if (checkCollision()) {
    endGame();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

updateScore();
requestAnimationFrame(gameLoop);
