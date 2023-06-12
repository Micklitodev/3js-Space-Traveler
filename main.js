import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const torustxt = new THREE.TextureLoader().load("/sun.jpeg");

const geometry = new THREE.TorusGeometry(50, 1.8, 2, 100);
const material = new THREE.MeshStandardMaterial({
  map: torustxt,
});

const torus = new THREE.Mesh(geometry, material);
torus.position.z += -300;
torus.position.x += 200;
torus.rotation.x = +1.3;

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(25, 25, 25);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, renderer.domElement);

const createStar = () => {
  const geometry = new THREE.SphereGeometry(0.2, 23, 23);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(2000));

  star.position.set(x, y, z);
  scene.add(star);
};

Array(30000).fill().forEach(createStar);

const spaceTxt = new THREE.TextureLoader().load("/purplespace.jpg");
//scene.background = spaceTxt;

const planetTxt = new THREE.TextureLoader().load("/test.gif");
// const normalPlanetTxt = new THREE.TextureLoader().load('../public/normal.jpg')

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(28, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTxt,
  })
);

planet.position.z += -300;
planet.position.x += 200;
scene.add(planet);

const planet2 = new THREE.Mesh(
  new THREE.SphereGeometry(13, 32, 32),
  new THREE.MeshStandardMaterial({
    color: "red",
  })
);

planet2.position.z += -200;
planet2.position.x += -400;
planet2.position.y += -300;
scene.add(planet2);

const planet3 = new THREE.Mesh(
  new THREE.SphereGeometry(28, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTxt,
  })
);

planet3.position.z += 100;
planet3.position.x += -200;
planet2.position.y += -100;
scene.add(planet3);

const planet4 = new THREE.Mesh(
  new THREE.SphereGeometry(28, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTxt,
  })
);

planet4.position.z += 250;
planet4.position.x += 600;
planet2.position.y += 300;
scene.add(planet4);

let shipModel;

const loader = new GLTFLoader();
loader.load(
  "/ufo2/scene.gltf",
  function (gltf) {
    shipModel = gltf.scene;
    shipModel.position.y += 1;
    shipModel.scale.set(1, 1, 1);
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

const shipRotationSpeed = 0.02;
const keyState = {};

document.addEventListener("keydown", (event) => {
  keyState[event.code] = true;
});

let shipSpeed = -0.8;

document.addEventListener("keyup", (event) => {
  keyState[event.code] = false;
  shipSpeed = -0.8;
});

function animate() {
  requestAnimationFrame(animate);

  if (shipModel) {
    if (keyState["KeyA"]) {
      shipModel.rotation.y += shipRotationSpeed;
    }
    if (keyState["KeyD"]) {
      shipModel.rotation.y -= shipRotationSpeed;
    }
    if (keyState["KeyW"]) {
      var moveDirection = new THREE.Vector3(0, 0, shipSpeed);
      moveDirection.applyQuaternion(shipModel.quaternion);
      shipModel.position.add(moveDirection);
    }
    if (keyState["KeyS"]) {
      var moveDirection = new THREE.Vector3(0, -1, 0);
      moveDirection.applyQuaternion(shipModel.quaternion);
      shipModel.position.add(moveDirection);
    }
    if (keyState["KeyQ"]) {
      shipSpeed = -2;
    }
    if (keyState["Space"]) {
      var moveDirection = new THREE.Vector3(0, 1, 0);
      moveDirection.applyQuaternion(shipModel.quaternion);
      shipModel.position.add(moveDirection);
    }

    var cameraOffset = new THREE.Vector3(0, 0, 15);
    var cameraRelativePosition = cameraOffset.applyQuaternion(
      shipModel.quaternion
    );
    camera.position.copy(shipModel.position).add(cameraRelativePosition);

    camera.lookAt(shipModel.position);
  }

  planet.rotation.y += 0.002;

  renderer.render(scene, camera);
}

animate();
