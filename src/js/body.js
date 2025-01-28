import { alignWithVector } from "./utils";

export class Body {
    /**
     * Creates a new terrestrial body.
     * 
     * @param {object} p - The p5 instance
     * @param {p5.Vector} pos - Location of the body (pass null for origin)
     * @param {number} r - Radius of the body
     * @param {number} rot - Rotation angle (in radians)
     * @param {number} res - Resolution of the render (2pi/res)
     * @param {number} light - Angle from which the light is coming (pass negative value for luminous body)
     */
    constructor(p, pos, r, rot, res=80, light=null) {
        this.p = p;
        this.pos = pos || p.createVector(0, 0, 0);
        this.r = r;
        this.color = p.color(255);
        this.rot = rot;
        this.res = p.TWO_PI/res;
        // Default light comes from the direction of sun (pos X)
        this.light = light || p.PI;
        this.shadowOn = false;
        this.shadowColor = p.color(50, 150);
    }

    // NOTE TO SELF: might want to update rot and light to vectors
    // p5.Vector has methods like angleBetween that would make isLit easier

    instanceVars() {
        return [
            this.p, this.pos, this.r, this.color,
            this.rot, this.res, this.light
        ];
    }

    draw() {
        const [p, pos, r, c, rot, res, light] = this.instanceVars();
        p.push();
        p.translate(pos);
        drawLitSphere(p, r, c, rot, res, light);
        p.pop();
    }

    drawShadow(dist) {
        const [p, pos, r, c, rot, res, light] = this.instanceVars();
        p.push();
        p.translate(pos);
        p.rotateY(p.PI-light);
        p.rotateZ(-p.HALF_PI);
        p.translate(0, dist/2, 0);
        p.fill(this.shadowColor);
        p.cylinder(r+1, dist);
        p.pop();
    }

    // Rotates moon by given angle
    rotate(resAmt) {
        this.rot = (this.rot - resAmt * this.res) % this.p.TWO_PI;
    }

    showShadow() {
        this.shadowOn = true;
    }

    hideShadow() {
        this.shadowOn = false;
    }

    drawPerson(time, vec, showFOV=false) {
        const [p, pos, r, c, rot, res, light] = this.instanceVars();
        let timeAngle = (-rot + time * res) % p.TWO_PI;

        p.push();
        p.translate(pos);
        p.rotateY(timeAngle);
        p.translate(r, 0, 0);
        p.rotateZ(-p.PI/4);
        alignWithVector(p, vec);
        p.fill(255, 255, 0, 20);
        p.cone(r*2, 0);
        p.pop();
        
        p.push();
        p.translate(pos);
        p.rotateY(timeAngle);
        p.translate(r+2, 0, 0);
        p.fill("red");
        p.sphere(4);
        p.pop();
    }
}

export class Moon extends Body {
    constructor(p, pos, r, rot, res=80, light=0) {
        super(p, pos, r, rot, res, light);
        this.color = p.color(200);
    }
}

export class Earth extends Body {
    constructor(p, pos, r, rot, res=80, light=0) {
        super(p, pos, r, rot, res, light);
        this.color = p.color(4, 21, 207);
        this.shadowColor = p.color(30, 200);
    }
}

export class Sun extends Body {
    constructor(p, pos, r, rot, res=80) {
        super(p, pos, r, rot, res, -1);
        this.color = p.color("orange");
    }
}

// Darkens the given color (representing the shadow side)
function darkenColor(p, color) {
    return p.color(
        p.red(color) * 0.15,
        p.green(color) * 0.15,
        p.blue(color) * 0.15
    );
}

// Adds some noise to the given color (for texture)
function noisyColor(p, color, grain) {
    let noise = p.random(-grain, grain);
    return p.color(
        p.red(color) + noise,
        p.green(color) + noise,
        p.blue(color) + noise
    );
}

// Calculates whether a given longitude is on the lit side
function isLit(p, lon, light) {
    // Luminous bodies are lit on all sides
    if (light < 0) return true;
    let diff = Math.abs(lon - light) % p.TWO_PI;
    if (diff > p.PI) diff = p.TWO_PI - diff;
    return diff < p.PI/2;
}

/**
 * Draws a sphere with the given parameters, lit from the angle
 * given by `light`.
 * @param {object} p - The p5 instance
 * @param {number} r - Radius
 * @param {p5.Color} color - Base color
 * @param {number} rot - Current rotation angle
 * @param {number} res - Resolution of the render
 * @param {number} light - Angle from which the light is shining
 */
function drawLitSphere(p, r, color, rot, res, light) {
    p.beginShape(p.TRIANGLES);
    for (let lon = rot; lon < rot+p.TWO_PI; lon += res) {
        let c = isLit(p, lon+res/2, light) ? color : darkenColor(p, color);
        for (let lat = -p.PI/2; lat < p.PI/2; lat += res) {
            let x1 = p.cos(lat) * p.cos(lon) * r;
            let y1 = p.sin(lat) * r;
            let z1 = p.cos(lat) * p.sin(lon) * r;

            let x2 = p.cos(lat + res) * p.cos(lon) * r;
            let y2 = p.sin(lat + res) * r;
            let z2 = p.cos(lat + res) * p.sin(lon) * r;

            let x3 = p.cos(lat) * p.cos(lon + res) * r;
            let y3 = p.sin(lat) * r;
            let z3 = p.cos(lat) * p.sin(lon + res) * r;

            let x4 = p.cos(lat + res) * p.cos(lon + res) * r;
            let y4 = p.sin(lat + res) * r;
            let z4 = p.cos(lat + res) * p.sin(lon + res) * r;

            p.shininess(10);
            p.fill(noisyColor(p, c, 5));

            // Connect adjacent points to form triangles
            p.vertex(x1, y1, z1);
            p.vertex(x2, y2, z2);
            p.vertex(x3, y3, z3);

            p.vertex(x3, y3, z3);
            p.vertex(x2, y2, z2);
            p.vertex(x4, y4, z4);
        }
    }
    p.endShape();
}