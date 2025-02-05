import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Moon, Earth, Sun } from "./Body";

// lvl: 0 is Earth/Moon, 1 is Sun/Earth
export function Orbit({attrs}) {
    const [satPos, setSatPos] = useState([-attrs.r, 0, 0]);
    const revAngle = useRef(0);

    useFrame(() => {
        if (attrs.doRevolve) {
            const satX = attrs.pos[0] - attrs.r * Math.cos(revAngle.current);
            // TODO: update this to include tilt
            const satY = attrs.pos[1];
            const satZ = attrs.pos[2] + attrs.r * Math.sin(revAngle.current);
            setSatPos([satX, satY, satZ]);
            revAngle.current += 0.01;
        }
    });

    return (attrs.lvl === 0)
        ? (
            <>
                <Earth pos={attrs.pos} doRotate={false} />
                <Moon pos={satPos} doRotate={true} />
            </>
        )
        : (
            <>
                <Sun pos={attrs.pos} doRotate={false} />
                <Earth pos={satPos} doRotate={false} />
            </>
        );
}