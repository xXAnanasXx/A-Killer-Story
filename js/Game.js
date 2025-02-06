import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";
export default class Game {
    objetsGraphiques = [];

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
        this.speedModifier = 1;
        this.speedValue = 2;

        this.gridRatio = 50;

        this.levelNumber = 1;
        this.levelFinished = false;
        this.hasMoved = false;
        this.scoreboard = [];
        this.levelsData = null;
        this.timerRunning = false;

        this.currentLevel = null;
        this.totalVictims = 0;
        this.nbVictims = 0;
    }

    async init() {
        this.ctx = this.canvas.getContext("2d");

        // Load levels data
        await this.loadLevelsData();

        // On crée le joueur
        this.player = new Player(10, 10, 0.5);

        // Initialize GUI elements
        this.levelElement = document.getElementById("level");
        this.scoreElement = document.getElementById("score");
        this.timerElement = document.getElementById("timer");
        this.scoreboardElement = document.getElementById("scoreboard");

        // On charge le premier niveau       
        this.loadMap(this.levelNumber);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        // Load high scores from local storage
        this.loadScoreBoard();

        console.log("Game initialisé");
    }

    async loadLevelsData() {
        try {
            const response = await fetch(`/assets/levels.json`);
            const data = await response.json();
            this.levelsData = data.levels;
        } catch (error) {
            console.error('Error loading levels data:', error);
        }
    }

    loadMap(numMap, resetTimer = true) {
        if (!this.levelsData) {
            console.error('Levels data not loaded');
            return;
        }

        let level = this.levelsData.find(level => level.number === numMap);
        this.currentLevel = level;
        this.totalVictims = this.totalVictimsInLevel();
        this.nbVictims = 0;
        if (!level) {
            console.error(`Level ${numMap} not found`);
            return;
        }

        this.player.respawn(level.initialPlayerPosition.x * this.gridRatio, level.initialPlayerPosition.y * this.gridRatio, level.initialPlayerPosition.scale);

        // Clear existing obstacles
        this.objetsGraphiques = [];

        // Add new obstacles from the level data
        level.obstacles.forEach(obstacleData => {
            let obstacle = new Obstacle(obstacleData.x * this.gridRatio, obstacleData.y * this.gridRatio, obstacleData.width * this.gridRatio, obstacleData.length * this.gridRatio, obstacleData.type);
            this.objetsGraphiques.push(obstacle);
        });

        // Add player back to the objects list
        this.objetsGraphiques.push(this.player);

        // Un objert qui suit la souris
        this.objetSouris = new ObjetSouris(200, 200, 15, 25, "orange");
        this.objetsGraphiques.push(this.objetSouris);

        // Update level number in GUI
        this.updateLevel(numMap);

        this.levelFinished = false;
        if (resetTimer) {
            this.hasMoved = false;
            this.timerRunning = false;
            this.timerElement.textContent = `Time: 0`;
        }

        // Update the scoreboard
        this.updateScoreboard();
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    updateLevel(levelNumber) {
        this.levelElement.textContent = `Level: ${levelNumber}`;
    }

    updateScore(score) {
        this.scoreElement.textContent = `Score: ${score}`;
    }

    startTimer() {
        if (!this.hasMoved) {
            this.hasMoved = true;
            this.startTime = Date.now();
            this.timerRunning = true;
            this.updateTimer();
        }
    }

    updateTimer() {
        if (!this.timerRunning) return;
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerElement.textContent = `Time: ${elapsedTime}`;
        setTimeout(() => this.updateTimer(), 1000);
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {
        // Appelée par mainAnimationLoop
        // donc tous les 1/60 de seconde

        // Déplacement du joueur. 
        this.movePlayer();

        // on met à jouer la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        // on vérifie si le player a atteint la sortie
        if (this.levelFinished) {
            return;
        }
    }

    movePlayer() {
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;

        if (this.inputStates.ArrowRight) {
            this.player.vitesseX = this.speedValue * this.speedModifier;
            this.startTimer();
        }
        if (this.inputStates.ArrowLeft) {
            this.player.vitesseX = -this.speedValue * this.speedModifier;
            this.startTimer();
        }

        if (this.inputStates.ArrowUp) {
            this.player.vitesseY = -this.speedValue * this.speedModifier;
            this.startTimer();
        }

        if (this.inputStates.ArrowDown) {
            this.player.vitesseY = this.speedValue * this.speedModifier;
            this.startTimer();
        }

        this.player.move();

        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();

    }

    testCollisionPlayerBordsEcran() {
        // Rappel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if (this.player.x - this.player.w / 2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w / 2;
        }
        if (this.player.x + this.player.w / 2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w / 2;
        }

        if (this.player.y - this.player.h / 2 < 0) {
            this.player.y = this.player.h / 2;
            this.player.vitesseY = 0;

        }

        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
        }
    }

    testCollisionPlayerObstacles() {
        let inContactWithObstacle = false;

        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle) {
                if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    inContactWithObstacle = true;

                    switch (obj.type) {
                        case "wall":
                        case "water":
                            // Block the player
                            this.player.vitesseX = 0;
                            this.player.vitesseY = 0;
                            // Adjust player position to prevent overlap
                            if (this.player.x < obj.x) {
                                this.player.x = obj.x - this.player.w / 2;
                            } else if (this.player.x > obj.x + obj.w) {
                                this.player.x = obj.x + obj.w + this.player.w / 2;
                            }
                            if (this.player.y < obj.y) {
                                this.player.y = obj.y - this.player.h / 2;
                            } else if (this.player.y > obj.y + obj.h) {
                                this.player.y = obj.y + obj.h + this.player.h / 2;
                            }
                            break;
                        case "lava":
                        case "void":
                            // Respawn the player
                            this.loadMap(this.levelNumber, false);
                            break;
                        case "mud":
                            // Slow down the player
                            this.speedModifier = 0.1;
                            break;
                        case "ice":
                            // Speed up the player
                            this.speedModifier = 1.5;
                            break;
                        case "victim":
                            // Replace the victim with a corpse
                            const corpse = new Obstacle(obj.x, obj.y, obj.w, obj.h, "corpse");
                            this.objetsGraphiques = this.objetsGraphiques.map(o => o === obj ? corpse : o);
                            this.nbVictims++;
                            break;
                        case "exit":
                            // Load next level
                            if (!this.levelFinished && this.nbVictims === this.totalVictims) {
                                this.levelFinished = true;
                                this.saveHighScore(this.levelNumber - 1, Math.floor((Date.now() - this.startTime) / 1000));
                                this.levelNumber = this.levelNumber == this.scoreboard.length ? 1 : this.levelNumber + 1;
                                this.loadMap(this.levelNumber);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        if (!inContactWithObstacle) {
            this.speedModifier = 1;
        }
    }

    loadScoreBoard() {
        // On charge les niveaux
        if (!this.levelsData) {
            console.error('Levels data not loaded');
            return;
        }

        for (let i = 0; i < this.levelsData.length; i++) {
            this.scoreboard.push({ level: i + 1, score: null });
        }

        this.updateScoreboard();
    }

    saveHighScore(level, score) {
        console.log(`Level ${level} completed in ${score}s`);

        if (!this.scoreboard[level].score || score < this.scoreboard[level].score) {
            this.scoreboard[level].score = score;
            localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
        }
    }

    updateScoreboard() {
        this.scoreboardElement.innerHTML = '';

        this.scoreboard.forEach(level => {
            const li = document.createElement('li');
            let score = level.score ? `${level.score}s` : 'N/A';
            li.textContent = `Level ${level.level}: ${score}`;
            li.addEventListener('click', () => {
                this.levelNumber = parseInt(level.level);
                this.loadMap(this.levelNumber);
            });
            this.scoreboardElement.appendChild(li);
        });
    }

    totalVictimsInLevel() {
        let total = 0;
        this.currentLevel.obstacles.forEach(obstacleData => {
            if (obstacleData.type === Obstacle.Types.VICTIM) {
                total++;
            }
        });
        return total;
    }
}