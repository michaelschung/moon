import { useRef } from "react";
import { useTexture } from "@react-three/drei";

const baseUrl = import.meta.env.BASE_URL;

function Body({attrs}) {
    const bodyRef = useRef();

    return (
        <mesh
            ref={bodyRef}
            position={attrs.pos}
            rotation={[0, attrs.angle, 0]}
            castShadow={attrs.castShadow}
            receiveShadow={attrs.receiveShadow}
        >
            <sphereGeometry args={[attrs.r, 32, 32]} />
            {attrs.name === "sun"
                ? <meshBasicMaterial map={attrs.texture} />
                : <meshLambertMaterial map={attrs.texture} />}
        </mesh>
    );
}

export function Moon({pos, angle}) {
    return (
        <Body attrs={{
            name: "moon",
            pos: pos,
            r: 20,
            angle: angle,
            texture: useTexture(`${baseUrl}img/moon-texture.jpg`),
            castShadow: true,
            receiveShadow: true
        }} />
    );
}

export function Earth({pos, angle}) {
    return (
        <Body attrs={{
            name: "earth",
            pos: pos,
            r: 80,
            angle: angle,
            texture: useTexture(`${baseUrl}img/earth-texture.jpg`),
            castShadow: true,
            receiveShadow: true
        }} />
    );
}

export function Sun({pos, angle}) {
    return (
        <Body attrs={{
            name: "sun",
            pos: pos,
            // r: 8720,
            r: 100,
            angle: angle,
            texture: useTexture(`${baseUrl}/img/sun-texture.jpg`),
            castShadow: false,
            receiveShadow: false
        }} />
    );
}