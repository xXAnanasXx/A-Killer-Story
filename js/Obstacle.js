import ObjectGraphique from "./ObjectGraphique.js";

export default class Obstacle extends ObjectGraphique {
    static Types = Object.freeze({
        WALL: "wall",
        WATER: "water",
        MUD: "mud",
        LAVA: "lava",
        ICE: "ice",
        VOID: "void",
        EXIT: "exit",
        VICTIM: "victim",
        CORPSE: "corpse"
    });

    constructor(x, y, w, h, type = Obstacle.Types.WALL) {
        if (!Object.values(Obstacle.Types).includes(type)) {
            throw new Error(`Invalid obstacle type: ${type}`);
        }
        let couleur;
        switch (type) {
            case "wall":
                couleur = "grey";
                break;
            case "water":
                couleur = "blue";
                break;
            case "mud":
                couleur = "brown";
                break;
            case "lava":
                couleur = "red";
                break;
            case "ice":
                couleur = "lightblue";
                break;
            case "void":
                couleur = "black";
                break;
            case "exit":
                couleur = "green";
                break;
            case "victim":
                couleur = "pink";
                break;
            case "corpse":
                couleur = "pink";
                break;
            default:
                break;
        }
        super(x, y, w, h, couleur);
        this.type = type;
    }

    draw(ctx) {
        ctx.save();
        switch (this.type) {
            case Obstacle.Types.WALL:
                this.drawWall(ctx);
                break;
            case Obstacle.Types.WATER:
                this.drawWater(ctx);
                break;
            case Obstacle.Types.MUD:
                this.drawMud(ctx);
                break;
            case Obstacle.Types.LAVA:
                this.drawLava(ctx);
                break;
            case Obstacle.Types.ICE:
                this.drawIce(ctx);
                break;
            case Obstacle.Types.VOID:
                this.drawVoid(ctx);
                break;
            case Obstacle.Types.EXIT:
                this.drawExit(ctx);
                break;
            case Obstacle.Types.VICTIM:
                this.drawVictim(ctx);
                break;
            case Obstacle.Types.CORPSE:
                this.drawCorpse(ctx);
                break;
            default:
                break;
        }
        ctx.restore();
    }

    drawWall(ctx) {
        const brickWidth = 25;
        const brickHeight = 10;
        ctx.fillStyle = "lightgrey";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.couleur;
        for (let y = this.y; y < this.y + this.h; y += brickHeight) {
            for (let x = this.x; x < this.x + this.w; x += brickWidth) {
                ctx.fillRect(x, y, brickWidth - 1, brickHeight - 1);
            }
        }
    }

