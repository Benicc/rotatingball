import * as THREE from "three"
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const w=window.innerWidth;
const h=window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10000;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 9;
const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const geo = new THREE.TorusGeometry(3, 0.001);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);

const sphere = new THREE.IcosahedronGeometry(1.0, 1);
const wireMesh2 = new THREE.Mesh(sphere, wireMat);
const sphereMesh = new THREE.Mesh(sphere, mat);
sphereMesh.add(wireMesh2);
scene.add(sphereMesh);

const array = []
for (let i = 0; i < 4; i++) {
    const mesh = new THREE.Mesh(geo, mat); // Reuse geometry and material
    const wireMesh = new THREE.Mesh(geo, wireMat);
    array.push(mesh);

    mesh.position.set(0, 0, 0); // Position each mesh 2 units apart along the X-axis
    scene.add(mesh);
    mesh.add(wireMesh);
}

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.005;
    mesh.rotation.x = t * 0.003;

    array.forEach((mesh) => {
        mesh.rotation.y = t * getRandomFloat(0.00001, 0.001);
        mesh.rotation.x = t * getRandomFloat(0.00001, 0.001);
    });
    
    sphereMesh.rotation.y = t * -0.0001;
    sphereMesh.rotation.x = t * -0.0001;
    renderer.render(scene, camera);
    controls.update();
}

animate();

// Update scene on window resize
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
// Add event listener for resize
window.addEventListener("resize", onWindowResize);
