import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls as OC, PerspectiveCamera, useTexture } from "@react-three/drei";

export function RevolvingCamera({targetRef}) {
    const camRef = useRef();
    const camDistance = 50;
    const angle = useRef(0);

    useFrame(() => {
        const x = camDistance * Math.cos(angle.current);
        const z = -camDistance * Math.sin(angle.current);
        if (camRef.current) {
            camRef.current.position.set(x, 0, z);
            camRef.current.lookAt(targetRef.current.position);
            angle.current += 0.01;
        }
    })

    return (
        <PerspectiveCamera
            ref={camRef}
            makeDefault
            position={[camDistance, 0, 0]}
            fov={75}
            near={0.1}
            far={1000}
        />
    );
}

export function StarryBackground() {
    const texture = useTexture("/img/sky.png");

    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1000, 32, 32]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}