class Body {
    /**
     * Creates a new terrestrial body.
     * 
     * @param {object} p - The p5 instance
     * @param {p5.Vector} pos - Location of the body
     * @param {number} r - Radius of the body
     * @param {number} rot - Initial rotation angle (in radians). 0 = dark side towards camera.
     * @param {number} res - Resolution of the render
     */
    constructor(p, pos, r, rot, res=0.2) {
        this.p = p;
        this.pos = pos;
        this.r = r;
        this.color = p.color(255);
        this.rot = rot;
        this.res = res;
    }

    instanceVars() {
        return [this.p, this.pos, this.r, this.color, this.rot, this.res];
    }

    draw() {
        const [p, pos, r, c, rot, res] = this.instanceVars();
        p.push();
        p.translate(pos);
        p.rotateY(-rot);
        drawHemisphere(p, r, c, res, true);
        drawHemisphere(p, r, c, res, false);
        p.pop();
    }

    // Rotates moon by given angle
    rotate(rotAngle) {
        this.rot += rotAngle;
    }
}

export class Moon extends Body {
    constructor(p, pos, r, rot, res) {
        super(p, pos, r, rot, res);
        this.color = p.color(200);
    }
}

export class Earth extends Body {
    constructor(p, pos, r, rot, res) {
        super(p, pos, r, rot, res);
        this.color = p.color(4, 21, 207);
    }
}

export class Sun extends Body {
    constructor(p, pos, r, rot, res) {
        super(p, pos, r, rot, res);
        this.color = p.color("orange");
    }

    draw() {
        const [p, pos, r, c, rot, res] = this.instanceVars();
        p.push();
        p.translate(pos);
        p.rotateY(-rot);
        drawHemisphere(p, r, c, res, false);
        drawHemisphere(p, r, c, res, false);
        p.pop();
    }
}

function darkenColor(p, color) {
    return p.color(
        p.red(color) * 0.15,
        p.green(color) * 0.15,
        p.blue(color) * 0.15
    );
}

function noisyColor(p, color, grain) {
    let noise = p.random(-grain, grain);
    return p.color(
        p.red(color) + noise,
        p.green(color) + noise,
        p.blue(color) + noise
    );
}

function drawHemisphere(p, r, baseColor, res, isDark) {
    let start = isDark ? 0 : p.PI;
    let end = isDark ? p.PI/2 : p.PI*3/2;
    p.beginShape(p.TRIANGLES);
    for (let lat = start; lat <= end; lat += res) {
        for (let lon = 0; lon <= p.TWO_PI; lon += res) {
            let x1 = p.cos(lat) * p.cos(lon) * r;
            let y1 = p.cos(lat) * p.sin(lon) * r;
            let z1 = p.sin(lat) * r;

            let x2 = p.cos(lat + res) * p.cos(lon) * r;
            let y2 = p.cos(lat + res) * p.sin(lon) * r;
            let z2 = p.sin(lat + res) * r;

            let x3 = p.cos(lat) * p.cos(lon + res) * r;
            let y3 = p.cos(lat) * p.sin(lon + res) * r;
            let z3 = p.sin(lat) * r;

            let x4 = p.cos(lat + res) * p.cos(lon + res) * r;
            let y4 = p.cos(lat + res) * p.sin(lon + res) * r;
            let z4 = p.sin(lat + res) * r;

            let c = isDark ? darkenColor(p, baseColor) : baseColor;
            p.fill(noisyColor(p, c, 10));

            // Connect adjacent points to form triangles
            p.vertex(x1, y1, z1);
            p.vertex(x2, y2, z2);
            p.vertex(x3, y3, z3);

            p.vertex(x3, y3, z3);
            p.vertex(x2, y2, z2);
            p.vertex(x4, y4, z4);
        }
    }
    p.endShape(p.CLOSE);
}