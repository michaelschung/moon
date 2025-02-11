import { useRef, useState, useEffect } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
    Sunlight,
    StarryBackground,
    Camera,
    TextToCamera,
    Slider,
    interpolate
} from "./Utils";
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
    });

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
        let pos = new THREE.Vector3(...priPos);
        let satPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
        let dir = new THREE.Vector3().subVectors(pos, satPos).normalize();
        let dist = (angle % Math.PI < 0.1) ? 120 : 60;
        let labelPos = new THREE.Vector3().addVectors(satPos, dir.multiplyScalar(dist));
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
                <>
                    <TextToCamera attrs={{
                        text: "Click for\nnext quarter",
                        pos: [0, 0, 0],
                        color: "#dddddd",
                        style: "italic"
                    }} />

                    <TextToCamera attrs={{
                        text: getPhaseText(),
                        pos: calcLabelPos()
                    }} />
                </>
            }
        </>
    );
}

export function PhaseScene({quarter, allowAnimate}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas className="sketch-container one-one with-slider">
                <PhaseView
                    quarter={quarter}
                    allowAnimate={allowAnimate}
                    sliderRef={sliderRef}
                />
            </Canvas>
            <Slider ref={sliderRef} />
        </>
    );
}

export function PhaseView({quarter, allowAnimate, sliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    const eStoreRef = useRef(createBodyStore([0, 0, 0], 80, 0));
    const orbR = 300;
    let moonStartAngle = useRef(quarter * Math.PI / 2);
    let moonStartPos = [-orbR*Math.cos(moonStartAngle.current), 0, orbR*Math.sin(moonStartAngle.current)];
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
    const isMoving = useRef(false);

    let initLabelPos = moonStartPos.slice();
    initLabelPos[2] += 50;
    const [labelPos, setLabelPos] = useState(initLabelPos);

    useFrame(() => {
        // TODO: update this to include tilt
        if (allowAnimate && isMoving.current) {
            let satX = priPos[0] - r * Math.cos(angle);
            let satY = priPos[1];
            let satZ = priPos[2] + r * Math.sin(angle);
            setSatPos([satX, satY, satZ]);
            satRotate();
            revolve();
        }

        if (sliderRef.current && camRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;

            // Update camera with interpolated values
            let pos = new THREE.Vector3(...priPos);
            let satPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
            let dir = new THREE.Vector3().subVectors(satPos, pos).normalize();
            let earthR = eStoreRef.current.getState().r;
            let endVec = new THREE.Vector3().addVectors(pos, dir.multiplyScalar(earthR));
            let endPos = [endVec.x, endVec.y, endVec.z];
            camRef.current.position.set(...interpolate([0, 1000, 0], endPos, sliderVal));
            let moonPos = mStoreRef.current.getState().pos;
            camRef.current.lookAt(...interpolate([0, 0, 0], moonPos, sliderVal));
            let specialCase = !allowAnimate && quarter === 1;
            camRef.current.up.set(...interpolate([0, 0, -1], [0, 1, 0], sliderVal, specialCase));

            calcLabelPos();
        }
    });

    function calcLabelPos() {
        if (camRef.current) {
            let camDown = camRef.current.up.clone().multiplyScalar(-1);
            const satPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
            const newLabelPos = new THREE.Vector3().addVectors(satPos, camDown.multiplyScalar(75));
            setLabelPos([newLabelPos.x, newLabelPos.y, newLabelPos.z]);
        }
    }

    function getPhaseText() {
        let phaseNames = [
            "new moon",
            "waxing crescent",
            "first quarter",
            "waxing gibbous",
            "full moon",
            "waning gibbous",
            "third quarter",
            "waning crescent"
        ];
        let currAngle = (angle+Math.PI/8) % (2*Math.PI);
        return phaseNames[Math.floor(currAngle / (Math.PI/4))];
    }

    function handleClick() {
        isMoving.current = !isMoving.current;
        if (allowAnimate) {
            document.getElementById("all-phases-instr").classList.toggle("hidden");
        }
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

            <TextToCamera attrs={{
                text: getPhaseText(),
                size: allowAnimate ? "1em" : "0.75em",
                pos: labelPos
            }} />

            {/* {allowAnimate && !isMoving.current &&
                <TextToCamera attrs={{
                    text: "Click to start\nanimation",
                    size: allowAnimate ? "1em" : "0.75em",
                    pos: [0, 100, 0],
                    color: "#dddddd",
                    style: "italic",
                }} />
            } */}
        </>
    );
}