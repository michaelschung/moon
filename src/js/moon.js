import { Moon } from "./utils.js";

export const moonRotate = (p) => {
    let moon;

    p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL);
        p.noStroke();

        moon = new Moon(p, p.createVector(0, 0, 0), 100, 0, 0.2);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        moon.draw();
        moon.rotate(0.01);
        
        p.orbitControl(2);
    };
};