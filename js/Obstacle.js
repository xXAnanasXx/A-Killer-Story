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
        VICTIM: "victim"
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
            default:
                break;
        }
        super(x, y, w, h, couleur);
        this.type = type;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
}