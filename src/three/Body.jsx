import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

export function Moon() {
    const moonRef = useRef();
    const texture = useTexture("/img/moon-texture.jpg");
    const angle = useRef(0);

    useFrame(() => {
        if (moonRef.current) {
            angle.current += 0.01;
            moonRef.current.rotation.y = angle.current;
        }
    })

    return (
        <mesh ref={moonRef} position={[0, 0, 0]} rotation={[0, angle, 0]}>
            <sphereGeometry args={[20, 32, 32]} />
            <meshLambertMaterial map={texture} />
        </mesh>
    );
}