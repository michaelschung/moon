import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Sunlight, StarryBackground, Camera } from "./Utils";
import { Moon, Earth } from "./Body";
import { Orbit } from "./Orbit";

export function MoonPhases() {
    const originRef = useRef();
    const camAttrs = {
        pos: [50, 0, 0],
        fov: 75,
        target: originRef,
        isRevolving: true,
    };

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <Camera attrs={camAttrs} />

            <Moon pos={[0, 0, 0]} doRotate={true} />

            <OrbitControls />
        </>
    );
}

export function MoonRevolve() {
    const originRef = useRef();
    const camAttrs = {
        pos: [0, 1000, 0],
        fov: 50,
        target: originRef,
        isRevolving: false
    };

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <Camera attrs={camAttrs} />

            <Orbit lvl={0} pos={[0, 0, 0]} r={400} />
        </>
    );
}

export function MoonQuarters() {
    const originRef = useRef();
    const camAttrs = {
        pos: [0, 1000, 0],
        fov: 60,
        target: originRef,
        isRevolving: false
    };

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <Camera attrs={camAttrs} />

            <Orbit lvl={0} pos={[0, 0, 0]} r={400} />
        </>
    );
}