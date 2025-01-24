import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { Arrow, cameraAwareText, rotateToCamera, mouseInCanvas, interpolate } from "./utils.js";

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
    let font;
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

        font = p.loadFont("/assets/TimesNewRoman.ttf");
        p.textFont(font);

        cam = p.createCamera();
        cam.camera(0, -800, 0, 0, 0, 0, 0, 0, 1);
        p.perspective(p.PI/5, p.width/p.height, 0.1, 1000);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 60, 0, 80);
        moon = new Moon(p, null, 15, 0, 80);
        earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0.1, -1, 0));
        earthMoonOrbit.showOrbit();
    };

    function getText() {
        let revAngle = totalRotate % p.TWO_PI;
        if (revAngle < p.HALF_PI) return "new moon";
        else if (revAngle < p.PI) return "first quarter";
        else if (revAngle < p.PI*3/2) return "full moon";
        else return "third quarter";
    }

    function drawButton() {
        p.push();
        p.translate(0, 0, 0);
        rotateToCamera(p, cam);
        p.fill(100);
        p.rect(200, 200, 50);
        p.pop();
    }

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
            p.textSize(15);
            p.fill("white");
            // Position text 30% of the way to the earth
            let earthDir = earth.pos.copy().sub(moon.pos);
            let textPos = moon.pos.copy().add(earthDir.mult(0.3));
            cameraAwareText(p, cam, getText(), textPos);
        }
    };

    p.mouseClicked = () => {
        if (mouseInCanvas(p) && !isMoving) {
            isMoving = true;
            nextStop += p.HALF_PI;
        }
    };
};

export const quarterView = (quarter) => {
    return (p) => {
        let cam;
        let font;
        let earth;
        let moon;
        let earthMoonOrbit;
        let slider;
        let camPos = p.createVector(0, -800, 0);
        let camLook = p.createVector(0, 0, 0);
        let camUp = p.createVector(0, 0, 1);

        p.setup = () => {
            p.createCanvas(400, 400, p.WEBGL);
            p.noStroke();
            p.frameRate(10);

            font = p.loadFont("/assets/TimesNewRoman.ttf");
            p.textFont(font);

            cam = p.createCamera();
            cam.camera(
                camPos.x, camPos.y, camPos.z,
                camLook.x, camLook.y, camLook.z,
                camUp.x, camUp.y, camUp.z
            );
            p.perspective(p.PI/5, p.width/p.height, 0.1, 1000);

            let earthPos = p.createVector(0, 0, 0);
            earth = new Earth(p, earthPos, 60, 0, 80);
            moon = new Moon(p, null, 15, 0, 80);
            earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0, -1, 0));
            earthMoonOrbit.setOrbitAngle(p.HALF_PI - quarter * p.HALF_PI);
            earthMoonOrbit.showOrbit();

            slider = p.createSlider(0, 100, 0);
            slider.size(p.width-10);
            let canvasPos = p.canvas.getBoundingClientRect();
            slider.position(canvasPos.left+2, canvasPos.bottom + 10);
        };

        p.draw = () => {
            p.background(0);
            p.randomSeed(1);

            earthMoonOrbit.render();

            // End on the surface of the Earth closest to Moon
            let earthToMoonVec = moon.pos.copy().sub(earth.pos).normalize();
            let endPos = earth.pos.copy().add(earthToMoonVec.mult(earth.r+1));
            let endLook = moon.pos.copy();
            let endUp = p.createVector(0, 1, 0);

            let currPos = interpolate(p, camPos, endPos, slider);
            let currLook = interpolate(p, camLook, endLook, slider);
            // TODO: generalize this to "lining up with bottom of camera" instead
            // of assuming the bottom of the camera always coincides with Q1
            let isQ1 = p.abs(earthMoonOrbit.rev, p.PI) < p.PI/8;
            let currUp = interpolate(p, camUp, endUp, slider, isQ1);

            cam.camera(
                currPos.x, currPos.y, currPos.z,
                currLook.x, currLook.y, currLook.z,
                currUp.x, currUp.y, currUp.z
            );

            let textPos = moon.pos.copy();
            let currCamUp = p.createVector(cam.upX, cam.upY, cam.upZ);
            textPos.add(currCamUp.mult(30));
            let size = p.map(slider.value(), slider.elt.min, slider.elt.max, 20, 5);
            p.textSize(size);
            cameraAwareText(p, cam, getText(), textPos);
        };

        function getText() {
            if (quarter == 0) return "new moon";
            if (quarter == 1) return "first quarter";
            if (quarter == 2) return "full moon";
            return "third quarter";
        }
    };
};