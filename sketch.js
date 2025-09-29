let playerX, playerY;
let playerSize = 40;
let playerSpeed = 6;
let lives = 5;
let enemies = [];
let enemyBullets = [];
let gameState = "playing";
let lastEnemyAddTime = 0;
let startTime = 0;
let elapsedTime = 0;

function setup() {
  createCanvas(800, 600);
  playerX = width / 2;
  playerY = height - 50;

  // Start with 5 enemies
  for (let i = 0; i < 5; i++) {
    addEnemy();
  }
  lastEnemyAddTime = millis();
  startTime = millis();
}

function draw() {
  background(20, 20, 40);

  if (gameState === "playing") {
    playGame();
  } else {
    drawGameOver();
  }
}

function playGame() {
  // Update elapsed time only while playing
  elapsedTime = Math.floor((millis() - startTime) / 1000);

  // Player movement
  if (keyIsDown(LEFT_ARROW) && playerX > 0) playerX -= playerSpeed;
  if (keyIsDown(RIGHT_ARROW) && playerX < width - playerSize) playerX += playerSpeed;

  // Draw player
  fill(100, 200, 255);
  rect(playerX, playerY, playerSize, playerSize);

  // Enemy behavior
  for (let e of enemies) {
    e.x += e.speed;
    if (e.x < e.size / 2 || e.x > width - e.size / 2) e.speed *= -1; // bounce horizontally

    // Draw enemy
    fill(255, 100, 100);
    ellipse(e.x, e.y, e.size);

    // Shooting bullets with individual delay
    if (millis() - e.lastShot > e.shootDelay) {
      enemyBullets.push({ x: e.x, y: e.y, size: 10, speed: 5 });
      e.lastShot = millis();
      e.shootDelay = random(500, 1500); // random delay
    }
  }

  // Enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let b = enemyBullets[i];
    b.y += b.speed;
    fill(255, 255, 0);
    ellipse(b.x, b.y, b.size);

    // Remove if off screen
    if (b.y > height) {
      enemyBullets.splice(i, 1);
      continue;
    }

    // Collision with player
    if (b.x > playerX && b.x < playerX + playerSize &&
        b.y > playerY && b.y < playerY + playerSize) {
      lives--;
      enemyBullets.splice(i, 1);
      if (lives <= 0) gameState = "gameOver";
    }
  }

  // Add new enemy every 10 seconds
  if (millis() - lastEnemyAddTime > 10000) {
    addEnemy();
    lastEnemyAddTime = millis();
  }

  // Draw UI
  fill(255);
  textSize(20);
  text("Lives: " + lives, 20, 30);
  text("Enemies: " + enemies.length, 20, 60);
  text("Time: " + elapsedTime + "s", 20, 90);
}

function addEnemy() {
  enemies.push({
    x: random(100, width - 100),
    y: 60,
    size: 40,
    speed: random([-2, 2]),
    lastShot: millis(),
    shootDelay: random(500, 1500) // first shot delay
  });
}

function drawGameOver() {
  background(80, 0, 0);
  fill(255);
  textAlign(CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(24);
  text("You survived " + elapsedTime + " seconds!", width / 2, height / 2 + 20);
  textSize(18);
  text("Press R to restart", width / 2, height / 2 + 60);
}

function keyPressed() {
  if (gameState === "gameOver" && key === 'r') resetGame();
}

function resetGame() {
  gameState = "playing";
  lives = 5;
  playerX = width / 2;
  enemies = [];
  enemyBullets = [];
  for (let i = 0; i < 5; i++) addEnemy(); // start with 5 enemies
  lastEnemyAddTime = millis();
  startTime = millis();
  elapsedTime = 0;
}