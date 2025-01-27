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
        moon.draw();

        let earthToMoonVec = moon.pos.copy().sub(earth.pos).normalize();
        let endPos = earth.pos.copy().add(earthToMoonVec.mult(earth.r+1));
        let endLook = moon.pos.copy();
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
    };

    p.hideSlider = () => {
        slider.hide();
    };

    p.showSlider = () => {
        slider.show();
    };
};