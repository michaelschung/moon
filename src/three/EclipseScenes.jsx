import { useRef, useState, useEffect } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
    Sunlight,
    StarryBackground,
    Camera,
    TextToCamera,
    Slider,
    interpolate,
    toggleInstructions
} from "./Utils";
import { Moon } from "./Body";
import { Orbit } from "./Orbit";

import { createBodyStore, createOrbitStore } from "../stores";

export function EclipseScene({type}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas shadows className="sketch-container three-one with-slider">
                {type === "lunar" &&
                    <LunarEclipse sliderRef={sliderRef} />
                }
                {type === "solar" &&
                    <SolarEclipse sliderRef={sliderRef} />
                }
            </Canvas>
            <Slider ref={sliderRef} defaultVal={0} />
        </>
    );
}

export function LunarEclipse({sliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    let sunX = -550;
    let sER = 950;
    let earthX = sunX + sER;
    let eMR = 250;
    let moonX = earthX + eMR;

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(Math.PI);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, Math.PI));

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    useFrame(() => {
        if (sliderRef.current && camRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;

            // Update camera with interpolated values
            let sPos = new THREE.Vector3(...sStoreRef.current.getState().pos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let mPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            let endPos = [
                ePos.x + eSVec.x/5,
                ePos.y + eStoreRef.current.getState().r,
                ePos.z + eStoreRef.current.getState().r*2.5
            ];
            camRef.current.position.set(...interpolate([0, 1000, 0], endPos, sliderVal));
            let endLook = [(ePos.x + mPos.x)/2, 0, 0];
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
            />
        </>
    );
}

export function SolarEclipse({sliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    let sunX = -550;
    let sER = 950;
    let earthX = sunX + sER;
    let eMR = 250;
    let moonX = earthX - eMR;

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(0);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, 0));
    // let moonStartPos = [earthX-eMR*Math.cos(mStartAngle.current), 0, eMR*Math.sin(mStartAngle.current)];
    // const mStoreRef = useRef(createBodyStore(moonStartPos, 20, 0));

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    const setMoonPos = mStoreRef.current((state) => state.setPos);
    const moonRotate = mStoreRef.current((state) => state.rotate);
    const moonAngle = eMOrbitRef.current((state) => state.angle);
    const moonRevolve = eMOrbitRef.current((state) => state.revolve);

    useFrame(() => {
        if (sliderRef.current && camRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;

            // Update camera with interpolated values
            let sPos = new THREE.Vector3(...sStoreRef.current.getState().pos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let mPos = new THREE.Vector3(...mStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            // let endPos = [
            //     ePos.x + eSVec.x/4,
            //     ePos.y + eStoreRef.current.getState().r,
            //     ePos.z + eStoreRef.current.getState().r*2.5
            // ];
            let earthR = eStoreRef.current.getState().r;
            let endPos = [earthX-earthR-1, 0, 0];
            camRef.current.position.set(...interpolate([0, 1000, 0], endPos, sliderVal));
            let endLook = [sunX, 0, 0];
            camRef.current.lookAt(...interpolate([0, 0, 0], endLook, sliderVal));
            let endUp = [0, 1, 0];
            camRef.current.up.set(...interpolate([0, 0, -1], endUp, sliderVal));

            // let satX = ePos.x - eMR * Math.cos(moonAngle);
            // let satY = ePos.y;
            // let satZ = ePos.z + eMR * Math.sin(moonAngle);
            // setMoonPos([satX, satY, satZ]);
            // moonRotate();
            // moonRevolve();
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
            />
        </>
    );
}