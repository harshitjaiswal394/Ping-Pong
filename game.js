const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const PLAYER_X = PADDLE_MARGIN;
const AI_X = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH;

// Ball properties
const BALL_SIZE = 15;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 6;
let ballSpeedY = 4;

// Player paddle (follows mouse)
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// AI paddle
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const AI_SPEED = 5;

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse movement listener
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw middle line
    ctx.fillStyle = '#444';
    for (let i = 0; i < HEIGHT; i += 30) {
        ctx.fillRect(WIDTH / 2 - 2, i, 4, 15);
    }

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, WIDTH / 4, 50);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 50);
}

// Update game state
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        // Add some spin depending on where it hits
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    // AI paddle collision
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + BALL_SIZE > WIDTH) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement (basic tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= AI_SPEED;
    }
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

// Reset ball position after a score
function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    // Random direction
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
}

// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();