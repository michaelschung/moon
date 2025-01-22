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
        p.strokeWeight(size/2);
        p.line(
            0, 0, 0,
            0, -size, 0
        );
        p.strokeWeight(0);

        // Go to end of arrow, draw cone
        p.translate(0, -size, 0);
        p.rotateX(p.PI);
        p.cone(size/3, size/2, 10);
        p.pop();
    }
}