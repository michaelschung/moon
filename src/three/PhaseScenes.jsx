import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Sunlight, StarryBackground, RevolvingCamera, StaticCamera } from "./Utils";
import { Moon, Earth } from "./Body";
import { Orbit } from "./Orbit";

export function MoonPhases() {
    const originRef = useRef();

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <RevolvingCamera targetRef={originRef} />

            <Moon pos={[0, 0, 0]} doRotate={true} />

            <OrbitControls />
        </>
    );
}

export function MoonRevolve() {
    const originRef = useRef();

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <StaticCamera pos={[0, 1000, 0]} fov={50} />

            <Orbit lvl={0} pos={[0, 0, 0]} r={400} />

            <OrbitControls />
        </>
    );
}

export function MoonQuarters() {
    // 
}