import { useRef, useState, useEffect } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
    Sunlight,
    StarryBackground,
    Camera,
    TextToCamera,
    Slider,
    interpolate,
    toggleInstructions
} from "./Utils";
import { Moon } from "./Body";
import { Orbit } from "./Orbit";

import { createBodyStore, createOrbitStore } from "../stores";

export function EclipseScene({type}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas className="sketch-container three-one with-slider">
                <LunarEclipse />
            </Canvas>
            <Slider ref={sliderRef} />
        </>
    );
}

export function LunarEclipse() {
    const originRef = useRef();
    const camRef = useRef();

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight targetRef={originRef} brightness={5} />

            <Camera
                ref={camRef}
                attrs={{
                    pos: [0, 1000, 0],
                    fov: 50,
                    target: originRef,
                    isRevolving: false
                }}
            />
        </>
    );
}