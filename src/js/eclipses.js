import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { cameraAwareText, mouseInCanvas, interpolate, rotateToCamera, draw2DText, alignWithVector } from "./utils.js";

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
        p.perspective(p.PI/6, p.width/p.height, 0.1, 2000);

        let sunPos = p.createVector(-550, 0, 0);
        sun = new Sun(p, sunPos, 100, 0);
        earth = new Earth(p, null, 60, 0);
        moon = new Moon(p, null, 15, 0);
        sunEarthOrbit = new Orbit(p, sun, earth, 950, p.createVector(0, -1, 0));
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

        p.fill(200);
        draw2DText(p, cam, "(Sizes and distances not to scale)", 4, [0, 20]);
    };

    p.hideSlider = () => {
        slider.hide();
    };

    p.showSlider = () => {
        slider.show();
    };
};

export const solarEclipse = (p) => {
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
        p.perspective(p.PI/6, p.width/p.height, 0.1, 2000);

        let sunPos = p.createVector(-550, 0, 0);
        sun = new Sun(p, sunPos, 100, 0);
        earth = new Earth(p, null, 60, 0);
        moon = new Moon(p, null, 15, 0);
        sunEarthOrbit = new Orbit(p, sun, earth, 950, p.createVector(0, -1, 0));
        sunEarthOrbit.rev = -p.HALF_PI;
        earthMoonOrbit = new Orbit(p, earth, moon, 190, p.createVector(0, -1, 0));

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
        moon.drawShadow(earthMoonOrbit.r);
        moon.draw();

        let earthToSunVec = sun.pos.copy().sub(earth.pos).normalize();
        let endPos = earth.pos.copy().add(earthToSunVec.mult(earth.r+1));
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

        p.fill(200);
        draw2DText(p, cam, "(Sizes and distances not to scale)", 4, [0, 20]);
    };

    p.hideSlider = () => {
        slider.hide();
    };

    p.showSlider = () => {
        slider.show();
    };
}

export const allEcliptic = (p) => {
    let cam;
    let font;
    let sun;
    let earth;
    let moon;
    let sunEarthOrbit;
    let earthMoonOrbit;
    let rate = p.TWO_PI/80;
    let slider;
    let camPos = p.createVector(0, -1500, 0);
    let camLook = p.createVector(0, 0, 0);
    let camUp = p.createVector(0, 0, 1);
    let doAnimate = false;

    p.setup = () => {
        p.createCanvas(600, 600, p.WEBGL);
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
        p.perspective(p.PI/2, p.width/p.height, 0.1, 2000);

        let sunPos = p.createVector(0, 0, 0);
        sun = new Sun(p, sunPos, 100, 0);
        earth = new Earth(p, null, 60, 0);
        moon = new Moon(p, null, 15, 0);
        sunEarthOrbit = new Orbit(p, sun, earth, 950, p.createVector(0, -1, 0));
        sunEarthOrbit.rev = -p.HALF_PI;
        earthMoonOrbit = new Orbit(p, earth, moon, 190, p.createVector(0, -1, 0));

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

        sunEarthOrbit.render();
        earthMoonOrbit.render();
        earth.drawShadow(earthMoonOrbit.r*2);
        moon.drawShadow(earthMoonOrbit.r);
        sunEarthOrbit.drawOrbitalPlane(p.color(0, 150, 255, 40));

        if (doAnimate) {
            let earthOrbitRate = rate/6;
            sunEarthOrbit.revolve(earthOrbitRate);
            earthMoonOrbit.revolve(earthOrbitRate * 12);
            earth.light -= earthOrbitRate;
            moon.light -= earthOrbitRate;
            earth.rotate(12);
            moon.rotate(1);
        } else {
            p.fill(255, 255, 255, 200);
            draw2DText(p, cam, "Click to start animation", 5, [0, -90]);
        }

        let endPos = sun.pos.copy().sub(p.createVector(0, sun.r*1.2, 0));
        let endLook = earth.pos.copy();
        let endUp = p.createVector(0, 1, 0);

        let currPos = interpolate(p, camPos, endPos, slider);
        let currLook = interpolate(p, camLook, endLook, slider);
        let currUp = interpolate(p, camUp, endUp, slider);

        cam.camera(
            currPos.x, currPos.y, currPos.z,
            currLook.x, currLook.y, currLook.z,
            currUp.x, currUp.y, currUp.z
        );

        p.fill(200);
        draw2DText(p, cam, "(Sizes and distances not to scale)", 4, [0, 90]);
    };

    p.mouseClicked = () => {
        if (mouseInCanvas(p)) {
            doAnimate = !doAnimate;
        }
    };

    p.stopAnimation = () => {
        doAnimate = false;
    };

    p.hideSlider = () => {
        slider.hide();
    };

    p.showSlider = () => {
        slider.show();
    };
}
