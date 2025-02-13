import React, { useEffect, useRef } from "react";
import p5 from "p5";

function Sketch({ sketchInstance, containerRef, ...params }) {
    const sketchRef = useRef(null);
    const paramValues = Object.values(params);

    useEffect(() => {
        if (!containerRef) return;

        const sketch = new p5(
            sketchInstance(containerRef.current, ...paramValues),
            sketchRef.current
        );

        // const updateCanvasSize = () => {
        //     const width = sketchRef.current.getBoundingClientRect().width;
        //     sketch.resizeCanvas(width, width * 2 / 3);
        // };

        // window.addEventListener("resize", updateCanvasSize);

        return () => {
            sketch.remove();
            // window.removeEventListener("resize", updateCanvasSize);
        };
    }, [sketchInstance, containerRef]);

    return <div ref={sketchRef} className="sketch-container"></div>;
}

export default Sketch;