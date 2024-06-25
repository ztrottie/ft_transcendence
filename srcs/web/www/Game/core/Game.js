import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Ball } from "../components/Ball.js";
import { Board } from "./Board.js";
import { Paddle } from "../components/Paddle.js";
// import { GameState } from './GameState.js';

export class Game {
	constructor() {
		// Scene and renderer
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		// Board
		this.board = new Board(4, 2, 0);
		this.board.addToScene(this.scene);

		// Camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.set(
			this.board.center.x,
			this.board.center.y + 5,
			this.board.center.z
		);
		this.camera.lookAt(this.board.center);

		// Light
		this.light = new THREE.PointLight(0xf0f0f0, 2, 10);
		const pointLightHelper = new THREE.PointLightHelper(this.light, 1);
		this.scene.add(this.light, pointLightHelper);
		this.light.position.set(
			this.board.center.x,
			this.board.center.y + 10,
			this.board.center.z
		);

		//padle
		this.paddle1 = new Paddle(
			this.board.center.x - this.board.width / 2 + 0.5,
			this.board.center.y + 0.2,
			this.board.center.z,
			0.4,
			0.5,
			3,
			0xff0000
		);
		this.paddle2 = new Paddle(
			this.board.center.x + this.board.width / 2 - 0.5,
			this.board.center.y + 0.2,
			this.board.center.z,
			0.4,
			0.5,
			3,
			0x0000ff
		);
		this.paddle1.addToScene(this.scene);
		this.paddle2.addToScene(this.scene);

		// Ball
		this.ball = new Ball(
			this.board.center.x,
			this.board.center.y + 0.2,
			this.board.center.z
		);
		this.ball.addToScene(this.scene);

		//helper
		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.target.copy(this.board.center);
		this.controls.update();

		const gridHelper = new THREE.GridHelper(20, 20);
		this.scene.add(gridHelper);

		const axesHelper = new THREE.AxesHelper(5);
		this.scene.add(axesHelper);
		//

		// this.gameState = new GameState();

		window.addEventListener("resize", () => this.onWindowResize(), false);
	}

	start() {
		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		//update movement
		this.controls.update();

		this.ball.checkPaddleCollision(this.paddle1);
		this.ball.checkPaddleCollision(this.paddle2);
		this.ball.update(this.board);
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
