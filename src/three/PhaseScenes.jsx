import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Sunlight, StarryBackground, Camera, TextToCamera } from "./Utils";
import { Moon } from "./Body";
import { Orbit, OldOrbit } from "./Orbit";

import { createBodyStore, createOrbitStore } from "../stores";

export function MoonPhases() {
    const originRef = useRef();
    const camRef = useRef();
    const moonStoreRef = useRef(createBodyStore([0, 0, 0], 20, 0));

    const moonState = moonStoreRef.current.getState();
    const pos = moonState.pos;
    const angle = moonStoreRef.current((state) => state.angle);
    const rotate = moonStoreRef.current((state) => state.rotate);

    useFrame(() => {
        rotate();
    })

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

            <Moon pos={pos} angle={angle} />
        </>
    );
}

export function MoonRevolve() {
    // All refs
    const originRef = useRef();
    const camRef = useRef();
    const eStoreRef = useRef(createBodyStore([0, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([-400, 0, 0], 20, 0));
    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, 400, null));

    // No re-rendering needed
    const orbitState = eMOrbitRef.current.getState();
    const r = orbitState.r;
    const priPos = eStoreRef.current.getState().pos;

    // Re-render when these change
    const setSatPos = mStoreRef.current((state) => state.setPos);
    const satRotate = mStoreRef.current((state) => state.rotate);
    const angle = eMOrbitRef.current((state) => state.angle);
    const revolve = eMOrbitRef.current((state) => state.revolve);

    useFrame(() => {
        // TODO: update this to include tilt
        const satX = priPos[0] - r * Math.cos(angle);
        const satY = priPos[1];
        const satZ = priPos[2] + r * Math.sin(angle);
        setSatPos([satX, satY, satZ]);
        satRotate();
        revolve();
    });

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

            <Orbit
                lvl={0}
                pos={[0, 0, 0]}
                orbitRef={eMOrbitRef.current}
            />
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

            <OldOrbit attrs={{
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