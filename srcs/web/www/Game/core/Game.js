import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Ball } from '../components/Ball.js';
// import { Ball } from '../components/Ball.js';
// import { Paddle } from '../components/Paddle.js';
// import { GameState } from './GameState.js';

export class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);
		
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.set(5, 5, 5);
		this.camera.rotation.y = Math.PI;

		const geometry = new THREE.PlaneGeometry( 20, 20 );
		const material = new THREE.MeshStandardMaterial( {color: 0xf0f0f0, side: THREE.DoubleSide} );
		this.plane = new THREE.Mesh( geometry, material );
		this.plane.position.set(10, 0, 10);
		this.plane.rotation.x = Math.PI/2;
		this.scene.add( this.plane );

		this.light = new THREE.PointLight( 0xf0f0f0, 1, 100 );
		const pointLightHelper = new THREE.PointLightHelper( this.light, 1 );
		this.scene.add(this.light, pointLightHelper);
		this.light.position.set(10, 10, 10);
		this.light.castShadow = true;
		// this.light.shadow.mapSize.width = 1024;
		// this.light.shadow.mapSize.height = 1024;
		// this.light.shadow.camera.near = 0.5;
		// this.light.shadow.camera.far = 50;
		// this.light.shadow.camera.left = -10;
		// this.light.shadow.camera.right = 10;
		// this.light.shadow.camera.top = 10;
		// this.light.shadow.camera.bottom = -10;

		
		this.ball = new Ball(5, 1, 5);
		this.scene.add(this.ball.mesh);
		
		
		//helper
		this.orbit = new OrbitControls(this.camera, this.renderer.domElement );
		this.orbit.update();

		const gridHelper = new THREE.GridHelper( 20, 20 );
		gridHelper.position.set(10, 0, 10);
		this.scene.add( gridHelper );
		
		const axesHelper = new THREE.AxesHelper(5);
		this.scene.add(axesHelper);
		//

		// this.gameState = new GameState();

		window.addEventListener('resize', () => this.onWindowResize(), false);
	}

	start() {
		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		//update movement
		// this.orbit.update();
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
