class Body {
    /**
     * Creates a new terrestrial body.
     * 
     * @param {object} p - The p5 instance
     * @param {p5.Vector} pos - Location of the body
     * @param {number} r - Radius of the body
     * @param {number} rot - Rotation angle (in radians)
     * @param {number} res - Resolution of the render (2pi/res)
     * @param {number} light - Angle from which the light is coming (pass negative value for luminous body)
     */
    constructor(p, pos, r, rot, res=80, light=0) {
        this.p = p;
        this.pos = pos;
        this.r = r;
        this.color = p.color(255);
        this.rot = rot;
        this.res = p.TWO_PI/res;
        // Default light comes from the direction of sun (pos X)
        this.light = light;
    }

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

    // Rotates moon by given angle
    rotate(resAmt) {
        this.rot = (this.rot + resAmt * this.res) % this.p.TWO_PI;
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
 * @param {*} p - The p5 instance
 * @param {*} r - Radius
 * @param {*} color - Base color
 * @param {*} rot - Current rotation angle
 * @param {*} res - Resolution of the render
 * @param {*} light - Angle from which the light is shining
 */
function drawLitSphere(p, r, color, rot, res, light) {
    p.beginShape(p.TRIANGLES);
    for (let lon = rot; lon < rot+p.TWO_PI; lon += res) {
        let c = isLit(p, lon, light) ? color : darkenColor(p, color);
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