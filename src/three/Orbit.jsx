import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Moon, Earth, Sun } from "./Body";
import { TextToCamera } from "./Utils";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({attrs}) {
    const [satPos, setSatPos] = useState([-attrs.r, 0, 0]);
    const revAngle = useRef(0);

    const offset = attrs.lvl === 0 ? 100 : 100;
    const [labelPos, setLabelPos] = useState(calcLabelPos());

    function calcLabelPos() {
        const pos = new THREE.Vector3(...attrs.pos);
        const outPos = new THREE.Vector3(...satPos);
        const dir = new THREE.Vector3().subVectors(pos, outPos).normalize();
        const newPos = new THREE.Vector3().addVectors(outPos, dir.multiplyScalar(offset));
        return [newPos.x, newPos.y, newPos.z];
    }

    useFrame(() => {
        if (attrs.doRevolve) {
            const satX = attrs.pos[0] - attrs.r * Math.cos(revAngle.current);
            // TODO: update this to include tilt
            const satY = attrs.pos[1];
            const satZ = attrs.pos[2] + attrs.r * Math.sin(revAngle.current);
            setSatPos([satX, satY, satZ]);
            setLabelPos(calcLabelPos());
            revAngle.current += 0.01;
        }
    });

    // TODO: make label show only when not moving
    return (attrs.lvl === 0)
        ? (
            <>
                <Earth pos={attrs.pos} doRotate={false} />
                <Moon pos={satPos} doRotate={true} />
                {attrs.showLabel && 
                    <TextToCamera attrs={{
                        text: "phase",
                        size: "1em",
                        pos: labelPos
                    }} />
                }
            </>
        )
        : (
            <>
                <Sun pos={attrs.pos} doRotate={false} />
                <Earth pos={satPos} doRotate={false} />
            </>
        );
}