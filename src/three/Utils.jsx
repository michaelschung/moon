import React, { useRef, useEffect, useMemo, forwardRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useTexture, Html } from "@react-three/drei";

export function getQuaternion(targetNorm) {
    // Default normal for shapes is xy-plane
    const defaultNorm = new THREE.Vector3(0, 0, 1);
    const quat = new THREE.Quaternion();
    // Compute rotation needed to align defaultNorm to targetNorm
    quat.setFromUnitVectors(defaultNorm, targetNorm);
    return quat;
}

export function calcSatPos(pos, r, angle, tilt=new THREE.Vector3(0, 1, 0)) {
    let nHat = tilt.clone();
    let w = new THREE.Vector3(1, 0, 0);
    let uHat = nHat.clone().cross(w).normalize();
    let vHat = nHat.clone().cross(uHat).normalize();
    let rSinUHat = uHat.multiplyScalar(-r * Math.sin(angle));
    let rCosVHat = vHat.multiplyScalar(r * Math.cos(angle));
    let satPos = pos.clone().add(rSinUHat).add(rCosVHat);
    return [satPos.x, satPos.y, satPos.z];
}

export function toggleInstructions(id, auto=false) {
    const domElement = document.getElementById(id);
    let currHidden = domElement.classList.contains("hidden");
    if (!auto || currHidden) {
        domElement.classList.toggle("hidden");
    }
}

export function interpolate(start, end, val, specialCase=false) {
    if (specialCase) {
        let startVec, endVec;
        if (val <= 0.5) {
            startVec = new THREE.Vector3(0, 0, -1);
            endVec = new THREE.Vector3(1, 1, 0);
        } else {
            startVec = new THREE.Vector3(1, 1, 0);
            endVec = new THREE.Vector3(0, 1, 0);
        }
        const currVec = new THREE.Vector3().lerpVectors(startVec, endVec, (val <= 0.5) ? val * 2 : (val - 0.5) * 2);
        return [currVec.x, currVec.y, currVec.z];
    }
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const currVec = new THREE.Vector3().lerpVectors(startVec, endVec, val);
    return [currVec.x, currVec.y, currVec.z];
}

export function Person({pos, quat}) {
    return (
        <mesh position={pos} quaternion={quat}>
            <sphereGeometry args={[5, 32, 32]} />
            <meshBasicMaterial attach="material" color={"red"} />
        </mesh>
    );
}

export function Disk({pos, quat, r, color, opacity=0.4, segments=50}) {
    const geometry = useMemo(() => new THREE.CircleGeometry(r, segments), [r, segments]);

    return (
        <mesh geometry={geometry} position={pos} quaternion={quat}>
            {/* <circleGeometry args={[r, segments]} /> */}
            <meshBasicMaterial
                attach="material"
                color={color}
                transparent={true}
                opacity={opacity}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export function Circle({pos, quat, r, color, segments=50}) {
    const geometry = useMemo(() => {
        const curve = new THREE.EllipseCurve(
            0, 0,           // coords
            r, r,           // radii
            0, 2*Math.PI,   // start, end
            false,          // clockwise
            0               // rotation
        );
        const points = curve.getPoints(segments);
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [r, segments]);
  
    return (
        <group position={pos} quaternion={quat}>
            <line geometry={geometry}>
                <lineBasicMaterial attach="material" color={color} />
            </line>
        </group>
    );
}

export const Slider = forwardRef((props, ref) => {
    return (
        <input
            ref={ref}
            type="range"
            min="0"
            max="100"
            defaultValue={props.defaultVal}
        />
    );
});

export function TextToCamera({attrs}) {
    const textRef = useRef();

    return (
        <Html position={attrs.pos} ref={textRef}>
            <div className="text2D" style={{
                fontSize: attrs.size || "1em",
                fontStyle: attrs.style || "normal",
                color: attrs.color || "white",
                userSelect: "none"
            }}>
                {/* Inserts <br> tags in place of each \n */}
                {attrs.text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < attrs.text.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </div>
        </Html>
    );
}

export const Camera = forwardRef(({attrs}, ref) => {
    const angle = useRef(0);

    useEffect(() => {
        if (ref.current) {
            ref.current.lookAt(attrs.target.current.position);
        }
    }, [attrs.target]);

    useFrame(() => {
        if (ref.current && attrs.isRevolving) {
            const r = new THREE.Vector3(...attrs.pos).distanceTo(attrs.target.current.position);
            const x = r * Math.cos(angle.current);
            const z = -r * Math.sin(angle.current);

            ref.current.position.set(x, 0, z);
            ref.current.lookAt(attrs.target.current.position);
            angle.current += 0.01;
        }
    }, [attrs.pos]);

    return (
        <PerspectiveCamera
            ref={ref}
            makeDefault
            position={attrs.pos}
            fov={attrs.fov}
            near={0.1}
            far={2400}
        />
    );
});

export function Sunlight({pos, targetRef, brightness, shadows, ambient}) {
    let mapSize = 256;
    let camBound = 1000;
    return (
        <>
            <directionalLight
                castShadow={shadows}
                shadow-mapSize-width={mapSize}
                shadow-mapSize-height={mapSize}
                shadow-camera-near={0.5}
                shadow-camera-far={1200}
                shadow-camera-left={-camBound}
                shadow-camera-right={camBound}
                shadow-camera-top={camBound}
                shadow-camera-bottom={-camBound}
                color="#ffffff"
                intensity={brightness}
                position={pos}
                target={targetRef.current}
            />
            <ambientLight color="#ffffff" intensity={ambient} />
        </>
    );
}

export function StarryBackground() {
    const texture = useTexture("/img/sky.png");

    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1200, 32, 32]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                color={[0.3, 0.3, 0.3]}
            />
        </mesh>
    );
}