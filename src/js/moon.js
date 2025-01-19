import { Moon, Earth, Sun } from "./utils.js";

export const moonRotate = (p) => {
    let cam;
    let moon;
    let earth;
    // let sun;

    p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL);
        // Default position (0, 0, 800) - seems false
        cam = p.createCamera();
        cam.setPosition(0, 0, 350);

        p.noStroke();
        p.frameRate(10);

        let moonPos = p.createVector(100, 0, 0);
        moon = new Moon(p, moonPos, 50, 0);

        let earthPos = p.createVector(-100, 0, 0);
        earth = new Earth(p, earthPos, 100, 0);

        // let sunPos = p.createVector(0, 0, -500);
        // sun = new Sun(p, sunPos, 300, 0);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        moon.draw();
        moon.rotate(1);
        earth.draw();
        earth.rotate(2);
        // sun.draw();
        // sun.rotate(0.01);

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