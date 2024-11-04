import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType( 'local' );
document.body.appendChild(renderer.domElement);
document.body.appendChild( VRButton.createButton( renderer ) );
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
const light = new THREE.AmbientLight(0x909090); // soft white light
scene.add(light);
const light3 = new THREE.PointLight(0xefefff, 1);
light3.position.z = 0;
light3.position.x = 0;
light3.position.y = 50;
scene.add(light3);
camera.position.z = 15;




const texture = new THREE.TextureLoader().load('s2.png');
const columns = 2;
const rows = 2;
const totalFrames = columns * rows;
let currentFrame = 0;
texture.repeat.set(1 / columns, 1 / rows);
const frameInterval = 100;
let lastFrameTime = 0;

const material = new THREE.MeshPhongMaterial({ color: 0x451515 ,map:texture});
const geometry = new THREE.BoxGeometry(10, 10, 10);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);




let loader = new FBXLoader();
loader.load('v2.fbx', function (object) {


    object.traverse(function (child) {
        if (child.isMesh) {
            child.material = material;

        }
    });

    object.position.y = -10

    scene.add(object);
})

function animate() {

    cube.rotation.y += 0.01;
    updateTextureFrame();

    renderer.render(scene, camera);

}
function updateTextureFrame() {
    if (Date.now() - lastFrameTime >= frameInterval) {
        const column = currentFrame % columns;
        const row = Math.floor(currentFrame / columns);
        texture.offset.x = column / columns;
        texture.offset.y = 1 - (row + 1) / rows;
        currentFrame = (currentFrame + 1) % totalFrames;
        lastFrameTime = Date.now();
    }
}