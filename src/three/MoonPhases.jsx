import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createMoonPhasesScene(container) {
    // Create Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    // const bgTexture = new THREE.TextureLoader().load("/img/sky.png");
    // const bgGeometry = new THREE.SphereGeometry(500, 32, 32);
    // const bgMaterial = new THREE.MeshStandardMaterial({
    //     map: bgTexture,
    //     side: THREE.BackSide
    // });
    // const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
    // scene.add(bgSphere);
    
    // Match renderer size to the container
    function updateSize() {
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }
    
    updateSize();
    container.appendChild(renderer.domElement);

    // Add Orbit Controls
    // const controls = new OrbitControls(camera, renderer.domElement);

    // Create Moon Sphere
    const texture = new THREE.TextureLoader().load("/img/moon-texture.jpg");
    const geometry = new THREE.SphereGeometry(2);
    const material = new THREE.MeshLambertMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add Lights
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-1, 0, 0);
    directionalLight.target = sphere;
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.02));

    // Camera & Animation Variables
    let angle = 0;
    const camDistance = 5;
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

    // Resize Handling
    window.addEventListener("resize", updateSize);

    // Cleanup Function
    function dispose() {
        window.removeEventListener("resize", updateSize);
        container.removeChild(renderer.domElement);
        renderer.dispose();
    }

    return { dispose };
}