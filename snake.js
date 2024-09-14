const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width / box;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
let score = 0;
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

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * box, food.y * box, box, box);

  // Move snake
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
  } else {
    snake.pop();
  }

  // Check collision
  if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize || snakeCollision(head)) {
    clearInterval(game);
    
    // Check if the current score is higher than the high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore); // Save the new high score to local storage
    }

    alert(`Game Over! Your score: ${score}. High Score: ${highScore}`);
  }

  // Display score and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);
}

function snakeCollision(head) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

const game = setInterval(drawGame, 100);
