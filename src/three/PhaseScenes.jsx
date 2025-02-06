import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Sunlight, StarryBackground, Camera, TextToCamera } from "./Utils";
import { Moon, Earth } from "./Body";
import { Orbit } from "./Orbit";

export function MoonPhases() {
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
                    pos: [50, 0, 0],
                    fov: 75,
                    target: originRef,
                    isRevolving: true,
                }}
            />

            <Moon pos={[0, 0, 0]} doRotate={true} />

            <OrbitControls />
        </>
    );
}

export function MoonRevolve() {
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

            <Orbit attrs={{
                lvl: 0,
                pos: [0, 0, 0],
                r: 400,
                doRevolve: true
            }} />
        </>
    );
}

export function MoonQuarters() {
    const originRef = useRef();
    const camRef = useRef();

    const {gl} = useThree();
    const totalRotate = useRef(0);
    const nextStop = useRef(0);
    const isMoving = useRef(false);
    // Exists purely to force a re-render
    const [_, triggerRerender] = useState(0);

    function handleClick() {
        // Ignore clicks between quarters
        if (isMoving.current) return;
        isMoving.current = true;
        nextStop.current += Math.PI/2;
        triggerRerender((val) => val + 1);
    }

    useFrame(() => {
        // Move as long as we haven't reached the next quarter
        if (isMoving.current) {
            totalRotate.current += 0.01;
            if (totalRotate.current >= nextStop.current) {
                totalRotate.current = nextStop.current;
                isMoving.current = false;
                triggerRerender((val) => val + 1);
            }
        }
    });

    useEffect(() => {
        gl.domElement.addEventListener("pointerdown", handleClick);
        return () => gl.domElement.removeEventListener("pointerdown", handleClick);
    }, [gl]);

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

            <Orbit attrs={{
                lvl: 0,
                pos: [0, 0, 0],
                r: 400,
                angle: totalRotate.current,
                doRevolve: isMoving.current,
                showLabel: true
            }} />

            <TextToCamera attrs={{
                text: "Click for\nnext quarter",
                size: "1em",
                pos: [0, 81, 0],
                camRef: camRef
            }} />
        </>
    );
}