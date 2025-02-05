import { useRef } from "react";
import { OrbitControls as OC } from "@react-three/drei";

import { StarryBackground, RevolvingCamera } from "./Utils";
import { Moon } from "./Body";

export function MoonPhases() {
    const moonPosRef = useRef();

    return (
        <>
            <StarryBackground />
            <RevolvingCamera targetRef={moonPosRef} />

            <Moon />
            <object3D ref={moonPosRef} position={[0, 0, 0]} />

            <directionalLight
                color="#ffffff"
                intensity={2}
                position={[-1, 0, 0]}
                target={moonPosRef.current}
            />
            <ambientLight color="#ffffff" intensity={0.1} />
        </>
    );
}