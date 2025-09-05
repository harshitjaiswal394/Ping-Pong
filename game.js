const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const quitBtn = document.getElementById('quitBtn');
const timerEl = document.getElementById('timer');

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
let ballX, ballY, ballSpeedX, ballSpeedY;

// Player paddle
let playerY;

// AI paddle
let aiY;
const AI_SPEED = 5;

// Scores
let playerScore;
let aiScore;

// Game loop control
let running = false;
let animationId;

// Timer
let startTime;
let timerInterval;

function initGame() {
    playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    playerScore = 0;
    aiScore = 0;
    resetBall();
}

// Reset ball position
function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
}

// Mouse movement listener
canvas.addEventListener('mousemove', function(e) {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Middle line
    ctx.fillStyle = '#444';
    for (let i = 0; i < HEIGHT; i += 30) {
        ctx.fillRect(WIDTH / 2 - 2, i, 4, 15);
    }

    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Scores
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, WIDTH / 4, 50);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 50);
}

// Update game state
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + BALL_SIZE >= HEIGHT) {
        ballSpeedY = -ballSpeedY;
    }

    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 0.15;
    }

    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + BALL_SIZE > WIDTH) {
        playerScore++;
        resetBall();
    }

    // AI movement
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) aiY += AI_SPEED;
    else if (aiCenter > ballY + BALL_SIZE / 2 + 10) aiY -= AI_SPEED;
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

// Game loop
function loop() {
    if (!running) return;
    update();
    draw();
    animationId = requestAnimationFrame(loop);
}

// Start game
startBtn.addEventListener('click', () => {
    if (running) return;
    initGame();
    running = true;
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let seconds = Math.floor((Date.now() - startTime) / 1000);
        timerEl.textContent = `Time: ${seconds}s`;
    }, 1000);
    loop();
});

// Quit game
quitBtn.addEventListener('click', () => {
    running = false;
    cancelAnimationFrame(animationId);
    clearInterval(timerInterval);
    timerEl.textContent = "Time: 0s";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
});
