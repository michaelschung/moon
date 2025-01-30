import React, { useEffect, useRef } from "react";
import p5 from "p5";

import { moonPhases, moonRevolve } from "../utils/phases";

function Phases({mainRef}) {
    const moonPhasesRef = useRef(null);
    const moonRevolveRef = useRef(null);

    useEffect(() => {
        if (!mainRef.current) return;

        const updateCanvasSize = () => {
            const width = mainRef.current.getBoundingClientRect().width;
            sketch.resizeCanvas(width, width * 2 / 3);
            sketch2.resizeCanvas(width, width * 2 / 3);
        };

        const sketch = new p5(
            moonPhases(mainRef.current),
            moonPhasesRef.current
        );
        const sketch2 = new p5(
            moonRevolve(mainRef.current),
            moonRevolveRef.current
        );

        window.addEventListener("resize", updateCanvasSize);

        return () => {
            sketch.remove();
            sketch2.remove();
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, [mainRef]);

    return (
        <>
            <hr />
            Phases
            <div ref={moonPhasesRef}></div>
            <div ref={moonRevolveRef}></div>
        </>
    );
}

export default Phases;