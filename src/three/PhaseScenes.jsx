import { useRef } from "react";
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

            <RevolvingCamera targetRef={originRef} />

            <Moon pos={moonPos} />

            <OrbitControls />
        </>
    );
}

export function MoonRevolve() {
    const originRef = useRef();
    const earthPos = [0, 0, 0];

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} />

            <StaticCamera pos={[0, 800, 0]} />

            <Earth pos={earthPos}/>

            <OrbitControls />
        </>
    );
}