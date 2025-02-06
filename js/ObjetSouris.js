import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class ObjetSouris extends ObjectGraphique {
    constructor(x, y, w, h, couleur) {
        super(x, y, w, h, couleur);
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x-(this.w + 5), this.y);
        ctx.lineTo(this.x+(this.w +5), this.y);
        ctx.moveTo(this.x, this.y-(this.w + 5));
        ctx.lineTo(this.x, this.y+(this.w + 5));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}   