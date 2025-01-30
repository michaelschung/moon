// Purely just a template for a new 3D sketch
export const sketchTemplate = (p) => {
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
        cam.camera(0, -800, 0, 0, 0, 0, 0, 0, 1);
        p.perspective(p.PI/5, p.width/p.height, 0.1, 1000);

        let earthPos = p.createVector(0, 0, 0);
        earth = new Earth(p, earthPos, 60, 0, 80);
        moon = new Moon(p, null, 15, 0, 80);
        earthMoonOrbit = new Orbit(p, earth, moon, 200, p.createVector(0, -1, 0));
    };

    p.draw = () => {
        p.background(0);
        p.randomSeed(1);
    };
};

export function setCamera(cam, pos, look, up) {
    cam.camera(
        pos.x, pos.y, pos.z,
        look.x, look.y, look.z,
        up.x, up.y, up.z
    );
}

export function getTimeText(time) {
    time %= 80;
    let hourNum = Math.floor(time / 80 * 24) % 24;
    // time -= hourNum * 80/24;
    let minNum = Math.round((time-hourNum*80/24) * 18 % 60);
    let hour = hourNum % 12 === 0
        ? "12"
        : String(hourNum % 12);
    let min = String(minNum).padStart(2, 0);
    let meridian = hourNum < 12 ? "AM" : "PM";
    let extra = "";
    if (time === 0) {
        extra = "\n(midnight)"
    } else if (time === 40) {
        extra = "\n(noon)"
    }
    return `${hour}:${min} ${meridian}${extra}`;
};

/**
 * Interpolates between two vectors based on slider value
 * 
 * @param {object} p - The p5 instance
 * @param {p5.Vector} start - Start vector
 * @param {p5.Vector} end - End vector
 * @param {object} slider - Slider to base the interpolation
 * @returns Interpolated vector between start and end
 */
export function interpolate(p, start, end, slider, isQ1=false) {
    let sliderRange = slider.elt.max - slider.elt.min;
    let newStart = start.copy();
    let newEnd = end.copy();
    // Default interpolation (a.k.a. not first quarter)
    let step = p.map(slider.value(), slider.elt.min, slider.elt.max, 0, 1);
    // Change start, end, step if we're in first quarter
    if (isQ1) {
        if (slider.value() < sliderRange/2) {
            newStart = start.copy();
            newEnd = p.createVector(1, 1, 0);
            step = p.map(slider.value(), slider.elt.min, sliderRange/2, 0, 1);
        } else {
            newStart = p.createVector(1, 1, 0);
            newEnd = p.createVector(0, 1, 0);
            step = p.map(slider.value()-sliderRange/2, slider.elt.min, sliderRange/2, 0, 1);
        }
    }
    return newStart.copy().lerp(newEnd, step);
}

/**
 * Checks if the mouse is within the canvas for the given p5 instance.
 * 
 * @param {object} p - The p5 instance
 * @returns Boolean indicating whether the mouse is within the canvas
 */
export function mouseInCanvas(p) {
    let xRange = p.mouseX >= 0 && p.mouseX < p.width;
    let yRange = p.mouseY >= 0 && p.mouseY < p.height;
    return xRange && yRange;
}

/**
 * Draws "2D" text that stays in the same place regardless of camera position
 * or movement.
 * 
 * @param {object} p - The p5 instance
 * @param {p5.Camera} cam - Camera that the text must face
 * @param {string} text - Text to display
 * @param {number} size - Size of the text
 * @param {[number]} offset - X- and Y-offsets (from canvas center)
 */
export function draw2DText(p, cam, text, size, offset=[0, 0]) {
    let camLook = p.createVector(cam.centerX, cam.centerY, cam.centerZ);
    let camPos = p.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
    let camLookVec = camLook.sub(camPos).normalize();
    let textPos = camPos.copy().add(camLookVec.mult(100));
    p.textSize(size);
    cameraAwareText(p, cam, text, textPos, p.CENTER, offset);
}

/**
 * Draws text that always faces the camera.
 * 
 * @param {object} p - The p5 instance
 * @param {p5.Camera} cam - Camera that the text must face
 * @param {string} text - Text to display
 * @param {p5.Vector} pos - Position of the text in 3D space
 * @param {*} alignMode - p.CENTER, p.LEFT, or p.RIGHT
 * @param {[number]} offset - X- and Y-offsets (from pos)
 */
export function cameraAwareText(p, cam, text, pos, alignMode=null, offset=[0, 0]) {
    p.push();
    if (alignMode) p.textAlign(alignMode);
    p.translate(pos);
    rotateToCamera(p, cam);
    let textW = p.textWidth(text);
    let textH = p.textAscent();
    let x = alignMode == p.CENTER ? 0 : -textW/2 + offset[0];
    let y = textH/2 + offset[1];
    p.text(text, x, y);
    p.pop();
}

/**
 * Rotates world axes to align z-axis with given vector.
 * No specific orientation; only good for drawing shapes at origin.
 * 
 * @param {object} p - The p5 instance
 * @param {p5.Vector} vec - The vector to align z-axis with
 */
