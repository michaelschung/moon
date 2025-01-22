export class Orbit {
    /**
     * 
     * @param {object} p - The p5 instance
     * @param {Body} primary - Primary body (the one being orbited)
     * @param {Body} satellite - Secondary body (the one orbiting)
     * @param {number} r - Orbital radius (assuming circular orbits)
     * @param {p5.Vector} orbitTilt - Normal to the orbital plane (relative to ecliptic)
     */
    constructor(p, primary, satellite, r, orbitTilt) {
        this.p = p;
        this.pri = primary;
        this.sat = satellite;
        this.r = r;
        this.tilt = orbitTilt.normalize();
        // Current angle in the revolution
        this.rev = 0;
    }

    instanceVariables() {
        return [this.p, this.pri, this.sat, this.r, this.tilt, this.rev];
    }

    // Calculate coordinates of satellite
    calculateCoords() {
        const [p, pri, sat, r, tilt, rev] = this.instanceVariables();
        let nHat = tilt;
        let w = p.createVector(1, 0, 0);
        let uHat = nHat.cross(w).normalize();
        let vHat = nHat.cross(uHat).normalize();
        let rCosUHat = uHat.mult(r * p.cos(rev));
        let rSinVHat = vHat.mult(r * p.sin(rev));
        let primaryPos = pri.pos.copy();
        return primaryPos.add(rCosUHat.add(rSinVHat));
    }

    render() {
        const [p, pri, sat, r, tilt, rev] = this.instanceVariables();
        pri.draw();
        sat.pos = this.calculateCoords();
        sat.draw();
    }

    revolve(angle) {
        // const [p, pri, sat, r, tilt, rev] = this.instanceVariables();
        this.rev -= angle;
    }
}