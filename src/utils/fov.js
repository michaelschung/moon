import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { mouseInCanvas, interpolate, draw2DText, Font, getTimeText, setCamera } from "./utils.js";

const mainElement = document.getElementById("main");
const width = mainElement.getBoundingClientRect().width;
const em = parseFloat(getComputedStyle(mainElement).fontSize);

export const timeView = (quarter, time) => {
    return (p) => {
        let cam;
        let font;
        let sun;
        let earth;
        let moon;
        let sunEarthOrbit;
        let earthMoonOrbit;
        let rate = p.TWO_PI/80;
        let slider;
        let camPos, camLook, camUp;
        let doAnimate = false;
        let currTime = time;

        p.preload = () => {
            font = new Font(p, "Roboto", true);
            slider = p.createSlider(0, 80, 0);
        }

        p.setup = () => {
            p.createCanvas(width, width*2/3, p.WEBGL);
            p.noStroke();
            p.frameRate(10);

            p.textFont(font.regular());

            cam = p.createCamera();
            p.perspective(p.PI/2, p.width/p.height, 0.1, 1000);
            cam.ortho(-width/2, width/2, -p.height/2, p.height/2, -1000, 1000);

            let sunPos = p.createVector(-200, 0, 0);
            let sunSize = quarter === 0 ? 30 : 80;
            sun = new Sun(p, sunPos, sunSize, 0);
            earth = new Earth(p, null, 60, 0);
            moon = new Moon(p, null, 15, 0);
            let sunEarthDistance = quarter === 0 ? 600 : 500;
            sunEarthOrbit = new Orbit(p, sun, earth, sunEarthDistance, p.createVector(0, -1, 0));
            sunEarthOrbit.rev = -p.HALF_PI;
            let moonTiltVec = p.createVector(0, -1, 0);
            earthMoonOrbit = new Orbit(p, earth, moon, 200, moonTiltVec);
            earthMoonOrbit.setOrbitAngle(p.HALF_PI - quarter * p.HALF_PI);
            earthMoonOrbit.showPrimary = false;
            earthMoonOrbit.showOrbit();

            slider.size(p.width-10);

            sunEarthOrbit.render();

            [camPos, camLook, camUp] = getCamCoords();
            setCamera(cam, camPos, camLook, camUp);
        };

        p.draw = () => {
            p.background(0);
            p.randomSeed(1);

            let canvasPos = p.canvas.getBoundingClientRect();
            slider.position(
                canvasPos.left + window.scrollX + 2,
                canvasPos.top + window.scrollY + p.height + 10
            );

            sunEarthOrbit.render();
            earthMoonOrbit.render();

            earth.rot = -(time + slider.value()) * rate;
            currTime = time + slider.value();

            setCamera(cam, ...getCamCoords());

            earth.drawPerson(true);

            p.fill(200);
            p.textFont(font.regular());
            draw2DText(p, cam, getTimeText(currTime), 18, [0, -width*0.28]);

            p.textFont(font.italic());
            draw2DText(p, cam, "(Sizes and distances not to scale)", 12, [0, width*0.3]);
        };

        p.stopAnimation = () => {
            doAnimate = false;
        };

        p.hideSlider = () => {
            if (slider) slider.hide();
        };

        p.showSlider = () => {
            if (slider) slider.show();
        };

        function getERVec() {
            let earthToSunVec = sun.pos.copy().sub(earth.pos);
            let eFVec = earthToSunVec.copy().normalize();
            let eUVec = p.createVector(0, 1, 0);
            let eRVec = eFVec.copy().cross(eUVec);
            return eRVec;
        }

        function getCamCoords() {
            let earthToSunVec = sun.pos.copy().sub(earth.pos);
            let eFVec = earthToSunVec.copy().normalize();
            let eUVec = p.createVector(0, 1, 0);
            let eRVec = eFVec.copy().cross(eUVec);
            
            let currPos = earth.pos.copy();
            let newMoon = quarter === 0;
            currPos
                .sub(eFVec.mult(newMoon ? 300 : -400))
                .sub(eUVec.mult(newMoon ? 150 : 120))
                .add(eRVec.mult(newMoon ? 120 : 150));
            let currLook = newMoon
                ? earth.pos.copy().add(earthToSunVec.mult(0.5))
                : earth.pos.copy();
            let currUp = p.createVector(0, 1, 0);

            return [currPos, currLook, currUp];
        }
    };
};

