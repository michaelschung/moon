// Random squares
export const sketch3 = (p) => {
    p.setup = () => {
        p.createCanvas(200, 200);
        p.background(240);
    };

    p.mousePressed = () => {
        p.fill(p.random(255), p.random(255), p.random(255));
        p.rect(p.random(p.width-50), p.random(p.height-50), 50);
    };
};