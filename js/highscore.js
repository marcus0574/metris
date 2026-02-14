// ===== HIGHSCORE MANAGER =====

class HighscoreManager {
    constructor() {
        this.storageKey = 'metris_highscores';
        this.maxScores = 10;
        this.scores = this.loadScores();
    }

    loadScores() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading highscores:', e);
                return [];
            }
        }
        return [];
    }

    saveScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (e) {
            console.error('Error saving highscores:', e);
        }
    }

    isHighscore(score) {
        if (this.scores.length < this.maxScores) {
            return true;
        }
        return score > this.scores[this.scores.length - 1].score;
    }

    addScore(name, score) {
        const entry = {
            name: name.trim() || 'Anonym',
            score: score,
            date: new Date().toISOString()
        };

        this.scores.push(entry);
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, this.maxScores);
        this.saveScores();
    }

    getScores() {
        return this.scores;
    }

    getRank(score) {
        for (let i = 0; i < this.scores.length; i++) {
            if (score > this.scores[i].score) {
                return i + 1;
            }
        }
        return this.scores.length + 1;
    }

    renderHighscores(container) {
        container.innerHTML = '';

        if (this.scores.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.6;">Noch keine Highscores</p>';
            return;
        }

        this.scores.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'highscore-item';

            const rank = document.createElement('div');
            rank.className = 'highscore-rank';
            if (index === 0) rank.classList.add('gold');
            else if (index === 1) rank.classList.add('silver');
            else if (index === 2) rank.classList.add('bronze');
            rank.textContent = `#${index + 1}`;

            const name = document.createElement('div');
            name.className = 'highscore-name';
            name.textContent = entry.name;

            const score = document.createElement('div');
            score.className = 'highscore-score';
            score.textContent = entry.score.toLocaleString();

            item.appendChild(rank);
            item.appendChild(name);
            item.appendChild(score);
            container.appendChild(item);
        });
    }

    clearScores() {
        this.scores = [];
        this.saveScores();
    }
}
