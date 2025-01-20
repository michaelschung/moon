export class Orbit {
    /**
     * 
     * @param {object} p - The p5 instance
     * @param {Body} primary - Primary body (the one being orbited)
     * @param {Body} satellite - Secondary body (the one orbiting)
     * @param {number} r - Orbital radius (assuming circular orbits)
     * @param {p5.Vector} orbitTilt - Angle of orbital plane (relative to parent's rot = 0)
     */
    constructor(p, primary, satellite, r, orbitTilt) {
        this.p = p;
        this.pri = primary;
        this.sat = satellite;
        this.r = r;
        this.tilt = orbitTilt;
        // Current angle in the revolution
        this.rev = 0;
    }

    instanceVariables() {
        return [this.p, this.pri, this.sat, this.r, this.tilt, this.rev];
    }

    render() {
        const [p, pri, sat, r, tilt, rev] = this.instanceVariables();
        pri.draw();
        sat.pos = p.createVector(
            pri.pos.x + r * p.cos(rev),
            pri.pos.y,
            pri.pos.z + r * p.sin(rev)
        );
        sat.draw();
    }

    revolve(angle) {
        // const [p, pri, sat, r, tilt, rev] = this.instanceVariables();
        this.rev += angle;
    }
}

