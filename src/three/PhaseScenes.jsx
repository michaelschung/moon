import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { Sunlight, StarryBackground, Camera, TextToCamera } from "./Utils";
import { Moon } from "./Body";
import { Orbit } from "./Orbit";

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
    const eStoreRef = useRef(createBodyStore([0, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([-400, 0, 0], 20, 0));
    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, 400, 0, null));

    // No re-rendering needed
    const orbitState = eMOrbitRef.current.getState();
    const r = orbitState.r;
    const priPos = eStoreRef.current.getState().pos;

    // Re-render when these change
    const setSatPos = mStoreRef.current((state) => state.setPos);
    const satRotate = mStoreRef.current((state) => state.rotate);
    const angle = eMOrbitRef.current((state) => state.angle);
    const revolve = eMOrbitRef.current((state) => state.revolve);

    // Movement control
    const {gl} = useThree();
    const nextStop = useRef(0);
    const isMoving = useRef(false);
    const setOrbitAngle = eMOrbitRef.current((state) => state.setAngle);

    useFrame(() => {
        // TODO: update this to include tilt
        if (isMoving.current) {
            const satX = priPos[0] - r * Math.cos(angle);
            const satY = priPos[1];
            const satZ = priPos[2] + r * Math.sin(angle);
            setSatPos([satX, satY, satZ]);
            satRotate();
            revolve();
            isMoving.current = angle < nextStop.current;
        } else {
            // Snap to nearest quadrantal angle
            const nearestQuadrant = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
            setOrbitAngle(nearestQuadrant);
        }
    });

    function calcLabelPos() {
        const pos = new THREE.Vector3(...priPos);
        const satPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
        const dir = new THREE.Vector3().subVectors(pos, satPos).normalize();
        const labelPos = new THREE.Vector3().addVectors(satPos, dir.multiplyScalar(120));
        return [labelPos.x, labelPos.y, labelPos.z];
    }

    function getPhaseText() {
        const currAngle = angle % (2*Math.PI);
        if (currAngle < Math.PI/2) return "new moon";
        if (currAngle < Math.PI) return "first quarter";
        if (currAngle < Math.PI*3/2) return "full moon";
        return "third quarter";
    }

    function handleClick() {
        // Ignore clicks between quarters
        if (isMoving.current) return;
        isMoving.current = true;
        nextStop.current += Math.PI/2;
    }

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

            <Orbit
                lvl={0}
                pos={[0, 0, 0]}
                orbitRef={eMOrbitRef.current}
            />

            {!isMoving.current &&
                <TextToCamera attrs={{
                    text: getPhaseText(),
                    size: "1em",
                    pos: calcLabelPos()
                }} />
            }
        </>
    );
}

export function PhaseView({quarter, allowAnimate}) {
    const originRef = useRef();
    const camRef = useRef();
    const eStoreRef = useRef(createBodyStore([0, 0, 0], 80, 0));
    const orbR = 300;
    const moonStartAngle = useRef(quarter * Math.PI / 2);
    const moonStartPos = [-orbR*Math.cos(moonStartAngle.current), 0, orbR*Math.sin(moonStartAngle.current)];
    const mStoreRef = useRef(createBodyStore(moonStartPos, 20, 0));
    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, orbR, moonStartAngle.current, null));

    // No re-rendering needed
    const orbitState = eMOrbitRef.current.getState();
    const r = orbitState.r;
    const priPos = eStoreRef.current.getState().pos;

    // Re-render when these change
    const setSatPos = mStoreRef.current((state) => state.setPos);
    const satRotate = mStoreRef.current((state) => state.rotate);
    const angle = eMOrbitRef.current((state) => state.angle);
    const revolve = eMOrbitRef.current((state) => state.revolve);

    // Movement control
    const {gl} = useThree();
    const nextStop = useRef(0);
    const isMoving = useRef(false);
    const setOrbitAngle = eMOrbitRef.current((state) => state.setAngle);

    useFrame(() => {
        // TODO: update this to include tilt
        if (isMoving.current) {
            const satX = priPos[0] - r * Math.cos(angle);
            const satY = priPos[1];
            const satZ = priPos[2] + r * Math.sin(angle);
            setSatPos([satX, satY, satZ]);
            satRotate();
            revolve();
            isMoving.current = angle < nextStop.current;
        } else {
            // Snap to nearest quadrantal angle
            const nearestQuadrant = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
            setOrbitAngle(nearestQuadrant);
        }
    });

    function calcLabelPos() {
        const pos = new THREE.Vector3(...priPos);
        const satPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
        const dir = new THREE.Vector3().subVectors(pos, satPos).normalize();
        const labelPos = new THREE.Vector3().addVectors(satPos, dir.multiplyScalar(120));
        return [labelPos.x, labelPos.y, labelPos.z];
    }

    function getPhaseText() {
        const currAngle = angle % (2*Math.PI);
        if (currAngle < Math.PI/2) return "new moon";
        if (currAngle < Math.PI) return "first quarter";
        if (currAngle < Math.PI*3/2) return "full moon";
        return "third quarter";
    }

    function handleClick() {
        // Ignore clicks between quarters
        if (isMoving.current) return;
        isMoving.current = true;
        nextStop.current += Math.PI/2;
    }

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

            <Orbit
                lvl={0}
                pos={[0, 0, 0]}
                orbitRef={eMOrbitRef.current}
            />

            {!isMoving.current &&
                <TextToCamera attrs={{
                    text: getPhaseText(),
                    size: "0.75em",
                    pos: calcLabelPos()
                }} />
            }
        </>
    );
}