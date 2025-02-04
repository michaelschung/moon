import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls as OC, PerspectiveCamera } from "@react-three/drei";

function RevolvingCamera() {
    const camRef = useRef();
    const camDistance = 5;
    const speed = 0.5;
    let angle = useRef(0);

    useFrame(({ clock }) => {
        angle.current = clock.getElapsedTime() * speed;
        const x = camDistance * Math.cos(angle.current);
        const z = -camDistance * Math.sin(angle.current);

        if (camRef.current) {
            camRef.current.position.set(x, 0, z);
            camRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <PerspectiveCamera
            ref={camRef}
            makeDefault
            position={[camDistance, 2, 0]}
            fov={75}
            near={0.1}
            far={1000}
        />
    );
}

export function MoonPhases() {
    let angle = 0;
    const camDistance = 50;
    const speed = 0.01;

    return (
        <Canvas className="sketch-container three-two">
            {/* perspectivecamera={{ position: [camDistance, 0, 0], fov: 75 }} */}
            <RevolvingCamera />
            <color attach="background" args={["grey"]} />

            {/* Ambient light to illuminate all objects equally */}
            <ambientLight intensity={0.5} />

            {/* Directional light to simulate sunlight */}
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <mesh position={[0, 0, 0]}>
                <boxGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
            <OC />
        </Canvas>
    );
}

export function createMoonPhasesScene(container) {
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    // Starry night sky background
    const bgTexture = new THREE.TextureLoader().load("/img/sky.png");
    const bgGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const bgMaterial = new THREE.MeshBasicMaterial({
        map: bgTexture,
        side: THREE.BackSide
    });
    bgMaterial.color.setScalar(0.03);
    const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
    scene.add(bgSphere);
    
    // Match renderer size to container
    function updateSize() {
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }
    
    updateSize();
    container.appendChild(renderer.domElement);

    // Orbit control
    // const controls = new OrbitControls(camera, renderer.domElement);

    // Moon
    const texture = new THREE.TextureLoader().load("/img/moon-texture.jpg");
    const geometry = new THREE.SphereGeometry(20);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lights
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-1, 0, 0);
    directionalLight.target = sphere;
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.02));

    // Camera setup
    let angle = 0;
    const camDistance = 50;
    const speed = 0.01;

    camera.position.set(camDistance, 0, 0);
    camera.lookAt(sphere.position);

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotateY(speed);
        camera.position.x = camDistance * Math.cos(angle);
        camera.position.z = -camDistance * Math.sin(angle);
        camera.lookAt(sphere.position);
        angle += speed;
        renderer.render(scene, camera);
        // controls.update();
    }

    animate();
    window.addEventListener("resize", updateSize);

    // Cleanup
    function dispose() {
        window.removeEventListener("resize", updateSize);
        container.removeChild(renderer.domElement);
        renderer.dispose();
    }

    return { dispose };
}