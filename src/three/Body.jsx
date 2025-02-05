import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

function Body({attrs}) {
    const bodyRef = useRef();
    const angle = useRef(0);
    const [isRotating, setIsRotating] = useState(attrs.doRotate);

    function handleClick() {
        if (attrs.name !== "moon") {
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

export function Moon({pos, doRotate}) {
    return (
        <Body attrs={{
            name: "moon",
            pos: pos,
            r: 20,
            texture: useTexture("/img/moon-texture.jpg"),
            doRotate: doRotate
        }} />
    );
}

export function Earth({pos, doRotate}) {
    return (
        <Body attrs={{
            name: "earth",
            pos: pos,
            r: 80,
            texture: useTexture("/img/why-does-the-moon.png"),
            doRotate: doRotate
        }} />
    );
}