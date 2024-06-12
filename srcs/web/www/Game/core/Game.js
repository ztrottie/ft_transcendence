import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
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
		this.cameraYmove = 4;
		this.cameraYspeed = 0.003;

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
			this.board.center.y + 5.5,
			this.board.center.z
		);
		this.camera.lookAt(this.board.center);

		const boxGeometry = new THREE.BoxGeometry(3, .4, 2);
		const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x808080});
		const box = new THREE.Mesh(boxGeometry, boxMaterial);
		box.position.set(this.board.center.x, this.board.center.y + 5.21, this.board.center.z);
		this.scene.add(box);

		this.rectLight = new THREE.RectAreaLight( 0xffffff, 1,  3, 2 );
		this.rectLight.position.set( this.board.center.x, this.board.center.y + 5, this.board.center.z );
		this.rectLight.lookAt( this.board.center.x, this.board.center.y, this.board.center.z );
		this.scene.add( this.rectLight )

		const rectLightHelper = new RectAreaLightHelper( this.rectLight );
		this.scene.add( rectLightHelper );

		const ambientLight = new THREE.AmbientLight(0xFFF5E1, 1); // Couleur légèrement jaunâtre avec une intensité de 1
		this.scene.add(ambientLight);

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

	animate() {
		requestAnimationFrame(() => this.animate());

		if (this.idle === true) {
			const radius = 8;
			const speed = 0.0005;
			const time = Date.now() * speed;
	
			if (this.cameraYmove >= 8)
				this.cameraYspeed *= -1;
			else if (this.cameraYmove <= 4)
				this.cameraYspeed *= -1;

			this.camera.position.x = this.board.center.x + radius * Math.cos(time);
			this.camera.position.z = this.board.center.z + radius * Math.sin(time);
			this.camera.position.y = this.board.center.y + this.cameraYmove;
	
			this.camera.lookAt(this.board.center);
			this.cameraYmove += this.cameraYspeed;
		}

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
