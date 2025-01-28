import { Moon, Earth, Sun } from "./body.js";
import { Orbit } from "./orbit.js";
import { mouseInCanvas, interpolate, draw2DText, Font } from "./utils.js";

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
        let camPos = p.createVector(1000, -120, -100);
        let camLook = p.createVector(350, 0, 0);
        let camUp = p.createVector(0, 1, 0);
        // let camPos = p.createVector(0, -1500, 0);
        // let camLook = p.createVector(0, 0, 0);
        // let camUp = p.createVector(0, 0, 1);
        let doAnimate = false;

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
            cam.camera(
                camPos.x, camPos.y, camPos.z,
                camLook.x, camLook.y, camLook.z,
                camUp.x, camUp.y, camUp.z
            );
            p.perspective(p.PI/3, p.width/p.height, 0.1, 2500);

            let sunPos = p.createVector(-900, 0, 0);
            sun = new Sun(p, sunPos, 150, 0);
            earth = new Earth(p, null, 60, 0);
            moon = new Moon(p, null, 15, 0);
            sunEarthOrbit = new Orbit(p, sun, earth, 1600, p.createVector(0, -1, 0));
            sunEarthOrbit.rev = -p.HALF_PI;
            let moonTiltAngle = p.radians(5);
            // let moonTiltVec = p.createVector(-p.sin(moonTiltAngle), -p.cos(moonTiltAngle), 0);
            let moonTiltVec = p.createVector(0, -1, 0);
            earthMoonOrbit = new Orbit(p, earth, moon, 400, moonTiltVec);
            earthMoonOrbit.setOrbitAngle(p.HALF_PI - quarter * p.HALF_PI);
            earthMoonOrbit.showPrimary = false;
            earthMoonOrbit.showOrbit();

            slider.size(p.width-10);

            sunEarthOrbit.render();

            // let earthToSunVec = sun.pos.copy().sub(earth.pos).normalize();
            // let currPos = earth.pos.copy().sub(earthToSunVec.mult(earthMoonOrbit.r*1.2));
            // currPos.sub(p.createVector(0, earth.r*1.2, 0));
            // let currLook = sun.pos.copy();
            // let currUp = p.createVector(0, 1, 0);

            // cam.camera(
            //     currPos.x, currPos.y, currPos.z,
            //     currLook.x, currLook.y, currLook.z,
            //     currUp.x, currUp.y, currUp.z
            // );
            // cam.camera(
            //     earth.pos.x+earth.r*2, earth.pos.y-earth.r*1.2, earth.pos.z,
            //     sun.pos.x, sun.pos.y, sun.pos.z,
            //     0, 1, 0
            // );
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
                earth.rotate(1);
                moon.rotate(1);
            } else {
                // p.fill(255, 255, 255, 200);
                // p.textFont(font.regular());
                // draw2DText(p, cam, "Click to start animation", 5, [0, -90]);
            }

            earth.rot = -slider.value() * rate;

            let earthToSunVec = sun.pos.copy().sub(earth.pos);

            let eFVec = earthToSunVec.copy().normalize();
            let eUVec = p.createVector(0, 1, 0);
            let eRVec = eFVec.copy().cross(eUVec);
            let currPos = earth.pos.copy()
                .sub(eFVec.mult(300))
                .sub(eUVec.mult(120))
                .add(eRVec.mult(100));
            let currLook = earth.pos.copy().add(earthToSunVec.mult(0.5));
            let currUp = p.createVector(0, 1, 0);

            cam.camera(
                currPos.x, currPos.y, currPos.z,
                currLook.x, currLook.y, currLook.z,
                currUp.x, currUp.y, currUp.z
            );

            earth.drawPerson(time, eRVec.normalize());

            p.fill(200);
            let captionText = "(Moon's orbit angle exaggerated to 20°)";
            p.textFont(font.italic());
            draw2DText(p, cam, captionText, 5, [0, 90]);

            p.orbitControl();
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
    };
};