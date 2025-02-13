import { useMemo } from "react";
import * as THREE from "three";
import { Moon, Earth, Sun } from "./Body";
import { Circle, getQuaternion } from "./Utils";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({lvl, pos, orbitRef, showPrimary, showOrbit=true}) {
    const orbitState = orbitRef.getState();
    const satPos = orbitState.satStore.getState().pos;
    const satAngle = orbitState.satStore.getState().angle;
    const r = orbitState.r;
    const tilt = orbitState.tilt;

    const priPos = orbitState.priStore((state) => state.pos);
    const priAngle = orbitState.priStore.getState().angle;

    let targetNorm = (tilt)
        ? tilt.clone().normalize()
        : new THREE.Vector3(0, 1, 0);
    const quaternion = useMemo(() => getQuaternion(targetNorm));

    return (lvl === 0)
        ? (
            <>
                {showPrimary &&
                    <Earth pos={pos} angle={priAngle} />
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
                <Sun pos={pos} angle={priAngle} />
                <Earth pos={satPos} angle={satAngle} />
            </>
        );
}