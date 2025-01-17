// Red circle that follows mouse
export const sketch1 = (p) => {
    p.setup = () => {
        p.createCanvas(200, 200);
        p.background(240);
    };

    p.draw = () => {
        p.background(240);
        p.fill(255, 0, 0);
        p.ellipse(p.mouseX, p.mouseY, 50, 50);
    };
};