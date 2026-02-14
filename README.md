# 🎮 METRIS - Futuristic Tetris

Ein modernes, farbenfrohes Tetris-Browsergame mit futuristischem Cyberpunk-Design, 3D-Effekten und Partikel-System.

![Metris](https://img.shields.io/badge/Status-Playable-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎨 Visuelles Design
- **Cyberpunk-Farbschema** mit Neon-Farben (Cyan, Pink, Purple, Green, Gold)
- **Glassmorphismus-UI** mit Blur-Effekten
- **3D-Isometrische Darstellung** der Tetrominos
- **Neon-Glow-Effekte** auf allen Blöcken und UI-Elementen
- **Partikel-System** mit verschiedenen Effekten:
  - Explosionen beim Löschen von Reihen
  - Konfetti bei Level-Ups
  - Aufprall-Effekte beim Platzieren
- **Screen-Shake** bei Combos und Tetris
- **Animierte Hintergründe** mit Farbverläufen

### 🎯 Gameplay
- Alle 7 klassischen Tetrominos (I, O, T, S, Z, J, L)
- Super Rotation System (SRS) mit Wall-Kicks
- Ghost-Block zeigt Landeplatz
- Soft Drop und Hard Drop
- Combo-System für Bonus-Punkte
- Progressive Level-Schwierigkeit

### 🏆 Highscore-System
- Top 10 Highscore-Liste
- Persistente Speicherung (localStorage)
- Namenseingabe bei neuem Highscore
- Farbcodierte Ränge (Gold, Silber, Bronze)

### 🔊 Audio
- Sound-Effekte für alle Aktionen (Web Audio API)
- Verschiedene Töne für Line Clears (1-4 Reihen)
- Level-Up und Game-Over Melodien
- Mute-Funktion (Taste M)

## 🚀 Installation & Start

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Edge, Safari)
- Node.js (für lokalen Webserver)

### Schnellstart

1. **Repository klonen oder Dateien herunterladen**
   ```bash
   cd Tetris
   ```

2. **Webserver starten**
   ```bash
   npx -y http-server -p 8080
   ```

3. **Spiel öffnen**
   - Öffne deinen Browser und navigiere zu: `http://localhost:8080`
   - Oder öffne `index.html` direkt im Browser

## 🎮 Steuerung

| Taste | Funktion |
|-------|----------|
| **←** / **→** | Tetromino nach links/rechts bewegen |
| **↑** | Tetromino rotieren (im Uhrzeigersinn) |
| **↓** | Soft Drop (schneller fallen) |
| **SPACE** | Hard Drop (sofort platzieren) |
| **P** | Pause / Fortsetzen |
| **M** | Musik an/aus |

## 📊 Score-System

- **Einzelne Reihe**: 100 × Level
- **Doppel (2 Reihen)**: 300 × Level
- **Triple (3 Reihen)**: 500 × Level
- **Tetris (4 Reihen)**: 800 × Level
- **Soft Drop**: 1 Punkt pro Feld
- **Hard Drop**: 2 Punkte pro Feld
- **Combo-Bonus**: (Combo - 1) × 50 × Level

## 📁 Projektstruktur

```
Tetris/
├── index.html              # Haupt-HTML-Datei
├── css/
│   └── style.css          # Komplettes Styling
├── js/
│   ├── tetromino.js       # Tetromino-Definitionen
│   ├── particles.js       # Partikel-System
│   ├── renderer.js        # 3D-Canvas-Rendering
│   ├── audio.js           # Sound-Manager
│   ├── highscore.js       # Highscore-Verwaltung
│   └── game.js            # Haupt-Spiellogik
└── assets/
    ├── sounds/            # Sound-Effekte
    └── music/             # Hintergrundmusik
```

## 🛠️ Technologie-Stack

- **HTML5 Canvas** - Rendering-Engine
- **Vanilla JavaScript (ES6+)** - Spiellogik
- **CSS3** - Styling mit Glassmorphismus und Animationen
- **Web Audio API** - Sound-Effekte
- **localStorage** - Highscore-Persistenz

## 🎨 Design-Konzept

### Farbpalette
```css
--neon-cyan:    #00f3ff
--neon-pink:    #ff006e
--neon-purple:  #b537f2
--neon-green:   #39ff14
--neon-gold:    #ffd700
```

### Effekte
- **Glassmorphismus**: `backdrop-filter: blur(10px)`
- **Neon-Glow**: Mehrschichtige `text-shadow` und `box-shadow`
- **3D-Blöcke**: Gradient-Fills mit Highlights
- **Partikel**: Canvas-basierte Physik-Simulation

## 🎯 Tipps & Tricks

1. **Tetris-Bonus**: Versuche 4 Reihen auf einmal zu löschen für maximale Punkte
2. **Combos**: Lösche mehrere Reihen hintereinander für Bonus-Punkte
3. **Ghost-Block**: Nutze den halbtransparenten Block als Orientierung
4. **Hard Drop**: Nutze SPACE für schnelle Platzierung und Extra-Punkte
5. **Level-Strategie**: Höhere Level = mehr Punkte pro Reihe

## 🔮 Zukünftige Erweiterungen

- [ ] Hintergrundmusik-Loop
- [ ] Mobile Touch-Steuerung
- [ ] Verschiedene Themes
- [ ] Power-Ups System
- [ ] Multiplayer-Modus
- [ ] Achievement-System
- [ ] Detaillierte Statistiken

## 📝 Lizenz

Dieses Projekt wurde für Bildungszwecke erstellt.

## 🙏 Credits

- **Design & Entwicklung**: Erstellt mit Google Gemini
- **Inspiration**: Klassisches Tetris mit modernem Twist
- **Fonts**: Google Fonts (Orbitron, Rajdhani)

---

**Viel Spaß beim Spielen!** 🎮✨

*Entwickelt mit ❤️ und viel Neon-Glow*
