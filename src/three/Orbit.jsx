import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Earth, Moon } from "./Body";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({lvl, pos, r}) {
    const [satPos, setSatPos] = useState([-r, 0, 0]);
    const revAngle = useRef(0);

    useFrame(() => {
        const satX = pos[0] - r * Math.cos(revAngle.current);
        // TODO: update this to include tilt
        const satY = pos[1];
        const satZ = pos[2] + r * Math.sin(revAngle.current);
        setSatPos([satX, satY, satZ]);
        revAngle.current += 0.01;
    });

    return (lvl === 0)
        ? (
            <>
                <Earth pos={pos} doRotate={false} />
                <Moon pos={satPos} doRotate={true} />
            </>
        )
        : (
            <>
                <Earth pos={earthPos} doRotate={true} />
                <Moon pos={satPos} doRotate={true} />
            </>
        );
}