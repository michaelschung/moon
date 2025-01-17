import { Moon, drawMoon } from "./utils.js";

export const moonRotate = (p) => {
    let moonPos;
    let moonRot;

    p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL);
        p.noStroke();

        moonPos = p.createVector(0, 0, 0);
        moonRot = 0;
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        moonRot += 0.01;

        // (pos, radius, rotation, resolution)
        drawMoon(p, moonPos, 100, moonRot, 0.2);
        p.orbitControl(2);
    };
};