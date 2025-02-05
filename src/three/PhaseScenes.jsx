import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Sunlight, StarryBackground, RevolvingCamera, StaticCamera } from "./Utils";
import { Moon, Earth } from "./Body";

export function MoonPhases() {
    const originRef = useRef();
    const moonPos = [0, 0, 0];

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} />

            <RevolvingCamera targetRef={originRef} brightness={2} />

            <Moon pos={moonPos} />

            <OrbitControls />
        </>
    );
}

export function MoonRevolve() {
    const originRef = useRef();
    const earthPos = [0, 0, 0];
    const [moonPos, setMoonPos] = useState([-400, 0, 0]);

    const revAngle = useRef(0);

    useFrame(() => {
        const moonX = -400 * Math.cos(revAngle.current);
        const moonZ = 400 * Math.sin(revAngle.current);
        setMoonPos([moonX, 0, moonZ]);
        revAngle.current += 0.01;
    });

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <StaticCamera pos={[0, 600, 0]} />

            <Earth pos={earthPos} doRotate={false} />
            <Moon pos={moonPos} doRotate={true} />

            <OrbitControls />
        </>
    );
}