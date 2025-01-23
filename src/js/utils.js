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
    let camUp = p.createVector(cam.upX, -cam.upY, -cam.upZ);
    let camLook = p.createVector(cam.centerX, cam.centerY, cam.centerZ);
    let camLookVec = camLook.copy().sub(camPos);

    // Compute the +z vector (opposite of cam's look vector)
    let zPosVec = camLookVec.mult(-1);
    zPosVec.normalize().mult(options[2]);

    // Compute the +x vector as the cross product of cam's up and +z
    let xPosVec = camUp.copy().cross(zPosVec);
    xPosVec.normalize().mult(options[0]);

    // Compute the +y vector as the cross product of +x and +z
    let yPosVec = xPosVec.cross(zPosVec);
    yPosVec.normalize().mult(options[1]);

    // Create a rotation matrix to align the world with the camera
    // Flip x and z since to "face" the camera
    let matrix = [
        -xPosVec.x, -xPosVec.y, -xPosVec.z, 0,
        yPosVec.x, yPosVec.y, yPosVec.z, 0,
        -zPosVec.x, -zPosVec.y, -zPosVec.z, 0,
        0, 0, 0, 1
    ];

    // Apply the transformation
    p.applyMatrix(...matrix);
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