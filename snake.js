const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width / box;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
let score = 0;
let level = 1; // Start at level 1
let applesNeededForLevelUp = 5; // Number of apples needed to level up
let applesCollected = 0; // Track apples collected
let gameSpeed = 100; // Initial game speed
let highScore = localStorage.getItem("highScore") || 0; // Retrieve the high score from local storage

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

  // Draw obstacles
  drawObstacles();

  // Move snake
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check if snake ate food (apple)
  if (head.x === food.x && head.y === food.y) {
    score++;
    applesCollected++; // Track collected apples
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
    
    // Check for level up
    if (applesCollected >= applesNeededForLevelUp) {
      level++;
      applesCollected = 0; // Reset apple count for the next level
      applesNeededForLevelUp = Math.floor(applesNeededForLevelUp * 1.5); // Increase difficulty
      speedUpGame(); // Call a function to speed up the game
    }
  } else {
    snake.pop();
  }

  // Check collision
  if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize || snakeCollision(head) || checkObstacleCollision(head)) {
    clearInterval(game);
    
    // Check if the current score is higher than the high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // Save the new high score to local storage
    }

    alert(`Game Over! Your score: ${score}. High Score: ${highScore}`);
  }

  // Display score, level, and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Level: ${level}`, 10, 40);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function speedUpGame() {
  clearInterval(game); // Stop the current game loop
  gameSpeed = Math.max(50, gameSpeed - 10); // Increase speed but don't go below 50ms
  game = setInterval(drawGame, gameSpeed); // Restart the game loop with the new speed
}

function snakeCollision(head) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function checkObstacleCollision(head) {
  return obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y);
}

function drawObstacles() {
  ctx.fillStyle = "grey";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x * box, obstacle.y * box, box, box);
  });
}

const obstacleCount = 5; // Number of obstacles
let obstacles = generateObstacles(obstacleCount);

function generateObstacles(count) {
  let obs = [];
  for (let i = 0; i < count; i++) {
    obs.push({ 
      x: Math.floor(Math.random() * canvasSize), 
      y: Math.floor(Math.random() * canvasSize) 
    });
  }
  return obs;
}

const game = setInterval(drawGame, gameSpeed);
