import { Moon, Earth, Sun } from "./utils.js";

export const moonRotate = (p) => {
    let moon;
    let earth;
    let sun;

    p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL);
        p.noStroke();

        let moonPos = p.createVector(100, 0, 0);
        moon = new Moon(p, moonPos, 50, 0);

        let earthPos = p.createVector(-100, 0, 0);
        earth = new Earth(p, earthPos, 100, 0);

        let sunPos = p.createVector(0, 0, -500);
        sun = new Sun(p, sunPos, 300, 0);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        moon.draw();
        earth.draw();
        sun.draw();
        moon.rotate(0.2);
        earth.rotate(0.1);
        sun.rotate(0.01);

        p.orbitControl(2);
    };
};

export const moonRotateFast = (p) => {
    let moon;

    p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL);
        p.noStroke();

        let moonPos = p.createVector(0, 0, 0);
        moon = new Moon(p, moonPos, 100, 0, 0.2);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        moon.draw();
        moon.rotate(0.1);
    };
}