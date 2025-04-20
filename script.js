const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load assets (placeholder images, replace with actual 8-bit sprites)
const playerImg = new Image();
playerImg.src = 'assets/player.png';
const asteroidImg = new Image();
asteroidImg.src = 'assets/asteroid.png';
const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';

// Game objects
let player = { x: 400, y: 500, width: 32, height: 32, speed: 5 };
let bullets = [];
let asteroids = [];
let score = 0;
let gameOver = false;

// Controls
let keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);
window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !gameOver) {
    bullets.push({ x: player.x + player.width / 2 - 4, y: player.y, width: 8, height: 8, speed: 10 });
  }
});

// Spawn asteroids
function spawnAsteroid() {
  asteroids.push({
    x: Math.random() * (canvas.width - 32),
    y: -32,
    width: 32,
    height: 32,
    speed: 3 + Math.random() * 2
  });
}

// Collision detection
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Game loop
function update() {
  if (gameOver) return;

  // Player movement
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

  // Update bullets
  bullets = bullets.filter(b => b.y > -b.height);
  bullets.forEach(b => b.y -= b.speed);

  // Update asteroids
  asteroids.forEach(a => a.y += a.speed);
  asteroids = asteroids.filter(a => a.y < canvas.height);

  // Spawn new asteroids
  if (Math.random() < 0.02) spawnAsteroid();

  // Check collisions
  asteroids.forEach((a, i) => {
    if (checkCollision(player, a)) {
      gameOver = true;
      localStorage.setItem('finalScore', score);
      window.location.href = 'gameover.html';
    }
    bullets.forEach((b, j) => {
      if (checkCollision(a, b)) {
        asteroids.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
      }
    });
  });

  // Render
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  bullets.forEach(b => ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height));
  asteroids.forEach(a => ctx.drawImage(asteroidImg, a.x, a.y, a.width, a.height));
  ctx.fillStyle = '#fff';
  ctx.font = '20px Courier New';
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(update);
}

// Start game
playerImg.onload = () => update();
