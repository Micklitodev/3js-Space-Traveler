import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(25);

const torustxt = new THREE.TextureLoader().load("/sun.jpeg");

const geometry = new THREE.TorusGeometry(13, 1.8, 2, 100);
const material = new THREE.MeshStandardMaterial({
  map: torustxt,
});

const torus = new THREE.Mesh(geometry, material);

torus.rotation.x = 1.7;

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(25, 25, 25);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

const createStar = () => {
  const geometry = new THREE.SphereGeometry(0.2, 23, 23);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
};

Array(200).fill().forEach(createStar);

const spaceTxt = new THREE.TextureLoader().load("/purplespace.jpg");
scene.background = spaceTxt;

const planetTxt = new THREE.TextureLoader().load("/test.gif");
// const normalPlanetTxt = new THREE.TextureLoader().load('../public/normal.jpg')

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTxt,
  })
);

scene.add(planet);

let shipModel;

const loader = new GLTFLoader();
loader.load(
  "/shipgltf/ship.gltf",
  function (gltf) {
    gltf.scene.position.setX(30);
    gltf.scene.position.setZ(-500);
    shipModel = gltf.scene;
    scene.add(gltf.scene);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

// planet.position.setZ(30);
// planet.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  planet.rotation.x += 0.05;
  planet.rotation.y += 0.07;
  planet.rotation.z += 0.05;

  camera.position.z = 25 + t * -0.005;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  if (shipModel) {
    shipModel.position.y += 0.01;
    shipModel.position.z += 0.7;
  }

  camera.position.x += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
