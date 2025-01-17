export const moonCycle = (p) => {
    let theta;

    p.setup = () => {
        p.createCanvas(300, 300, p.WEBGL);
        p.noStroke();
        
        theta = 0;
    };

    p.draw = () => {
        p.background(0);

        p.rotateY(-theta);
        theta += 0.05;

        drawMoon(100, 0.2);

        // p.orbitControl(2);
    };

    function drawMoon(d, res) {
        p.fill(30);
        drawHemisphere(100, res, true);
        p.fill(200);
        drawHemisphere(100, res, false);
    }

    // (diameter, resolution, isDark)
    function drawHemisphere(d, res, isDark) {
        let start = isDark ? 0 : p.PI;
        let end = isDark ? p.PI/2 : p.PI*3/2;
        p.beginShape(p.TRIANGLES);
        for (let lat = start; lat <= end; lat += res) {
            for (let lon = 0; lon <= p.TWO_PI; lon += res) {
                let x1 = p.cos(lat) * p.cos(lon) * d;
                let y1 = p.cos(lat) * p.sin(lon) * d;
                let z1 = p.sin(lat) * d;

                let x2 = p.cos(lat + res) * p.cos(lon) * d;
                let y2 = p.cos(lat + res) * p.sin(lon) * d;
                let z2 = p.sin(lat + res) * d;

                let x3 = p.cos(lat) * p.cos(lon + res) * d;
                let y3 = p.cos(lat) * p.sin(lon + res) * d;
                let z3 = p.sin(lat) * d;

                let x4 = p.cos(lat + res) * p.cos(lon + res) * d;
                let y4 = p.cos(lat + res) * p.sin(lon + res) * d;
                let z4 = p.sin(lat + res) * d;

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
};