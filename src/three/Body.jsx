import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

import { createMoonStore } from "../stores";

function Body2({attrs}) {
    const bodyRef = useRef();

    return (
        <mesh ref={bodyRef} position={attrs.pos} rotation={[0, attrs.angle, 0]}>
            <sphereGeometry args={[attrs.r, 32, 32]} />
            {attrs.name === "sun"
                ? <meshBasicMaterial map={attrs.texture} />
                : <meshLambertMaterial map={attrs.texture} />}
        </mesh>
    );
}

export function Moon2({pos, angle}) {
    return (
        <Body2 attrs={{
            name: "moon",
            pos: pos,
            r: 20,
            angle: angle,
            texture: useTexture("/img/moon-texture.jpg"),
        }} />
    );
}

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
            {attrs.name === "sun"
                ? <meshBasicMaterial map={attrs.texture} />
                : <meshLambertMaterial map={attrs.texture} />}
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
            texture: useTexture("/img/earth-texture.jpg"),
            doRotate: doRotate
        }} />
    );
}

export function Sun({pos, doRotate}) {
    return (
        <Body attrs={{
            name: "sun",
            pos: pos,
            // r: 8720,
            r: 100,
            texture: useTexture("/img/sun-texture.jpg"),
            doRotate: doRotate
        }} />
    );
}