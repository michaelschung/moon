import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { cameraAwareText, mouseInCanvas, interpolate, rotateToCamera, draw2DText } from "./utils.js";

export const lunarEclipse = (p) => {
    let cam;
    let font;
    let sun;
    let earth;
    let moon;
    let sunEarthOrbit;
    let earthMoonOrbit;
    let rate = p.TWO_PI/80;
    let slider;
    let camPos = p.createVector(0, -1000, 0);
    let camLook = p.createVector(0, 0, 0);
    let camUp = p.createVector(0, 0, 1);

    p.setup = () => {
        p.createCanvas(600, 200, p.WEBGL);
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
        // cam.camera(461, 0, 0, 600, 0, 0, 0, 1, 0);
        p.perspective(p.PI/6, p.width/p.height, 0.1, 2000);

        let sunPos = p.createVector(-500, 0, 0);
        sun = new Sun(p, sunPos, 100, 0);
        earth = new Earth(p, null, 60, 0);
        moon = new Moon(p, null, 15, 0);
        sunEarthOrbit = new Orbit(p, sun, earth, 900, p.createVector(0, -1, 0));
        sunEarthOrbit.rev = -p.HALF_PI;
        earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0, -1, 0));
        earthMoonOrbit.rev = -p.HALF_PI;

        slider = p.createSlider(0, 100, 0);
        slider.size(p.width-10);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        let canvasPos = p.canvas.getBoundingClientRect();
        slider.position(
            canvasPos.left + window.scrollX + 2, // Add horizontal scroll offset
            canvasPos.top + window.scrollY + p.height + 10  // Add vertical scroll offset
        );

        let pos = p.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
        if (pos.dist(earth.pos) > earth.r) {
            sunEarthOrbit.render();
            earthMoonOrbit.render();
        }
        earth.drawShadow(earthMoonOrbit.r*2);
        moon.draw();

        // sunEarthOrbit.revolve(rate);
        // earth.light -= rate;

        let earthToSunVec = sun.pos.copy().sub(earth.pos);
        let endPos = p.createVector(
            earth.pos.x + earthToSunVec.x/5,
            earth.pos.y - earth.r*1.5,
            earth.pos.z + earth.r*2
        );
        let earthToMoonVec = moon.pos.copy().sub(earth.pos);
        let endLook = moon.pos.copy().sub(earthToMoonVec.mult(0.5));
        let endUp = p.createVector(0, 1, 0);

        let currPos = interpolate(p, camPos, endPos, slider);
        let currLook = interpolate(p, camLook, endLook, slider);
        let currUp = interpolate(p, camUp, endUp, slider);

        cam.camera(
            currPos.x, currPos.y, currPos.z,
            currLook.x, currLook.y, currLook.z,
            currUp.x, currUp.y, currUp.z
        );

        // let lookVec = currLook.copy().sub(currPos).normalize();
        // let textPos = currPos.copy().add(lookVec.mult(200));
        // textPos.add(currUp.copy().normalize().mult(30));
        // cameraAwareText(p, cam, "(distances not to scale)", textPos);
        p.fill(200);
        draw2DText(p, cam, "(distances not to scale)", 1, [0, 8]);

        p.orbitControl();
    };

    p.hideSlider = () => {
        slider.hide();
    };

    p.showSlider = () => {
        slider.show();
    };
};

export const testShadow = (p) => {
    let cam;
    let font;
    let earth;
    let moon;
    let earthMoonOrbit;
    let rate = p.TWO_PI/80;

    p.setup = () => {
        p.createCanvas(600, 400, p.WEBGL);
        p.noStroke();
        p.frameRate(10);

        font = p.loadFont("/assets/TimesNewRoman.ttf");
        p.textFont(font);

        cam = p.createCamera();
        cam.camera(0, 0, 400, 0, 0, 0, 0, 1, 0);
        p.perspective(p.PI/5, p.width/p.height, 0.1, 1000);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 60, 0, 80);
        moon = new Moon(p, null, 15, 0, 80);
        earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0, -1, 0));
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        earth.draw();
        earth.drawShadow(earth.r);
        earth.rotate(1);

        p.orbitControl();
    };
};