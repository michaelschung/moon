import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { Arrow } from "./utils.js";

export const moonPhases = (p) => {
    let moon;
    let angle = p.HALF_PI;
    let rate = p.TWO_PI/80;

    p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL);

        p.noStroke();
        p.frameRate(10);

        let moonPos = p.createVector(0, 0, 0);
        moon = new Moon(p, moonPos, 100, 0);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        // Rotate around y-axis to follow same face of moon
        p.rotateY(angle);
        angle -= rate;

        // Moon rotates relative to light source
        moon.draw();
        moon.rotate(1);
    };
};

export const moonRevolve = (p) => {
    let earth;
    let moon;
    let earthMoonOrbit;
    let cam;
    let rate = p.TWO_PI/80;
    let sunArrow;

    p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL);
        p.noStroke();
        p.frameRate(10);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 40, 0, 80, p.PI);

        let moonPos = p.createVector(0, 0, 0);
        moon = new Moon(p, moonPos, 10, 0, 80, p.PI);

        earthMoonOrbit = new Orbit(p, earth, moon, 180, p.createVector(1, 5, 0));

        cam = p.createCamera();
        cam.ortho();
        // (x, y, z, centerX, centerY, centerZ, upX, upY, upZ)
        cam.camera(0, 400, 0, 0, 0, 0, 0, 0, -1);

        let arrowPos = p.createVector(-300, 0, 0);
        let arrowDir = p.createVector(-1, 0, 0);
        sunArrow = new Arrow(p, arrowPos, arrowDir, 40);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        earthMoonOrbit.render();
        earthMoonOrbit.revolve(rate);
        earth.rotate(28);
        moon.rotate(1);

        sunArrow.draw();

        p.orbitControl();
    };
};