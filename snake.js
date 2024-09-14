const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width / box;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
let score = 0;
let level = 1;
let applesNeededForLevelUp = 5;
let applesCollected = 0;
let gameSpeed = 100;
let highScore = localStorage.getItem("highScore") || 0;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if (key === 38 && direction.y === 0) {
    direction = { x: 0, y: -1 };
  } else if (key === 39 && direction.x === 0) {
    direction = { x: 1, y: 0 };
  } else if (key === 40 && direction.y === 0) {
    direction = { x: 0, y: 1 };
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment) => {
    ctx.fillStyle = "lime";
    ctx.fillRect(segment.x * box, segment.y * box, box, box);
  });

  // Draw food (apple)
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);

  // Move snake
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check if snake ate food (apple)
  if (head.x === food.x && head.y === food.y) {
    score++;
    applesCollected++;
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };

    // Check for level up
    if (applesCollected >= applesNeededForLevelUp) {
      level++;
      applesCollected = 0;
      applesNeededForLevelUp = Math.floor(applesNeededForLevelUp * 1.5);
      speedUpGame();
    }
  } else {
    snake.pop();
  }

  // Check collision
  if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize || snakeCollision(head)) {
    endGame();
    return;
  }

  // Display score, level, and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Level: ${level}`, 10, 40);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function speedUpGame() {
  clearInterval(game);
  gameSpeed = Math.max(50, gameSpeed - 10);
  game = setInterval(drawGame, gameSpeed);
}

function snakeCollision(head) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function endGame() {
  clearInterval(game);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  updateLeaderboard();
  alert(`Game Over! Your score: ${score}. High Score: ${highScore}`);
}

function updateLeaderboard() {
  leaderboard.push({ score: score, date: new Date() });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = "";
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `Score: ${entry.score} (Date: ${entry.date.toLocaleDateString()})`;
    leaderboardList.appendChild(li);
  });
}

// Initialize game
const game = setInterval(drawGame, gameSpeed);

// Display leaderboard on page load
displayLeaderboard();
