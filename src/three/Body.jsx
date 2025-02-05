import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

function Body({pos, r, texture}) {
    const bodyRef = useRef();
    const angle = useRef(0);
    const isRotating = true;

    useFrame(() => {
        if (!bodyRef.current) return;
        
        if (isRotating) {
            angle.current += 0.01;
            bodyRef.current.rotation.y = angle.current;
        }
    });

    return (
        <mesh ref={bodyRef} position={pos}>
            <sphereGeometry args={[r, 32, 32]} />
            <meshLambertMaterial map={texture} />
        </mesh>
    );
}

export function Moon({pos}) {
    const moonRef = useRef();
    const texture = useTexture("/img/moon-texture.jpg");
    const angle = useRef(0);

    // useFrame(() => {
    //     if (moonRef.current) {
    //         angle.current += 0.01;
    //         moonRef.current.rotation.y = angle.current;
    //     }
    // })

    return (
        <Body pos={pos} r={20} texture={texture} />
        // <mesh ref={moonRef} position={pos} rotation={[0, angle, 0]}>
        //     <sphereGeometry args={[20, 32, 32]} />
        //     <meshLambertMaterial map={texture} />
        // </mesh>
    );
}

export function Earth({pos}) {
    const earthRef = useRef();
    const texture = useTexture("/img/why-does-the-moon.png");

    return (
        <mesh ref={earthRef} position={pos}>
            <sphereGeometry args={[80, 32, 32]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    );
}