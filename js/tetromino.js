// ===== TETROMINO DEFINITIONS =====

const TETROMINOS = {
    I: {
        shape: [
            [[0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],
            [[0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]],
            [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]],
            [[0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]]
        ],
        color: '#00f3ff' // Neon Cyan
    },
    O: {
        shape: [
            [[1, 1],
            [1, 1]],
            [[1, 1],
            [1, 1]],
            [[1, 1],
            [1, 1]],
            [[1, 1],
            [1, 1]]
        ],
        color: '#ffd700' // Neon Gold
    },
    T: {
        shape: [
            [[0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]],
            [[0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]],
            [[0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]],
            [[0, 1, 0],
            [1, 1, 0],
            [0, 1, 0]]
        ],
        color: '#b537f2' // Neon Purple
    },
    S: {
        shape: [
            [[0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]],
            [[0, 1, 0],
            [0, 1, 1],
            [0, 0, 1]]
        ],
        color: '#39ff14' // Neon Green
    },
    Z: {
        shape: [
            [[1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
            [[0, 0, 1],
            [0, 1, 1],
            [0, 1, 0]]
        ],
        color: '#ff006e' // Neon Pink
    },
    J: {
        shape: [
            [[1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]],
            [[0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]],
            [[0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]],
            [[0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]]
        ],
        color: '#0080ff' // Electric Blue
    },
    L: {
        shape: [
            [[0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]],
            [[0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]],
            [[0, 0, 0],
            [1, 1, 1],
            [1, 0, 0]],
            [[1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]]
        ],
        color: '#ff8c00' // Neon Orange
    }
};

class Tetromino {
    constructor(type) {
        this.type = type;
        this.shape = TETROMINOS[type].shape;
        this.color = TETROMINOS[type].color;
        this.rotationIndex = 0;
        this.x = 3; // Start position
        this.y = 0;
    }

    getCurrentShape() {
        return this.shape[this.rotationIndex];
    }

    rotate() {
        this.rotationIndex = (this.rotationIndex + 1) % this.shape.length;
    }

    rotateBack() {
        this.rotationIndex = (this.rotationIndex - 1 + this.shape.length) % this.shape.length;
    }

    clone() {
        const cloned = new Tetromino(this.type);
        cloned.rotationIndex = this.rotationIndex;
        cloned.x = this.x;
        cloned.y = this.y;
        return cloned;
    }
}

// ===== TETROMINO FACTORY =====
function getRandomTetromino() {
    const types = Object.keys(TETROMINOS);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
}