export const everythingView = (p) => {
    let cam;
    let font;
    let sun;
    let earth;
    let moon;
    let sunEarthOrbit;
    let earthMoonOrbit;
    let rate = p.TWO_PI/80;
    let slider;
    let vSlider;
    let camPos, camLook, camUp;
    let doAnimate = false;
    let currTime = 0;

    // Moon revolve stuff
    let totalRotate = 0;

    p.preload = () => {
        font = new Font(p, "Roboto", true);
        slider = p.createSlider(0, 80, 0);
        vSlider = p.createSlider(0, 100, 0);
    }

    p.setup = () => {
        p.createCanvas(width-em*1.5, width-em*1.5, p.WEBGL);
        p.noStroke();
        p.frameRate(10);

        p.textFont(font.regular());

        cam = p.createCamera();
        p.perspective(p.PI/2, p.width/p.height, 0.1, 3000);
        // cam.ortho(-p.width/2, p.width/2, -p.height/2, p.height/2, -1000, 2000);

        let sunPos = p.createVector(-800, 0, 0);
        sun = new Sun(p, sunPos, 100, 0);
        earth = new Earth(p, null, 60, 0);
        moon = new Moon(p, null, 15, 0);
        let sunEarthDistance = 1600;
        sunEarthOrbit = new Orbit(p, sun, earth, sunEarthDistance, p.createVector(0, -1, 0));
        sunEarthOrbit.rev = -p.HALF_PI;
        let moonTiltVec = p.createVector(0, -1, 0);
        earthMoonOrbit = new Orbit(p, earth, moon, 200, moonTiltVec);
        earthMoonOrbit.setOrbitAngle(p.HALF_PI);
        earthMoonOrbit.showPrimary = false;
        earthMoonOrbit.showOrbit();

        slider.size(p.width-10);
        vSlider.size(p.height-10);
        vSlider.style('transform', 'rotate(-90deg)');
        vSlider.style('transform-origin', 'left top');

        sunEarthOrbit.render();

        [camPos, camLook, camUp] = getCamCoords();
        setCamera(cam, camPos, camLook, camUp);
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);

        let canvasPos = p.canvas.getBoundingClientRect();
        slider.position(
            canvasPos.left + window.scrollX + 2,
            canvasPos.top + window.scrollY + p.height + 10
        );
        vSlider.position(
            canvasPos.right + window.scrollX + 10,
            canvasPos.top + window.scrollY + p.height - 4
        );

        sunEarthOrbit.render();
        earthMoonOrbit.render();

        currTime = slider.value();
        earth.rot = -currTime * rate;

        let overPos = p.createVector(-300, -1000, -300);
        let overLook = p.createVector(0, 0, 0);
        let overUp = p.createVector(-1, 0, -1).normalize();

        let currPos = interpolate(p, camPos, overPos, vSlider);
        let currLook = interpolate(p, camLook, overLook, vSlider);
        let currUp = interpolate(p, camUp, overUp, vSlider);

        setCamera(cam, currPos, currLook, currUp);

        if (mouseInCanvas(p) && p.mouseIsPressed) {
            earthMoonOrbit.revolve(rate);
            moon.rotate(1);
            totalRotate += rate;
        } else {
            p.textFont(font.italic());
            draw2DText(p, cam, "Hold mouse to move Moon", 4, [0, 90]);
        }
        
        earth.drawPerson(true);

        p.fill(200);
        p.textFont(font.regular());
        draw2DText(p, cam, getTimeText(currTime), 6, [0, -90]);
    };

    p.stopAnimation = () => {
        doAnimate = false;
    };

    p.hideSlider = () => {
        if (slider) slider.hide();
        if (vSlider) vSlider.hide();
    };

    p.showSlider = () => {
        if (slider) slider.show();
        if (vSlider) vSlider.show();
    };

    function getERVec() {
        let earthToSunVec = sun.pos.copy().sub(earth.pos);
        let eFVec = earthToSunVec.copy().normalize();
        let eUVec = p.createVector(0, 1, 0);
        let eRVec = eFVec.copy().cross(eUVec);
        return eRVec;
    }

    function getCamCoords() {
        let earthToSunVec = sun.pos.copy().sub(earth.pos);
        let eFVec = earthToSunVec.copy().normalize();
        let eUVec = p.createVector(0, 1, 0);
        let eRVec = eFVec.copy().cross(eUVec);
        
        let currPos = earth.pos.copy();
        currPos
            .sub(eFVec.mult(300))
            .sub(eUVec.mult(50))
            .add(eRVec.mult(150));
        let currLook = earth.pos.copy().add(earthToSunVec.mult(0.1));
        // let currLook = earth.pos.copy();
        let currUp = p.createVector(0, 1, 0);

        return [currPos, currLook, currUp];
    }
};