import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";

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

export const moonOrbit = (p) => {
    let earth;
    let moon;
    let earthMoonOrbit;

    p.setup = () => {
        p.createCanvas(800, 800, p.WEBGL);
        p.noStroke();
        // p.frameRate(10);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 50, 0);

        let moonPos = p.createVector(0, 0, 0);
        moon = new Moon(p, moonPos, 30, 0);

        earthMoonOrbit = new Orbit(p, earth, moon, 300, p.createVector(0, 0, 0));
    };

    p.draw = () => {
        p.background(20);
        p.randomSeed(1);

        earthMoonOrbit.render();
        earthMoonOrbit.revolve(0.01);

        p.orbitControl(2);
    };
}