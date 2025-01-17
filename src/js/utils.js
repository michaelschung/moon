export class Moon {
    /**
     * Creates a new Moon object.
     * 
     * @param {object} p - The p5 instance
     * @param {p5.Vector} pos - Location of the moon
     * @param {number} r - Radius of the moon
     * @param {number} rot - Initial rotation angle (in radians). 0 = dark side towards camera.
     * @param {number} res - Resolution of the render
     */
    constructor(p, pos, r, rot, res) {
        this.p = p;
        this.pos = pos;
        this.r = r;
        this.rot = rot;
        this.res = res;
    }

    instanceVars() {
        return [this.p, this.pos, this.r, this.rot, this.res];
    }

    draw() {
        const [p, pos, r, rot, res] = this.instanceVars();
        p.push();
        p.translate(pos);
        p.rotateY(-rot);
        drawHemisphere(p, r, res, true);
        drawHemisphere(p, r, res, false);
        p.pop();
    }

    rotate(rotAngle) {
        this.rot += rotAngle;
    }
}

function drawHemisphere(p, r, res, isDark) {
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

            let noise = p.random(-5, 5);
            p.fill((isDark ? 30 : 200) + noise);

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