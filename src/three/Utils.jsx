import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useTexture } from "@react-three/drei";

export function Camera({attrs}) {
    const camRef = useRef();
    const angle = useRef(0);

    useEffect(() => {
        if (camRef.current) {
            camRef.current.lookAt(attrs.target.current.position);
        }
    }, [attrs.target]);

    useFrame(() => {
        if (camRef.current && attrs.isRevolving) {
            const r = new THREE.Vector3(...attrs.pos).distanceTo(attrs.target.current.position);
            const x = r * Math.cos(angle.current);
            const z = -r * Math.sin(angle.current);

            camRef.current.position.set(x, 0, z);
            camRef.current.lookAt(attrs.target.current.position);
            angle.current += 0.01;
        }
    }, [attrs.pos]);

    return (
        <PerspectiveCamera
            ref={camRef}
            makeDefault
            position={attrs.pos}
            fov={attrs.fov}
            near={0.1}
            far={2000}
        />
    );
}

export function StaticCamera({pos, target, fov}) {
    const camRef = useRef();

    // const { size, set } = useThree(); // Get canvas size and update function

    useEffect(() => {
        if (camRef.current) {
            camRef.current.lookAt(target.current.position);
        }
    }, [target]);

    return (
        <PerspectiveCamera
            ref={camRef}
            makeDefault
            position={pos}
            fov={fov}
            near={0.1}
            far={2000}
        />
    );
}

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

export function Sunlight({targetRef, brightness}) {
    return (
        <>
            <directionalLight
                color="#ffffff"
                intensity={brightness}
                position={[-1, 0, 0]}
                target={targetRef.current}
            />
            <ambientLight color="#ffffff" intensity={0.1} />
        </>
    );
}

export function StarryBackground() {
    const texture = useTexture("/img/sky.png");

    return (
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1000, 32, 32]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                color={[0.3, 0.3, 0.3]}
            />
        </mesh>
    );
}