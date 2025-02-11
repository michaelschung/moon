import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Moon, Earth, Sun } from "./Body";
import { TextToCamera } from "./Utils";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({lvl, pos, orbitRef, showPrimary}) {
    const orbitState = orbitRef.getState();
    const satPos = orbitState.satStore.getState().pos;
    const satAngle = orbitState.satStore.getState().angle;

    return (lvl === 0)
        ? (
            <>
                {showPrimary &&
                    <Earth pos={pos} angle={0} />
                }
                <Moon pos={satPos} angle={satAngle} />
            </>
        )
        : (
            <>
                <Sun pos={pos} angle={0} />
                <Earth pos={satPos} angle={satAngle} />
            </>
        );
}