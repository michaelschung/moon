import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Moon, Earth, Sun } from "./Body";
import { TextToCamera, Circle } from "./Utils";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({lvl, pos, orbitRef, showPrimary, showOrbit=true}) {
    const orbitState = orbitRef.getState();
    const satPos = orbitState.satStore.getState().pos;
    const satAngle = orbitState.satStore.getState().angle;
    const r = orbitState.r;

    const priPos = orbitState.priStore((state) => state.pos);
    const tilt = orbitState.tilt;

    const quaternion = useMemo(() => {
        // Circle is by default in xy-plane
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        const targetNormal = (tilt)
            ? tilt.clone().normalize()
            : new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion();
        
        // Compute the rotation needed to align defaultNormal to targetNormal
        quat.setFromUnitVectors(defaultNormal, targetNormal);
        return quat;
    }, [tilt]);

    return (lvl === 0)
        ? (
            <>
                {showPrimary &&
                    <Earth pos={pos} angle={0} />
                }
                <Moon pos={satPos} angle={satAngle} />
                {showOrbit &&
                    <Circle
                        pos={priPos}
                        quat={quaternion}
                        r={r}
                        color={"#444"}
                    />
                }
            </>
        )
        : (
            <>
                <Sun pos={pos} angle={0} />
                <Earth pos={satPos} angle={satAngle} />
            </>
        );
}