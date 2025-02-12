import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
    Sunlight, StarryBackground, Camera, Slider, Disk,
    arrToVec, vecToArr,
    interpolate, calcSatPos, getQuaternion,
    toggleInstructions
} from "./Utils";
import { Orbit } from "./Orbit";
import { createBodyStore, createOrbitStore } from "../stores";

export function EclipseScene({type}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas shadows className="sketch-container three-one with-slider">
                <Eclipse isLunar={type === "lunar"} sliderRef={sliderRef} />
            </Canvas>
            <Slider ref={sliderRef} defaultVal={0} />
        </>
    );
}

export function Eclipse({isLunar, sliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    let sunX = -550;
    let sER = 950;
    let earthX = sunX + sER;
    let eMR = 250;
    let moonX = earthX + (isLunar ? eMR : -eMR);

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(isLunar ? Math.PI : 0);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, isLunar ? Math.PI: 0));

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    useFrame(() => {
        if (sliderRef.current && camRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;

            // Update camera with interpolated values
            let sPos = arrToVec(sStoreRef.current.getState().pos);
            let ePos = arrToVec(eStoreRef.current.getState().pos);
            let mPos = arrToVec(mStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            let earthR = eStoreRef.current.getState().r;
            let endPos = (isLunar)
                ? [
                    ePos.x + eSVec.x/5,
                    ePos.y + eStoreRef.current.getState().r,
                    ePos.z + eStoreRef.current.getState().r*2.5
                ]
                : [earthX-earthR-1, 0, 0];
            camRef.current.position.set(...interpolate([0, 1000, 0], endPos, sliderVal));
            
            let endLook = (isLunar)
                ? [(ePos.x + mPos.x)/2, 0, 0]
                : [sunX, 0, 0];
            camRef.current.lookAt(...interpolate([0, 0, 0], endLook, sliderVal));
            
            let endUp = [0, 1, 0];
            camRef.current.up.set(...interpolate([0, 0, -1], endUp, sliderVal));
        }
    });

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight
                pos={[-1, 0, 0]}
                targetRef={originRef}
                brightness={5}
                shadows={true}
                ambient={0.2}
            />

            <Camera
                ref={camRef}
                attrs={{
                    pos: [0, 1000, 0],
                    fov: 35,
                    target: originRef,
                    isRevolving: false
                }}
            />

            <Orbit
                lvl={1}
                pos={[sunX, 0, 0]}
                orbitRef={sEOrbitRef.current}
                showPrimary={true}
            />

            <Orbit
                lvl={0}
                pos={[earthX, 0, 0]}
                orbitRef={eMOrbitRef.current}
                showPrimary={false}
                showOrbit={false}
            />
        </>
    );
}

export function AllEclipticScene({tilt}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas shadows className="sketch-container one-one with-slider">
                <AllEcliptic sliderRef={sliderRef} tilt={tilt} />
            </Canvas>
            <Slider ref={sliderRef} defaultVal={0} />
        </>
    );
}

export function AllEcliptic({sliderRef, tilt}) {
    const originRef = useRef();
    const camRef = useRef();
    const lightPos = useRef([-1, 0, 0]);

    let sunX = 0;
    let sER = 800;
    let earthX = sunX + sER;
    let eMR = 300;

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(0);

    let moonTiltAngle = 20 * Math.PI/180;
    let moonTiltVec = new THREE.Vector3(
        tilt ? -Math.sin(moonTiltAngle) : 0,
        tilt ? Math.cos(moonTiltAngle) : 1,
        0
    );

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 100, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    let mInitPos = calcSatPos(new THREE.Vector3(earthX, 0, 0), eMR, 0, moonTiltVec);
    const mStoreRef = useRef(createBodyStore(mInitPos, 20, 0));

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, moonTiltVec));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    const setMoonPos = mStoreRef.current((state) => state.setPos);
    const moonRotate = mStoreRef.current((state) => state.rotate);
    const moonAngle = eMOrbitRef.current((state) => state.angle);
    const moonRevolve = eMOrbitRef.current((state) => state.revolve);

    const setEarthPos = eStoreRef.current((state) => state.setPos);
    const earthRotate = eStoreRef.current((state) => state.rotate);
    const earthAngle = sEOrbitRef.current((state) => state.angle);
    const earthRevolve = sEOrbitRef.current((state) => state.revolve);

    const sunRotate = sStoreRef.current((state) => state.rotate);

    // Movement control
    const {gl} = useThree();
    const isMoving = useRef(false);

    useFrame(() => {
        let sPos = arrToVec(sStoreRef.current.getState().pos);
        let ePos = arrToVec(eStoreRef.current.getState().pos);
        lightPos.current = ePos.clone().normalize().multiplyScalar(-1);

        if (isMoving.current) {
            setMoonPos(calcSatPos(ePos, eMR, moonAngle, moonTiltVec));
            moonRotate(0.03);
            moonRevolve(0.03);
            setEarthPos(calcSatPos(sPos, sER, earthAngle));
            earthRotate(0.02);
            earthRevolve(0.005);
            sunRotate(0.002);
        }

        if (sliderRef.current && camRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;

            // Update camera with interpolated values
            let sunR = sStoreRef.current.getState().r;
            let endPos = [0, sunR*1.4, 0];
            camRef.current.position.set(...interpolate([0, 1000, 0], endPos, sliderVal));
            let endLook = vecToArr(ePos);
            camRef.current.lookAt(...interpolate([0, 0, 0], endLook, sliderVal));
            let endUp = [0, 1, 0];
            camRef.current.up.set(...interpolate([0, 0, -1], endUp, sliderVal));
        }
    });

    function handleClick() {
        isMoving.current = !isMoving.current;
        let version = !tilt ? 1 : 2;
        toggleInstructions(`ecliptic-instr${version}-1`);
    }

    useEffect(() => {
        gl.domElement.addEventListener("pointerdown", handleClick);
        return () => gl.domElement.removeEventListener("pointerdown", handleClick);
    }, [gl]);

    let targetNorm = new THREE.Vector3(0, 1, 0);
    const eclipticQuat = useMemo(() => getQuaternion(targetNorm));

    return (
        <>
            <object3D ref={originRef} position={[0, 0, 0]} />
            <StarryBackground />
            <Sunlight
                pos={lightPos.current}
                targetRef={originRef}
                brightness={5}
                shadows={true}
                ambient={0.2}
            />

            <Camera
                ref={camRef}
                attrs={{
                    pos: [0, 1000, 0],
                    fov: 100,
                    target: originRef,
                    isRevolving: false
                }}
            />

            <Orbit
                lvl={1}
                pos={[sunX, 0, 0]}
                orbitRef={sEOrbitRef.current}
                showPrimary={true}
            />

            <Orbit
                lvl={0}
                pos={[earthX, 0, 0]}
                orbitRef={eMOrbitRef.current}
                showPrimary={false}
            />

            <Disk
                pos={[0, 0, 0]}
                quat={eclipticQuat}
                r={sER+eMR*1.2}
                color={"#0096ff"}
                opacity={0.15}
            />
        </>
    );
}