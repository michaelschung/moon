export const moonCycle = (p) => {
    let count;
    let cX, cY, cD;

    p.setup = () => {
        p.createCanvas(300, 300);
        p.background(0);

        p.noStroke();

        cX = p.width/2;
        cY = p.height/2;
        cD = p.width/2;

        count = 0;
    };

    p.draw = () => {
        p.background(0);
        p.fill(200);
        p.arc(cX, cY, cD, cD, p.PI*3/2, p.PI/2);

        if (count < cD/2) {
            p.fill(0);
            p.arc(cX, cY, cD, cD, p.PI/2, p.PI*3/2);
            p.ellipse(cX, cY, cD-count*2, cD);
        } else {
            p.fill(0);
            p.arc(cX, cY, cD, cD, p.PI/2, p.PI*3/2);
            p.fill(200);
            p.ellipse(cX, cY, cD-count*2, cD);
        }

        count = (count + 1) % cD;
    };
};