export function alignWithVector(p, vec) {
    let nHat = vec;
    let w = p.createVector(1, 1, 1);
    let uHat = nHat.cross(w).normalize();
    let vHat = nHat.cross(uHat).normalize();
    let matrix = [
        uHat.x, uHat.y, uHat.z, 0,
        vHat.x, vHat.y, vHat.z, 0,
        nHat.x, nHat.y, nHat.z, 0,
        0,      0,      0,      1
    ];
    p.applyMatrix(...matrix);
}

/**
 * Rotates the world axes to "face" the camera.
 * Generally will want to push and pop around this.
 * 
 * @param {object} p - The p5 instance
 * @param {p5.Camera} cam - The camera to face
 * @param {[number]} options - Option to flip a given axis: [x, y, z]
 */
export function rotateToCamera(p, cam, options=[1, 1, 1]) {
    // Retrieve the cam's position, up, and look vectors
    let camPos = p.createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
    let camUp = p.createVector(-cam.upX, -cam.upY, -cam.upZ);
    let camLook = p.createVector(cam.centerX, cam.centerY, cam.centerZ);
    let camLookVec = camLook.copy().sub(camPos).normalize();

    // Compute the +z vector (opposite of cam's +z)
    let zPosVec = camLookVec.copy().mult(-1);
    zPosVec.normalize().mult(options[2]);

    // Compute the +x vector as the cross product of cam's up and +z
    let xPosVec = zPosVec.copy().cross(camUp);
    xPosVec.normalize().mult(options[0]);

    // Compute the +y vector as the cross product of +x and +z
    let yPosVec = zPosVec.copy().cross(xPosVec);
    yPosVec.normalize().mult(options[1]);

    // Create a rotation matrix to align the world with the camera
    let matrix = [
        xPosVec.x, xPosVec.y, xPosVec.z, 0,
        yPosVec.x, yPosVec.y, yPosVec.z, 0,
        zPosVec.x, zPosVec.y, zPosVec.z, 0,
        0,         0,         0,         1
    ];

    // Apply the transformation
    p.applyMatrix(...matrix);
}

export class Font {
    constructor(p, family, isTTF) {
        this.p = p;
        this.fam = family;
        this.isTTF = isTTF;
        this.fonts = this.loadFonts();
    }

    loadFonts() {
        const [p, fam] = [this.p, this.fam];
        let ext = this.isTTF ? ".ttf" : ".otf";
        let nodeEnv = import.meta.env.NODE_ENV;
        let mode = import.meta.env.MODE;
        let prefix = nodeEnv ? true : (mode === "production" ? "/moon" : "");
        // let prefix = nodeEnv === "production" ? "/moon" : "";
        let regular = p.loadFont(`${prefix}/assets/${fam}/${fam}-Regular${ext}`);
        let bold = p.loadFont(`${prefix}/assets/${fam}/${fam}-Bold${ext}`);
        let italic = p.loadFont(`${prefix}/assets/${fam}/${fam}-Italic${ext}`);
        let bolditalic = p.loadFont(`${prefix}/assets/${fam}/${fam}-BoldItalic${ext}`);
        return [regular, bold, italic, bolditalic];
    }

    regular() {
        return this.fonts[0];
    }

    bold() {
        return this.fonts[1];
    }

    italic() {
        return this.fonts[2];
    }

    bolditalic() {
        return this.fonts[3];
    }
}

export class Arrow {
    constructor(p, pos, dir, size) {
        this.p = p;
        this.pos = pos;
        this.dir = dir;
        this.size = size;
    }

    draw() {
        const [p, pos, dir, size] = [this.p, this.pos, this.dir, this.size];

        p.push();
        p.fill(255, 0, 0);
        p.stroke(255, 0, 0);
        dir.normalize();

        p.translate(pos);
        // Compute the rotation angle to align 'dir' with negative y-axis
        // Rotate around the X-axis to align dir.z with the negative y direction
        let angleX = p.atan2(dir.z, dir.y);
        p.rotateX(angleX);
        let angleY = 0;
        if (dir.y !== 1 && dir.y !== -1) {
            // Rotate around the Z-axis to align dir.x with the negative y direction
            angleY = p.atan2(dir.x, dir.y);
            p.rotateZ(angleY);
        }
        // Draw line
        p.strokeWeight(size/5);
        p.line(
            0, 0, 0,
            0, -size, 0
        );
        p.strokeWeight(0);

        // Go to end of arrow, draw cone
        p.translate(0, -size, 0);
        p.rotateX(p.PI);
        p.cone(size/4, size/2, 10);
        p.pop();
    }
}

/**
 * Draw world axes at the origin
 * 
 * @param {object} p - The p5 instance
 * @param {number} size - (Optional) length of axes
 */
export function worldAxes(p, size=20) {
    p.push();
    p.strokeWeight(1);
    p.stroke("red");
    p.line(0, 0, 0, size, 0, 0);
    p.stroke("green");
    p.line(0, 0, 0, 0, size, 0);
    p.stroke("blue");
    p.line(0, 0, 0, 0, 0, size);
    p.pop();
}