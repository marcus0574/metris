// ===== MAIN GAME LOGIC =====

class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.particleCanvas = document.getElementById('particleCanvas');
        this.nextCanvas = document.getElementById('nextCanvas');

        // Managers
        this.renderer = new Renderer(this.canvas);
        this.particles = new ParticleSystem(this.particleCanvas);
        this.audio = new AudioManager();
        this.highscoreManager = new HighscoreManager();

        // Game state
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.gameOver = false;
        this.paused = false;
        this.running = false;

        // Timing
        this.dropInterval = 1000; // ms
        this.lastDropTime = 0;
        this.dropSpeed = 1000;

        // Input
        this.keys = {};
        this.lastMoveTime = 0;
        this.moveDelay = 100;

        this.setupEventListeners();
        this.highscoreManager.renderHighscores(document.getElementById('highscoreList'));
    }

    createBoard() {
        return Array(20).fill(null).map(() => Array(10).fill(null));
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.running || this.gameOver) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.softDrop();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.audio.toggleMusic();
                    break;
            }
        });

        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });

        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.hideModal('gameOverModal');
            this.start();
        });

        // Submit highscore
        document.getElementById('submitScore').addEventListener('click', () => {
            const name = document.getElementById('playerName').value;
            this.highscoreManager.addScore(name, this.score);
            this.highscoreManager.renderHighscores(document.getElementById('highscoreList'));
            document.getElementById('highscoreEntry').classList.add('hidden');
        });

        // Touch Controls
        this.setupTouchControls();
    }

    setupTouchControls() {
        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');
        const btnRotate = document.getElementById('btnRotate');
        const btnDown = document.getElementById('btnDown');
        const btnDrop = document.getElementById('btnDrop');

        // Helper to prevent zooming/scrolling on double tap
        const preventZoom = (e) => {
            e.preventDefault();
        };

        if (btnLeft) {
            btnLeft.addEventListener('touchstart', (e) => {
                preventZoom(e);
                this.movePiece(-1, 0);
            }, { passive: false });
            // Repeat move if held? maybe later complexity
        }

        if (btnRight) {
            btnRight.addEventListener('touchstart', (e) => {
                preventZoom(e);
                this.movePiece(1, 0);
            }, { passive: false });
        }

        if (btnRotate) {
            btnRotate.addEventListener('touchstart', (e) => {
                preventZoom(e);
                this.rotatePiece();
            }, { passive: false });
        }

        if (btnDown) {
            btnDown.addEventListener('touchstart', (e) => {
                preventZoom(e);
                this.softDrop();
            }, { passive: false });
        }

        if (btnDrop) {
            btnDrop.addEventListener('touchstart', (e) => {
                preventZoom(e);
                this.hardDrop();
            }, { passive: false });
        }

        // Add mouse support for testing on desktop with mouse
        btnLeft.addEventListener('mousedown', () => this.movePiece(-1, 0));
        btnRight.addEventListener('mousedown', () => this.movePiece(1, 0));
        btnRotate.addEventListener('mousedown', () => this.rotatePiece());
        btnDown.addEventListener('mousedown', () => this.softDrop());
        btnDrop.addEventListener('mousedown', () => this.hardDrop());
    }


    start() {
        this.board = this.createBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.gameOver = false;
        this.paused = false;
        this.running = true;
        this.dropSpeed = 1000;

        this.currentPiece = getRandomTetromino();
        this.nextPiece = getRandomTetromino();

        this.updateUI();
        this.particles.clear();
        this.hideModal('pauseModal');
        this.hideModal('gameOverModal');

        // Start music (requires user interaction first usually, but startBtn click handles that)
        this.audio.startMusic();

        this.lastDropTime = performance.now();
        this.gameLoop();
    }

    gameLoop(timestamp = 0) {
        if (!this.running || this.gameOver) return;

        if (!this.paused) {
            // Auto drop
            if (timestamp - this.lastDropTime > this.dropSpeed) {
                this.dropPiece();
                this.lastDropTime = timestamp;
            }

            // Render
            this.render();

            // Update particles
            this.particles.update();
            this.particles.draw();
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    render() {
        this.renderer.clear();
        this.renderer.drawBackground();
        this.renderer.drawGrid();
        this.renderer.drawBoard(this.board);

        if (this.currentPiece) {
            // Draw ghost piece
            const ghost = this.getGhostPiece();
            this.renderer.drawTetromino(ghost, true);

            // Draw current piece
            this.renderer.drawTetromino(this.currentPiece);
        }

        // Draw next piece
        if (this.nextPiece) {
            this.renderer.drawNextTetromino(this.nextPiece, this.nextCanvas);
        }
    }

    getGhostPiece() {
        const ghost = this.currentPiece.clone();
        while (!this.checkCollision(ghost, 0, 1)) {
            ghost.y++;
        }
        return ghost;
    }

    movePiece(dx, dy) {
        if (!this.currentPiece || this.paused) return;

        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            if (dx !== 0) this.audio.playMove();
            return true;
        }
        return false;
    }

    rotatePiece() {
        if (!this.currentPiece || this.paused) return;

        this.currentPiece.rotate();
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            // Try wall kicks
            const kicks = [[1, 0], [-1, 0], [0, -1]];
            let kicked = false;
            for (const [dx, dy] of kicks) {
                if (!this.checkCollision(this.currentPiece, dx, dy)) {
                    this.currentPiece.x += dx;
                    this.currentPiece.y += dy;
                    kicked = true;
                    break;
                }
            }
            if (!kicked) {
                this.currentPiece.rotateBack();
                return;
            }
        }
        this.audio.playRotate();
    }

    softDrop() {
        if (this.movePiece(0, 1)) {
            this.score += 1;
            this.updateUI();
        }
    }

    hardDrop() {
        if (!this.currentPiece || this.paused) return;

        let dropDistance = 0;
        while (!this.checkCollision(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
            dropDistance++;
        }

        this.score += dropDistance * 2;
        this.lockPiece();
        this.audio.playDrop();
    }

    dropPiece() {
        if (!this.movePiece(0, 1)) {
            this.lockPiece();
        }
    }

    lockPiece() {
        const shape = this.currentPiece.getCurrentShape();
        const colors = [];

        // Add piece to board
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardY = this.currentPiece.y + row;
                    const boardX = this.currentPiece.x + col;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                        colors.push(this.currentPiece.color);
                    }
                }
            }
        }

        // Emit placement particles
        const centerX = (this.currentPiece.x + 1.5) * this.renderer.blockSize + this.renderer.offsetX;
        const centerY = (this.currentPiece.y + 1.5) * this.renderer.blockSize + this.renderer.offsetY;
        this.particles.emit(centerX, centerY, this.currentPiece.color, 10);

        // Check for completed lines
        const linesCleared = this.clearLines();

        // Get next piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();

        // Check game over
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.endGame();
        }

        this.updateUI();
    }

    clearLines() {
        let linesCleared = 0;
        const clearedRows = [];

        for (let row = this.board.length - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== null)) {
                clearedRows.push(row);
                const colors = this.board[row].filter(c => c !== null);
                this.particles.emitLineClear(row, colors);
                this.board.splice(row, 1);
                this.board.unshift(Array(10).fill(null));
                linesCleared++;
                row++; // Check same row again
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.combo++;

            // Calculate score
            const baseScore = [0, 100, 300, 500, 800][linesCleared];
            const comboBonus = this.combo > 1 ? (this.combo - 1) * 50 : 0;
            this.score += (baseScore + comboBonus) * this.level;

            // Play sound
            this.audio.playLineClear(linesCleared);

            // Check level up
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropSpeed = Math.max(100, 1000 - (this.level - 1) * 50);
                this.audio.playLevelUp();
                this.particles.emitConfetti(50);
                this.shakeScreen();
            }

            // Tetris bonus effect
            if (linesCleared === 4) {
                this.particles.emitExplosion(
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    ['#00f3ff', '#ff006e', '#b537f2', '#39ff14', '#ffd700'],
                    100
                );
                this.shakeScreen();
            }
        } else {
            this.combo = 0;
        }

        return linesCleared;
    }

    checkCollision(piece, dx = 0, dy = 0) {
        const shape = piece.getCurrentShape();
        const newX = piece.x + dx;
        const newY = piece.y + dy;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardX = newX + col;
                    const boardY = newY + row;

                    // Check boundaries
                    if (boardX < 0 || boardX >= 10 || boardY >= 20) {
                        return true;
                    }

                    // Check board collision
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    togglePause() {
        if (this.gameOver || !this.running) return;

        this.paused = !this.paused;
        if (this.paused) {
            this.showModal('pauseModal');
            this.audio.stopMusic();
        } else {
            this.hideModal('pauseModal');
            this.lastDropTime = performance.now();
            if (this.audio.musicEnabled) this.audio.startMusic();
        }
    }

    endGame() {
        this.gameOver = true;
        this.running = false;
        this.audio.playGameOver();

        document.getElementById('finalScore').textContent = this.score.toLocaleString();

        // Check if highscore
        if (this.highscoreManager.isHighscore(this.score)) {
            document.getElementById('highscoreEntry').classList.remove('hidden');
            document.getElementById('playerName').value = '';
            document.getElementById('playerName').focus();
        } else {
            document.getElementById('highscoreEntry').classList.add('hidden');
        }

        this.showModal('gameOverModal');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('combo').textContent = this.combo;
    }

    showModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    hideModal(id) {
        document.getElementById(id).classList.add('hidden');
    }

    shakeScreen() {
        this.canvas.parentElement.classList.add('shake');
        setTimeout(() => {
            this.canvas.parentElement.classList.remove('shake');
        }, 500);
    }
}

// ===== INITIALIZE GAME =====
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
