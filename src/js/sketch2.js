// Bouncing ball
export const sketch2 = (p) => {
    let x = 100, y = 100, xSpeed = 2, ySpeed = 2;

    p.setup = () => {
        p.createCanvas(200, 200);
        p.background(240);
    };

    p.draw = () => {
        p.background(240);
        p.fill(0, 255, 0);
        x += xSpeed;
        y += ySpeed;

        if (x < 0 || x > p.width) xSpeed *= -1;
        if (y < 0 || y > p.height) ySpeed *= -1;

        p.ellipse(x, y, 30, 30);
    };
};