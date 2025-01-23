import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { Arrow, cameraAwareText, rotateToCamera, worldAxes } from "./utils.js";

export const moonPhases = (p) => {
    let moon;
    let angle = -p.HALF_PI;
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
    let font;

    p.setup = () => {
        p.createCanvas(800, 400, p.WEBGL);
        p.noStroke();
        p.frameRate(10);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 40, 0, 80);

        moon = new Moon(p, null, 10, 0, 80);

        earthMoonOrbit = new Orbit(p, earth, moon, 180, p.createVector(0, -1, 0));

        cam = p.createCamera();
        cam.ortho();
        // (above earth, looking at earth, up=+z bc z is backwards)
        cam.camera(0, -400, 0, 0, 0, 0, 0, 0, 1);

        let arrowPos = p.createVector(-300, 0, 0);
        let arrowDir = p.createVector(-1, 0, 0);
        sunArrow = new Arrow(p, arrowPos, arrowDir, 30);

        font = p.loadFont("/assets/TimesNewRoman.ttf");
        p.textFont(font);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        earthMoonOrbit.render();
        earthMoonOrbit.revolve(rate);
        earth.rotate(28);
        moon.rotate(1);

        sunArrow.draw();

        p.textSize(20);
        p.fill("red");
        cameraAwareText(p, cam, "Sun", p.createVector(-290, 0, 0), 1);
    };
};

export const moonQuarters = (p) => {
    let cam;
    let earth;
    let moon;
    let earthMoonOrbit;
    let rate = p.TWO_PI/80;
    let totalRotate = 0;
    let nextStop = 0;
    let isMoving = false;

    p.setup = () => {
        p.createCanvas(600, 600, p.WEBGL);
        p.noStroke();
        p.frameRate(10);

        cam = p.createCamera();
        cam.camera(0, -800, 0, 0, 0, 0, 0, 0, 1);
        p.perspective(p.PI/5, p.width/p.height, 0.1, 1000);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 60, 0, 80);
        moon = new Moon(p, null, 15, 0, 80);
        earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0.1, -1, 0));
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        earthMoonOrbit.render();

        if (isMoving) {
            earthMoonOrbit.revolve(rate);
            earth.rotate(28);
            moon.rotate(1);
            totalRotate += rate;
            // Moon stops moving when it hits the "next stop"
            isMoving = totalRotate < nextStop;
        } else {

        }
    };

    p.mouseClicked = () => {
        if (!isMoving) {
            isMoving = true;
            nextStop += p.HALF_PI;
        }
    };
};