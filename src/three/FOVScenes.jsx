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
                    timeSliderRef={timeSliderRef}
                    viewSliderRef={viewSliderRef}
                />
            </Canvas>
            <Slider ref={timeSliderRef} max={150} />
            <Slider ref={viewSliderRef} vertical={true}/>
        </>
    );
}

export function EverythingView({timeSliderRef, viewSliderRef}) {
    const originRef = useRef();
    const camRef = useRef();

    let sunX = -800;
    let sER = 1600;
    let earthX = sunX + sER;
    let eMR = 300;
    let moonX = earthX - eMR;

    let eStartAngle = useRef(Math.PI);
    let mStartAngle = useRef(0);

    const sStoreRef = useRef(createBodyStore([sunX, 0, 0], 150, 0));
    const eStoreRef = useRef(createBodyStore([earthX, 0, 0], 80, 0));
    const mStoreRef = useRef(createBodyStore([moonX, 0, 0], 20, 0));

    const setEarthRotate = eStoreRef.current((state) => state.setAngle);

    const eMOrbitRef = useRef(createOrbitStore(eStoreRef.current, mStoreRef.current, eMR, mStartAngle.current, null));
    const sEOrbitRef = useRef(createOrbitStore(sStoreRef.current, eStoreRef.current, sER, eStartAngle.current, null));

    const setMoonPos = mStoreRef.current((state) => state.setPos);
    const moonAngle = eMOrbitRef.current((state) => state.angle);
    const moonRotate = mStoreRef.current((state) => state.rotate);
    const moonRevolve = eMOrbitRef.current((state) => state.revolve);

    let earthR = eStoreRef.current.getState().r;
    let initPersonAngle = Math.PI;
    const [personPos, setPersonPos] = useState([earthX + earthR, 0, 0]);

    let initFovQuat = getQuaternion(new THREE.Vector3(1, 0, 0));
    const [fovQuat, setFovQuat] = useState(initFovQuat);

    // Movement control
    const {gl} = useThree();
    const mouseIsDown = useRef(false);

    function handleMouse(isDown) {
        mouseIsDown.current = isDown;
        toggleInstructions("everything-instr");
    }

    useEffect(() => {
        gl.domElement.addEventListener("pointerdown", () => handleMouse(true));
        gl.domElement.addEventListener("pointerup", () => handleMouse(false));
        return () => {
            gl.domElement.removeEventListener("pointerdown", () => handleMouse(true));
            gl.domElement.removeEventListener("pointerup", () => handleMouse(false));
        }
    }, [gl]);

    useFrame(() => {
        let ePos = new THREE.Vector3(...eStoreRef.current.getState().pos);

        if (mouseIsDown.current) {
            setMoonPos(calcSatPos(ePos, eMR, moonAngle, new THREE.Vector3(0, 1, 0)));
            moonRotate(0.02);
            moonRevolve(0.02);
        }

        if (camRef.current && viewSliderRef.current) {
            let viewSliderVal = Number(viewSliderRef.current.value) / 100;

            let sPos = new THREE.Vector3(...sStoreRef.current.getState().pos);
            let eSVec = sPos.clone().sub(ePos.clone());
            
            let startPos = [earthX+500, 200, -150];
            let endPos = [100, 1300, 0];
            camRef.current.position.set(...interpolate(startPos, endPos, viewSliderVal));
            
            let initLook = ePos.clone().add(eSVec.multiplyScalar(0.1));
            let startLook = [initLook.x, initLook.y, initLook.z];
            let endLook = [100, 0, 0];
            camRef.current.lookAt(...interpolate(startLook, endLook, viewSliderVal));

            camRef.current.up.set(...interpolate([0, 1, 0], [-1, 0, 1], viewSliderVal));
        }

        if (timeSliderRef.current) {
            let timeSliderVal = Number(timeSliderRef.current.value) / 100;

            let angleDelta = timeSliderVal * 2*Math.PI;
            let newPersonPos = [
                earthX - earthR*Math.cos(initPersonAngle + angleDelta),
                0,
                earthR * Math.sin(initPersonAngle + angleDelta)
            ];
            setPersonPos(newPersonPos);
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
                    isRevolving: false,
                    far: 3000
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