// ===== 3D ISOMETRIC RENDERER =====

class Renderer {
    constructor(canvas, blockSize = 35) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockSize = blockSize;
        this.gridWidth = 10;
        this.gridHeight = 20;
        this.offsetX = 20;
        this.offsetY = 40;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        // Dark gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 14, 39, 0.8)');
        gradient.addColorStop(1, 'rgba(26, 26, 46, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + x * this.blockSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + x * this.blockSize, this.offsetY + this.gridHeight * this.blockSize);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + y * this.blockSize);
            this.ctx.lineTo(this.offsetX + this.gridWidth * this.blockSize, this.offsetY + y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawBlock(x, y, color, alpha = 1, glow = true) {
        const px = this.offsetX + x * this.blockSize;
        const py = this.offsetY + y * this.blockSize;
        const size = this.blockSize;

        this.ctx.save();
        this.ctx.globalAlpha = alpha;

        // Glow effect
        if (glow) {
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = color;
        }

        // Main block with gradient
        const gradient = this.ctx.createLinearGradient(px, py, px + size, py + size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.6));

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(px + 2, py + 2, size - 4, size - 4);

        // Top highlight
        this.ctx.fillStyle = this.lightenColor(color, 0.3);
        this.ctx.fillRect(px + 2, py + 2, size - 4, 4);

        // Left highlight
        this.ctx.fillRect(px + 2, py + 2, 4, size - 4);

        // Border
        this.ctx.strokeStyle = this.lightenColor(color, 0.5);
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(px + 2, py + 2, size - 4, size - 4);

        this.ctx.restore();
    }

    drawTetromino(tetromino, ghost = false) {
        const shape = tetromino.getCurrentShape();
        const alpha = ghost ? 0.2 : 1;
        const glow = !ghost;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    this.drawBlock(
                        tetromino.x + col,
                        tetromino.y + row,
                        tetromino.color,
                        alpha,
                        glow
                    );
                }
            }
        }
    }

    drawBoard(board) {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col]) {
                    this.drawBlock(col, row, board[row][col]);
                }
            }
        }
    }

    drawNextTetromino(tetromino, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const shape = tetromino.getCurrentShape();
        const blockSize = 25;
        const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (canvas.height - shape.length * blockSize) / 2;

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const px = offsetX + col * blockSize;
                    const py = offsetY + row * blockSize;

                    ctx.save();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = tetromino.color;

                    const gradient = ctx.createLinearGradient(px, py, px + blockSize, py + blockSize);
                    gradient.addColorStop(0, tetromino.color);
                    gradient.addColorStop(1, this.darkenColor(tetromino.color, 0.6));

                    ctx.fillStyle = gradient;
                    ctx.fillRect(px + 2, py + 2, blockSize - 4, blockSize - 4);

                    ctx.strokeStyle = this.lightenColor(tetromino.color, 0.5);
                    ctx.lineWidth = 2;
                    ctx.strokeRect(px + 2, py + 2, blockSize - 4, blockSize - 4);

                    ctx.restore();
                }
            }
        }
    }

    // Helper functions for color manipulation
    lightenColor(color, amount) {
        return this.adjustColor(color, amount);
    }

    darkenColor(color, amount) {
        return this.adjustColor(color, -amount);
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount * 255));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount * 255));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount * 255));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
}
