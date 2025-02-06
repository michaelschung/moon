import React, { useRef, useEffect, forwardRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, useTexture, Html, Text } from "@react-three/drei";

export function TextToCamera({attrs}) {
    const textRef = useRef();
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current && attrs.camRef.current) {
            meshRef.current.lookAt(attrs.camRef.current.position);
        }
    });

    return (
        <>
            <mesh ref={meshRef} position={attrs.pos} visible={false}>
                <sphereGeometry args={[0.1, 1, 1]} />
            </mesh>
            <Html position={attrs.pos} ref={textRef}>
                <div className="text2D" style={{ fontSize: attrs.size }}>
                    {/* Insert <br> tags in place of each \n */}
                    {attrs.text.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < attrs.text.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </div>
            </Html>
        </>
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
            far={2000}
        />
    );
});

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