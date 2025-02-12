import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
    Sunlight,
    StarryBackground,
    Camera,
    Slider,
    Disk,
    interpolate,
    toggleInstructions,
    calcSatPos,
    getQuaternion,
    Person
} from "./Utils";
import { Orbit } from "./Orbit";
import { createBodyStore, createOrbitStore } from "../stores";

function getTimeText(angle) {
    angle %= 2*Math.PI;

    const minsInDay = 24 * 60;
    const totalCurrMins = Math.round(minsInDay * angle/(2*Math.PI));

    let hour = Math.floor(totalCurrMins / 60);
    let min = totalCurrMins % 60;
    let minStr = min.toString().padStart(2, "0");

    let meridian = hour < 12 ? "PM" : "AM";
    hour %= 12;
    if (hour === 0) hour = 12;

    let extra = "";
    if (angle === 0) extra = "<br>(noon)"
    else if (angle === Math.PI) extra = "<br>(midnight)";

    return `${hour}:${minStr} ${meridian}${extra}`;
}

export function TimeScene({type}) {
    const sliderRef = useRef(null);
    return (
        <>
            <Canvas shadows className="sketch-container three-two with-slider">
                <TimeView type={type} sliderRef={sliderRef} />
            </Canvas>
            <Slider ref={sliderRef} defaultVal={0} />
        </>
    );
}

export function TimeView({type, sliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    const isNew = type === "new";

    let sunX = -550;
    let sER = 950;
    let earthX = sunX + sER;
    let eMR = 200;
    let moonX = earthX + (isNew ? -eMR : eMR);

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(isNew ? 0 : Math.PI);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, isNew ? 0 : Math.PI));

    const setEarthRotate = eStoreRef.current((state) => state.setAngle);

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    let earthR = eStoreRef.current.getState().r;
    let initPersonAngle = isNew ? Math.PI : 0;
    const [personPos, setPersonPos] = useState(
        [earthX + earthR*(isNew ? 1 : -1), 0, 0]
    );

    let initFovQuat = getQuaternion(new THREE.Vector3(isNew ? 1 : -1, 0, 0));
    const [fovQuat, setFovQuat] = useState(initFovQuat);

    useFrame(() => {
        if (camRef.current) {
            let sPos = new THREE.Vector3(...sStoreRef.current.getState().pos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            
            let camPos = (isNew)
                ? new THREE.Vector3(earthX+250, 100, -250)
                : new THREE.Vector3(earthX+300, 150, 250);
            camRef.current.position.set(camPos.x, camPos.y, camPos.z);
            
            let camLook = (isNew)
                ? ePos.add(eSVec.multiplyScalar(0.1))
                : new THREE.Vector3(earthX, 0, 0);
            camRef.current.lookAt(camLook.x, camLook.y, camLook.z);
            camRef.current.up.set(0, 1, 0);
        }

        if (sliderRef.current) {
            let sliderVal = Number(sliderRef.current.value) / 100;
            let angleDelta = sliderVal * 2*Math.PI;
            let newPersonPos = [
                earthX - earthR*Math.cos(initPersonAngle + angleDelta),
                0,
                earthR * Math.sin(initPersonAngle + angleDelta)
            ];
            setPersonPos(newPersonPos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let newFovNorm = new THREE.Vector3(...newPersonPos).sub(ePos).normalize();
            setFovQuat(getQuaternion(newFovNorm));
            setEarthRotate(angleDelta);

            const timeLabel = document.getElementById(`time-${type}-label`);
            timeLabel.innerHTML = getTimeText(initPersonAngle + angleDelta);
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
                shadows={false}
                ambient={0.1}
            />

            <Camera
                ref={camRef}
                attrs={{
                    pos: [0, 0, 0],
                    fov: 75,
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
                showOrbit={true}
            />

            <Person
                pos={personPos}
                quat={getQuaternion(new THREE.Vector3(0, 0, 1))}
            />

            <Disk
                pos={personPos}
                quat={fovQuat}
                r={eMR}
                color={"yellow"}
                opacity={0.15}
            />
        </>
    );
}

export function EverythingScene() {
    const timeSliderRef = useRef(null);
    const viewSliderRef = useRef(null);
    return (
        <>
            <Canvas shadows className="sketch-container one-one with-slider">
                <EverythingView
                    type={"new"}
                    timeSliderRef={timeSliderRef}
                    viewSliderRef={viewSliderRef}
                />
            </Canvas>
            <Slider ref={timeSliderRef} defaultVal={0} />
            <Slider ref={viewSliderRef} defaultVal={0} vertical={true}/>
        </>
    );
}

export function EverythingView({type, timeSliderRef, viewSliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    const isNew = type === "new";

    let sunX = -550;
    let sER = 950;
    let earthX = sunX + sER;
    let eMR = 200;
    let moonX = earthX + (isNew ? -eMR : eMR);

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(isNew ? 0 : Math.PI);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, isNew ? 0 : Math.PI));

    const setEarthRotate = eStoreRef.current((state) => state.setAngle);

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    let earthR = eStoreRef.current.getState().r;
    let initPersonAngle = isNew ? Math.PI : 0;
    const [personPos, setPersonPos] = useState(
        [earthX + earthR*(isNew ? 1 : -1), 0, 0]
    );

    let initFovQuat = getQuaternion(new THREE.Vector3(isNew ? 1 : -1, 0, 0));
    const [fovQuat, setFovQuat] = useState(initFovQuat);

    useFrame(() => {
        if (camRef.current && viewSliderRef.current) {
            let sPos = new THREE.Vector3(...sStoreRef.current.getState().pos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            
            let camPos = (isNew)
                ? new THREE.Vector3(earthX+250, 100, -250)
                : new THREE.Vector3(earthX+300, 150, 250);
            camRef.current.position.set(camPos.x, camPos.y, camPos.z);
            
            let camLook = (isNew)
                ? ePos.add(eSVec.multiplyScalar(0.1))
                : new THREE.Vector3(earthX, 0, 0);
            camRef.current.lookAt(camLook.x, camLook.y, camLook.z);
            camRef.current.up.set(0, 1, 0);
        }

        if (timeSliderRef.current) {
            let sliderVal = Number(timeSliderRef.current.value) / 100;
            let angleDelta = sliderVal * 2*Math.PI;
            let newPersonPos = [
                earthX - earthR*Math.cos(initPersonAngle + angleDelta),
                0,
                earthR * Math.sin(initPersonAngle + angleDelta)
            ];
            setPersonPos(newPersonPos);
            let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);
            let newFovNorm = new THREE.Vector3(...newPersonPos).sub(ePos).normalize();
            setFovQuat(getQuaternion(newFovNorm));
            setEarthRotate(angleDelta);

            const timeLabel = document.getElementById("everything-label");
            timeLabel.innerHTML = getTimeText(initPersonAngle + angleDelta);
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
                shadows={false}
                ambient={0.1}
            />

            <Camera
                ref={camRef}
                attrs={{
                    pos: [0, 0, 0],
                    fov: 75,
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
                showOrbit={true}
            />

            <Person
                pos={personPos}
                quat={getQuaternion(new THREE.Vector3(0, 0, 1))}
            />

            <Disk
                pos={personPos}
                quat={fovQuat}
                r={eMR}
                color={"yellow"}
                opacity={0.15}
            />
        </>
    );
}