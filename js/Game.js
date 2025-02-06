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
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        // On cree deux obstacles
        let obstacle1 = new Obstacle(300, 0, 40, 600);
        this.objetsGraphiques.push(obstacle1);
        let obstacle2 = new Obstacle(500, 500, 100, 100, Obstacle.Types.WATER);
        this.objetsGraphiques.push(obstacle2);
        let obstacle3 = new Obstacle(200, 200, 100, 100, Obstacle.Types.MUD);
        this.objetsGraphiques.push(obstacle3);
        let obstacle4 = new Obstacle(400, 400, 100, 100, Obstacle.Types.LAVA);
        this.objetsGraphiques.push(obstacle4);
        let obstacle5 = new Obstacle(100, 600, 600, 100, Obstacle.Types.ICE);
        this.objetsGraphiques.push(obstacle5);

        // On ajoute la sortie
        // TODO

        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        // Un objert qui suite la souris, juste pour tester
        this.objetSouris = new ObjetSouris(200, 200, 15, 25, "orange");
        this.objetsGraphiques.push(this.objetSouris);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
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
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
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

        // On regarde si le joueur a atteint la sortie
        // TODO

    }

    movePlayer() {        
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;

        if (this.inputStates.ArrowRight) {
            this.player.vitesseX = this.speedValue * this.speedModifier;
        }
        if (this.inputStates.ArrowLeft) {
            this.player.vitesseX = -this.speedValue * this.speedModifier;
        }

        if (this.inputStates.ArrowUp) {
            this.player.vitesseY = -this.speedValue * this.speedModifier;
        }

        if (this.inputStates.ArrowDown) {
            this.player.vitesseY = this.speedValue * this.speedModifier;
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
                            this.player.x = 10;
                            this.player.y = 10;
                            this.player.vitesseX = 0;
                            this.player.vitesseY = 0;
                            break;
                        case "mud":                            
                            // Slow down the player
                            this.speedModifier = 0.1;
                            break;
                        case "ice":
                            // Speed up the player
                            this.speedModifier = 1.5;
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

}