    drawWater(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "lightblue");
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    drawMud(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        gradient.addColorStop(0, "brown");
        gradient.addColorStop(1, "saddlebrown");
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    drawLava(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "orange");
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Add bubbles
        for (let i = 0; i < 10; i++) {
            const bubbleX = this.x + Math.random() * this.w;
            const bubbleY = this.y + Math.random() * this.h;
            const bubbleRadius = Math.random() * 5 + 2;
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }

    drawIce(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        gradient.addColorStop(0, "lightblue");
        gradient.addColorStop(1, "white");
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Add cracks
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + Math.random() * this.w, this.y + Math.random() * this.h);
            ctx.lineTo(this.x + Math.random() * this.w, this.y + Math.random() * this.h);
            ctx.stroke();
        }
    }

    drawVoid(ctx) {
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    drawExit(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x + this.w / 2, this.y + this.h / 2, this.w / 4,
            this.x + this.w / 2, this.y + this.h / 2, this.w / 2
        );
        gradient.addColorStop(0, this.couleur);
        gradient.addColorStop(1, "dark" + this.couleur);
        ctx.fillStyle = gradient;

        // Draw circle
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add green shadow
        ctx.shadowColor = this.couleur;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Redraw circle to apply shadow
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add animation effect
        const time = Date.now() * 0.002;
        ctx.strokeStyle = "light" + this.couleur;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
            this.x + this.w / 2,
            this.y + this.h / 2,
            (this.w / 2) * (0.5 + 0.5 * Math.sin(time)),
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            this.x + this.w / 2,
            this.y + this.h / 2,
            (this.w / 2) * (0.5 + 0.5 * Math.cos(time)),
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            this.x + this.w / 2,
            this.y + this.h / 2,
            (this.w / 2) * (0.8 + 0.5 * Math.cos(time)),
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    drawVictim(ctx) {
        const size = Math.min(this.w, this.h);

        // Draw head
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2, size, size);

        // Draw eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x + (this.w - size) / 2 + size * 0.35, this.y + (this.h - size) / 2 + size * 0.3, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (this.w - size) / 2 + size * 0.65, this.y + (this.h - size) / 2 + size * 0.3, size * 0.05, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x + (this.w - size) / 2 + size * 0.35, this.y + (this.h - size) / 2 + size * 0.3, size * 0.02, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + (this.w - size) / 2 + size * 0.65, this.y + (this.h - size) / 2 + size * 0.3, size * 0.02, 0, Math.PI * 2);
        ctx.fill();

        // Draw hair
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2, size, size * 0.1);

        // Draw mouth
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.33, this.y + (this.h - size) / 2 + size * 0.48, size * 0.33, size * 0.05);
        ctx.fill();

        // Draw suit
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2 + size * 0.6, size, size * 0.4);

        // Draw tie
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.5, this.y + (this.h - size) / 2 + size * 0.6);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.45, this.y + (this.h - size) / 2 + size * 0.8);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.55, this.y + (this.h - size) / 2 + size * 0.8);
        ctx.closePath();
        ctx.fill();

        // Draw arms
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2 - size * 0.1, this.y + (this.h - size) / 2 + size * 0.6, size * 0.1, size * 0.3);
        ctx.fillRect(this.x + (this.w - size) / 2 + size, this.y + (this.h - size) / 2 + size * 0.6, size * 0.1, size * 0.3);

        // Draw hands
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x + (this.w - size) / 2 - size * 0.1, this.y + (this.h - size) / 2 + size * 0.9, size * 0.1, size * 0.1);
        ctx.fillRect(this.x + (this.w - size) / 2 + size, this.y + (this.h - size) / 2 + size * 0.9, size * 0.1, size * 0.1);

        // Draw legs
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.1, this.y + (this.h - size) / 2 + size, size * 0.3, size * 0.1);
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.6, this.y + (this.h - size) / 2 + size, size * 0.3, size * 0.1);
    }

    drawCorpse(ctx) {
        const size = Math.min(this.w, this.h);

        // Draw blood puddle
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2 + size * 0.2, this.y + this.h / 2 - size * 0.2, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw head
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2, size, size);

        // Draw eyes (crossed)
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.3, this.y + (this.h - size) / 2 + size * 0.25);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.4, this.y + (this.h - size) / 2 + size * 0.35);
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.4, this.y + (this.h - size) / 2 + size * 0.25);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.3, this.y + (this.h - size) / 2 + size * 0.35);
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.6, this.y + (this.h - size) / 2 + size * 0.25);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.7, this.y + (this.h - size) / 2 + size * 0.35);
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.7, this.y + (this.h - size) / 2 + size * 0.25);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.6, this.y + (this.h - size) / 2 + size * 0.35);
        ctx.stroke();

        // Draw hair
        ctx.fillStyle = "saddlebrown";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2, size, size * 0.1);

        // Draw mouth (tongue out)
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.33, this.y + (this.h - size) / 2 + size * 0.48, size * 0.33, size * 0.05);
        ctx.fillStyle = "red";
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.45, this.y + (this.h - size) / 2 + size * 0.53, size * 0.1, size * 0.1);

        // Draw suit
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2, this.y + (this.h - size) / 2 + size * 0.6, size, size * 0.4);

        // Draw tie
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x + (this.w - size) / 2 + size * 0.5, this.y + (this.h - size) / 2 + size * 0.6);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.45, this.y + (this.h - size) / 2 + size * 0.8);
        ctx.lineTo(this.x + (this.w - size) / 2 + size * 0.55, this.y + (this.h - size) / 2 + size * 0.8);
        ctx.closePath();
        ctx.fill();

        // Draw arms
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2 - size * 0.1, this.y + (this.h - size) / 2 + size * 0.6, size * 0.1, size * 0.3);
        ctx.fillRect(this.x + (this.w - size) / 2 + size, this.y + (this.h - size) / 2 + size * 0.6, size * 0.1, size * 0.3);

        // Draw hands
        ctx.fillStyle = "pink";
        ctx.fillRect(this.x + (this.w - size) / 2 - size * 0.1, this.y + (this.h - size) / 2 + size * 0.9, size * 0.1, size * 0.1);
        ctx.fillRect(this.x + (this.w - size) / 2 + size, this.y + (this.h - size) / 2 + size * 0.9, size * 0.1, size * 0.1);

        // Draw legs
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.1, this.y + (this.h - size) / 2 + size, size * 0.3, size * 0.1);
        ctx.fillRect(this.x + (this.w - size) / 2 + size * 0.6, this.y + (this.h - size) / 2 + size, size * 0.3, size * 0.1);        
    }
}