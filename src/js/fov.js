import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { mouseInCanvas, interpolate, draw2DText, Font, getTimeText, Arrow, cameraAwareText } from "./utils.js";

const width = document.getElementById("main").getBoundingClientRect().width;

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
            // p.perspective(p.PI/3, p.width/p.height, 0.1, 2500);
            p.perspective(p.PI/2, p.width/p.height, 0.1, 3000);
            cam.ortho();

            let sunPos = p.createVector(-200, 0, 0);
            let sunSize = quarter === 0 ? 30 : 80;
            sun = new Sun(p, sunPos, sunSize, 0);
            earth = new Earth(p, null, 60, 0);
            moon = new Moon(p, null, 15, 0);
            let sunEarthDistance = quarter === 0 ? 400 : 500;
            sunEarthOrbit = new Orbit(p, sun, earth, sunEarthDistance, p.createVector(0, -1, 0));
            sunEarthOrbit.rev = -p.HALF_PI;
            let moonTiltAngle = p.radians(5);
            // let moonTiltVec = p.createVector(-p.sin(moonTiltAngle), -p.cos(moonTiltAngle), 0);
            let moonTiltVec = p.createVector(0, -1, 0);
            earthMoonOrbit = new Orbit(p, earth, moon, 200, moonTiltVec);
            earthMoonOrbit.setOrbitAngle(p.HALF_PI - quarter * p.HALF_PI);
            earthMoonOrbit.showPrimary = false;
            earthMoonOrbit.showOrbit();

            slider.size(p.width-10);

            sunEarthOrbit.render();

            [camPos, camLook, camUp] = getCamCoords();
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

            // earth.drawShadow(earthMoonOrbit.r*2);
            // moon.drawShadow(earthMoonOrbit.r);

            if (doAnimate) {
                let earthOrbitRate = rate/6;
                // sunEarthOrbit.revolve(earthOrbitRate);
                // earthMoonOrbit.revolve(earthOrbitRate * 12);
                // earth.light -= earthOrbitRate;
                // moon.light -= earthOrbitRate;
                // earth.rotate(1);
                moon.rotate(1);
            } else {
                // p.fill(255, 255, 255, 200);
                // p.textFont(font.regular());
                // draw2DText(p, cam, "Click to start animation", 5, [0, -90]);
            }

            earth.rot = -(time + slider.value()) * rate;
            currTime = time + slider.value();

            let [currPos, currLook, currUp] = getCamCoords();

            cam.camera(
                currPos.x, currPos.y, currPos.z,
                currLook.x, currLook.y, currLook.z,
                currUp.x, currUp.y, currUp.z
            );

            let eRVec = getERVec();
            earth.drawPerson(eRVec.normalize(), true);

            // p.fill(200);
            // let captionText = "(Moon's orbit angle exaggerated to 20°)";
            // p.textFont(font.italic());
            // draw2DText(p, cam, captionText, 5, [0, 90]);

            p.fill(200);
            p.textFont(font.regular());
            draw2DText(p, cam, getTimeText(currTime), 18, [0, -200]);

            p.textFont(font.italic());
            draw2DText(p, cam, "(Sizes and distances not to scale)", 12, [0, 210]);

            // let earthToSunVec = sun.pos.copy().sub(earth.pos).normalize();
            // let arrowPos = earth.pos.copy().add(earthToSunVec.copy().mult(earth.r*3));
            // let sunArrow = new Arrow(p, arrowPos, earthToSunVec, 20);
            // if (quarter === 2) {
            //     sunArrow.draw();
            //     p.textSize(10);
            //     p.fill("red");
            //     let arrowTextPos = arrowPos.copy().sub(earthToSunVec.mult(10));
            //     cameraAwareText(p, cam, "Sun", arrowTextPos);
            // }
        };

        p.mouseClicked = () => {
            // if (mouseInCanvas(p)) {
            //     doAnimate = !doAnimate;
            // }
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
            // return [
            //     p.createVector(0, -1000, 0),
            //     p.createVector(0, 0, 0),
            //     p.createVector(0, 0, 1)
            // ];

            let earthToSunVec = sun.pos.copy().sub(earth.pos);
            let eFVec = earthToSunVec.copy().normalize();
            let eUVec = p.createVector(0, 1, 0);
            let eRVec = eFVec.copy().cross(eUVec);
            
            let currPos = earth.pos.copy();
            let newMoon = quarter === 0;
            currPos
                .sub(eFVec.mult(newMoon ? 300 : -400))
                .sub(eUVec.mult(newMoon ? 120 : 120))
                .add(eRVec.mult(newMoon ? 100 : 100));
            let currLook = newMoon
                ? earth.pos.copy().add(earthToSunVec.mult(0.5))
                : earth.pos.copy();
            let currUp = p.createVector(0, 1, 0);

            return [currPos, currLook, currUp];
        }
    };
};