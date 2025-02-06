import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Player extends ObjectGraphique {
    constructor(x, y, ratio = 0.4) {
        super(x, y, 100 * ratio, 100 * ratio);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "brown";
        this.angle = 0;
        this.ratio = ratio;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        ctx.scale(this.ratio, this.ratio);

        // tete du monstre
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, 100, 100);

        // yeux
        this.drawYeux(ctx);

        // Les bras
        this.drawCouteau(ctx);
        this.drawBrasGauche(ctx);
        this.drawBrasDroit(ctx);

        // les jambes
        this.drawJambeGauche(ctx);
        this.drawJambeDroite(ctx);

        // la bouche
        this.drawBouche(ctx, this.l);

        // restore
        ctx.restore();
    }

    drawYeux(ctx) {
        ctx.save();

        drawCircleImmediat(ctx, 20, 20, 10, "white");
        drawCircleImmediat(ctx, 23, 23, 5, "black");

        drawCircleImmediat(ctx, 80, 20, 10, "white");
        drawCircleImmediat(ctx, 77, 23, 5, "black");

        // les sourcils
        ctx.fillStyle = "black";
        ctx.rotate(0.3);
        ctx.fillRect(15, 2, 20, 10);
        ctx.rotate(-0.6);
        ctx.fillRect(60, 30, 20, 10);
        ctx.rotate(0.3);

        ctx.restore();
    }

    drawCouteau(ctx) {
        ctx.save();
    
        ctx.translate(-55, 12);
        ctx.rotate(-0.3);
    
        // manche
        ctx.fillStyle = "grey";
        ctx.fillRect(-10, 0, 50, 20);
    
        // lame
        ctx.fillStyle = "lightgrey";
        ctx.beginPath();
        ctx.moveTo(-10, -2);
        ctx.lineTo(-80, -2);
        ctx.lineTo(-10, 30);
        ctx.closePath();
        ctx.fill();
    
        ctx.restore();
    }

    drawBrasGauche(ctx) {
        ctx.save();

        ctx.translate(-40, 60);
        ctx.rotate(-0.3);

        // on dessine le bras gauche
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, -50, 20, 50);
        // on dessine l'avant bras gauche
        this.drawAvantBrasGauche(ctx);

        ctx.restore();
    }

    drawAvantBrasGauche(ctx) {
        ctx.save();

        ctx.translate(0, 0);

        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, 50, 10);

        ctx.restore();
    }

    drawBrasDroit(ctx) {
        ctx.save();

        ctx.translate(100, 50);
        //ctx.rotate(-0.7);

        // on dessine le bras droit
        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, 30, 10);

        // on dessine l'avant bras droit
        this.drawAvantBrasDroit(ctx);

        ctx.restore();
    }

    drawAvantBrasDroit(ctx) {
        ctx.save();

        ctx.translate(30, 0);

        ctx.fillStyle = this.couleur;
        ctx.fillRect(0, 0, 20, 50);

        ctx.restore();
    }

    drawJambeGauche(ctx) {
        ctx.save();

        ctx.translate(-30, 100);
        ctx.fillStyle = this.couleur;
        ctx.rotate(-0.3);
        ctx.fillRect(0, 0, 70, 20);

        ctx.translate(0, 20);
        ctx.fillStyle = this.couleur;
        ctx.rotate(-0.3);
        ctx.fillRect(0, 0, 20, 50);

        ctx.translate(20, 40);
        ctx.fillStyle = this.couleur;
        ctx.rotate(90);
        ctx.fillRect(0, 0, 20, 50);

        ctx.restore();
    }

    drawJambeDroite(ctx) {
        ctx.save();

        ctx.translate(70, 80);
        ctx.fillStyle = this.couleur;
        ctx.rotate(0.4);
        ctx.fillRect(0, 0, 70, 20);

        ctx.translate(51, 0);
        ctx.fillStyle = this.couleur;
        ctx.rotate(0.2);
        ctx.fillRect(0, 0, 20, 50);

        ctx.translate(10, 60);
        ctx.fillStyle = this.couleur;
        ctx.rotate(-90);
        ctx.fillRect(0, 0, 20, 50);

        ctx.restore();
    }

    drawBouche(ctx, l = 25) {
        ctx.save();
    
        ctx.translate(50, 60);
        drawCircleImmediat(ctx, 0, 0, 30, "black");
    
        // les dents
        ctx.translate(0, -20);
    
        ctx.fillStyle = "white";
    
        ctx.rotate(-1);
        ctx.beginPath();
        ctx.moveTo(-25, -20);
        ctx.lineTo(-10, -20);
        ctx.lineTo(-17.5, -10);
        ctx.closePath();
        ctx.fill();
        ctx.rotate(1);
    
        ctx.rotate(1);
        ctx.beginPath();
        ctx.moveTo(10, -20);
        ctx.lineTo(25, -20);
        ctx.lineTo(17.5, -10);
        ctx.closePath();
        ctx.fill();
        ctx.rotate(-1);
    
        // la langue
        ctx.translate(0, 30);
        ctx.fillStyle = "pink";
        ctx.fillRect(-10, 0, 20, l);
    
        ctx.restore();
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }

    respawn(x, y, ratio = this.ratio) {
        this.x = x;
        this.y = y;
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.ratio = ratio;
    }
}