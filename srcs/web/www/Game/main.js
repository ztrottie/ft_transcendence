import { Game } from './core/Game.js';

document.addEventListener('DOMContentLoaded', () => {
	const game = new Game();
	game.start();
});

// import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const scene = new THREE.Scene();

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.getElementById("three").appendChild(renderer.domElement);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   200
// );

// const orbit = new OrbitControls(camera, renderer.domElement );



// const gridHelper = new THREE.GridHelper( 20, 20 );
// gridHelper.position.set(10, 0, 10);
// scene.add( gridHelper );

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const light = new THREE.AmbientLight( 0xfffff0 );
// const pointLightHelper = new THREE.PointLightHelper( light, 1 );
// scene.add( light, pointLightHelper );

// light.position.set(20, 20, 20);
// cube.position.x = 2;
// cube.position.z = 2;
// camera.position.set(10, 2, 5);
// orbit.update();

// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   orbit.update();
//   renderer.render(scene, camera);
// }

// animate();
