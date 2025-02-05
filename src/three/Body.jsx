import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

function Body({attrs}) {
    const bodyRef = useRef();
    const angle = useRef(0);
    const [isRotating, setIsRotating] = useState(attrs.doRotate);

    function handleClick() {
        if (attrs.r > 20) {
            setIsRotating(!isRotating);
        }
    }

    useFrame(() => {
        if (!bodyRef.current) return;
        
        if (isRotating) {
            angle.current += 0.01;
            bodyRef.current.rotation.y = angle.current;
        }
    });

    return (
        <mesh ref={bodyRef} position={attrs.pos} onClick={handleClick}>
            <sphereGeometry args={[attrs.r, 32, 32]} />
            <meshLambertMaterial map={attrs.texture} />
        </mesh>
    );
}

export function Moon({pos}) {
    return <Body
        attrs={{
            pos: pos,
            r: 20,
            texture: useTexture("/img/moon-texture.jpg"),
            doRotate: true
        }}
    />;
}

export function Earth({pos}) {
    return <Body
        attrs={{
            pos: pos,
            r: 80,
            texture: useTexture("/img/why-does-the-moon.png"),
            doRotate: false
        }}
    />;
}