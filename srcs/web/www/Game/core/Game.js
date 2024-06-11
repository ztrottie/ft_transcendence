import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Ball } from "../components/Ball.js";
import { Board } from "./Board.js";
import { Paddle } from "../components/Paddle.js";
import { GameState } from "./GameState.js";

export class Game {
	constructor() {
		// Scene and renderer
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		// Properties
		this.lifeNumber = 0;
		this.roundNumber = 0;
		this.playerNumber = 4;
		this.idle = false;

		// Board
		this.board = new Board(4, 2, 0);
		this.board.addToScene(this.scene);

		// Camera
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
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
			this.board.center.y + 5,
			this.board.center.z
		);

		// Helper controls
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

		this.gameState = new GameState();

		window.addEventListener("resize", () => this.onWindowResize(), false);

		// Initialize paddles and ball
		this.setupPaddles();
		this.setupBall();
	}

	setupPaddles() {
		// Remove existing paddles from scene if they exist
		if (this.paddle1) this.paddle1.removeFromScene(this.scene);
		if (this.paddle2) this.paddle2.removeFromScene(this.scene);
		if (this.paddle3) this.paddle3.removeFromScene(this.scene);
		if (this.paddle4) this.paddle4.removeFromScene(this.scene);

		// Initialize paddles based on player number
		this.paddle1 = new Paddle(
			"paddle1",
			this.board.center.x - this.board.width / 2 + 0.5,
			this.board.center.y + 0.25,
			this.board.center.z,
			0.1,
			0.5,
			2,
			0xff0000
		);
		this.paddle2 = new Paddle(
			"paddle2",
			this.board.center.x + this.board.width / 2 - 0.5,
			this.board.center.y + 0.25,
			this.board.center.z,
			0.1,
			0.5,
			2,
			0x0000ff
		);

		this.paddle3 = new Paddle(
			"paddle3",
			this.board.center.x,
			this.board.center.y + 0.25,
			this.board.center.z - this.board.depth / 2 + 0.5,
			2,
			0.5,
			0.1,
			0x00FFFF,
			"horizontal"
		);

		this.paddle4 = new Paddle(
			"paddle4",
			this.board.center.x,
			this.board.center.y + 0.25,
			this.board.center.z + this.board.depth / 2 - 0.5,
			2,
			0.5,
			0.1,
			0xFFFF00,
			"horizontal"
		);

		// Add paddles to scene based on player number
		this.paddle1.addToScene(this.scene);
		this.paddle2.addToScene(this.scene);
		if (this.playerNumber >= 3) {
			this.paddle3.addToScene(this.scene);
		}
		if (this.playerNumber === 4) {
			this.paddle4.addToScene(this.scene);
		}
	}

	setupBall() {
		// Remove existing ball from scene if it exists
		if (this.ball) this.ball.removeFromScene(this.scene);

		// Initialize ball
		this.ball = new Ball(
			this.board.center.x,
			this.board.center.y + 0.2,
			this.board.center.z
		);
		this.ball.addToScene(this.scene);
	}

	start() {
		this.animate();
	}

	reset() {
		// Reset paddles
		if (this.paddle1) this.paddle1.mesh.position.copy(this.paddle1.firstPosition);
		if (this.paddle2) this.paddle2.mesh.position.copy(this.paddle2.firstPosition);
		if (this.playerNumber >= 3 && this.paddle3) this.paddle3.mesh.position.copy(this.paddle3.firstPosition);
		if (this.playerNumber === 4 && this.paddle4) this.paddle4.mesh.position.copy(this.paddle4.firstPosition);
	
		// Reset ball
		if (this.ball) this.ball.reset();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		// State update
		this.gameState.update(this);

		// Update movement
		this.controls.update();

		// Paddles
		if (this.playerNumber >= 2) {
			this.paddle1.update(this.board);
			this.paddle2.update(this.board);
		}
		if (this.playerNumber >= 3) {
			this.paddle3.update(this.board);
		}
		if (this.playerNumber === 4) {
			this.paddle4.update(this.board);
		}

		// Ball
		this.ball.checkPaddleCollision(this.paddle1);
		this.ball.checkPaddleCollision(this.paddle2);
		if (this.playerNumber >= 3) {
			this.ball.checkPaddleCollision(this.paddle3);
		}
		if (this.playerNumber === 4) {
			this.ball.checkPaddleCollision(this.paddle4);
		}
		this.ball.update(this, this.board);

		// Render
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	setPlayerNumber(playerNumber) {
		this.playerNumber = playerNumber;
		this.setupPaddles(); // Re-setup paddles based on new player number
	}
}
