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
		this.idle = true;
		this.lifeNumber = 3;
		this.roundNumber = 0;
		this.playerNumber = 2;
		
		// Board
		this.board = new Board(4, 2, 0);
		this.board.addToScene(this.scene);
		
		// Camera
		this.cameraYmove = 4;
		this.cameraYspeed = 0.003;
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

		// Camera animation properties
		this.cameraAnimating = false;
		this.cameraStartPos = new THREE.Vector3();
		this.cameraEndPos = new THREE.Vector3(this.board.center.x, this.board.center.y + 5.5, this.board.center.z);
		this.cameraStartQuat = new THREE.Quaternion();
		this.cameraEndQuat = new THREE.Quaternion();
		this.cameraAnimationTime = 2000;
		this.cameraAnimationStart = null;

		// Light
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

		const ambientLight = new THREE.AmbientLight(0xFFF5E1, 1);
		this.scene.add(ambientLight);

		// Helper controls
		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);
		this.controls.target.copy(this.board.center);
		this.controls.update();

		// const gridHelper = new THREE.GridHelper(20, 20);
		// this.scene.add(gridHelper);

		// const axesHelper = new THREE.AxesHelper(5);
		// this.scene.add(axesHelper);

		
		// Initialize paddles and ball
		this.setupPaddles();
		this.setupBall();

		// Game hendeling 
		this.gameState = new GameState();
		window.addEventListener("resize", () => this.onWindowResize(), false);
	}

	setupPaddles() {
		// Remove existing paddles from scene if they exist
		if (this.paddle1) {
			this.paddle1.removeFromScene(this.scene);
			this.paddle1 = null;
		}
		if (this.paddle2) {
			this.paddle2.removeFromScene(this.scene);
			this.paddle2 = null;
		}
		if (this.paddle3) {
			this.paddle3.removeFromScene(this.scene);
			this.paddle3 = null;
		}
		if (this.paddle4) {
			this.paddle4.removeFromScene(this.scene);
			this.paddle4 = null;
		}
	
		// Initialize paddles based on player number
		this.paddle1 = new Paddle(
			"paddle1",
			this.board.center.x - this.board.width / 2 + 0.5,
			this.board.center.y + 0.25,
			this.board.center.z,
			0.1,
			0.5,
			2,
			0xff0000,
			this.lifeNumber
		);
		this.paddle2 = new Paddle(
			"paddle2",
			this.board.center.x + this.board.width / 2 - 0.5,
			this.board.center.y + 0.25,
			this.board.center.z,
			0.1,
			0.5,
			2,
			0x0000ff,
			this.lifeNumber
		);
	
		// Add paddles to scene based on player number
		this.paddle1.addToScene(this.scene);
		this.paddle2.addToScene(this.scene);
		
		if (this.playerNumber >= 3) {
			this.paddle3 = new Paddle(
				"paddle3",
				this.board.center.x,
				this.board.center.y + 0.25,
				this.board.center.z - this.board.depth / 2 + 0.5,
				2,
				0.5,
				0.1,
				0x00FFFF,
				this.lifeNumber,
				"horizontal"
			);
			this.paddle3.addToScene(this.scene);
		} else {
			this.paddle3 = null;
		}
	
		if (this.playerNumber === 4) {
			this.paddle4 = new Paddle(
				"paddle4",
				this.board.center.x,
				this.board.center.y + 0.25,
				this.board.center.z + this.board.depth / 2 - 0.5,
				2,
				0.5,
				0.1,
				0xFFFF00,
				this.lifeNumber,
				"horizontal"
			);
			this.paddle4.addToScene(this.scene);
		} else {
			this.paddle4 = null;
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

	setIdle(idle) {
		this.idle = idle;

		if (!idle) {
			this.cameraAnimating = true;
			this.cameraStartPos.copy(this.camera.position);
			this.cameraEndPos.set(this.board.center.x, this.board.center.y + 5.5, this.board.center.z);
			this.cameraAnimationStart = Date.now();
		}
		this.camera.lookAt(this.board.center);
	}

	animateIdleCamera() {
		const radius = 8;
		const speed = 0.0005;
		const time = Date.now() * speed;
	
		if (this.cameraYmove >= 8 || this.cameraYmove <= 4) {
			this.cameraYspeed *= -1;
		}
	
		this.camera.position.x = this.board.center.x + radius * Math.cos(time);
		this.camera.position.z = this.board.center.z + radius * Math.sin(time);
		this.camera.position.y = this.board.center.y + this.cameraYmove;
	
		this.camera.lookAt(this.board.center);
		this.cameraYmove += this.cameraYspeed;
	}
	
	animateCameraTransition() {
		const elapsedTime = Date.now() - this.cameraAnimationStart;
		const t = Math.min(elapsedTime / this.cameraAnimationTime, 1);
	
		this.camera.position.lerpVectors(this.cameraStartPos, this.cameraEndPos, t);
		this.camera.lookAt(this.board.center);
	
		if (t >= 1) {
			this.cameraAnimating = false;
			this.ball.reset();
		}
	}
	
	updateMovements() {
		if (this.playerNumber >= 2) {
			this.paddle1.update(this.board, this.scene);
			this.paddle2.update(this.board, this.scene);
		}
		if (this.playerNumber >= 3) {
			this.paddle3.update(this.board, this.scene);
		}
		if (this.playerNumber === 4) {
			this.paddle4.update(this.board, this.scene);
		}
	}
	
	checkBoardCollisions() {
		this.ball.checkPaddleCollision(this.paddle1);
		this.ball.checkPaddleCollision(this.paddle2);
		if (this.playerNumber >= 3) {
			this.ball.checkPaddleCollision(this.paddle3);
		}
		if (this.playerNumber === 4) {
			this.ball.checkPaddleCollision(this.paddle4);
		}
		this.ball.update(this, this.board);
	}

	countPaddlesInLife() {
		let count = 0;
		let lastPaddle = null;
		if (this.paddle1 && this.paddle1.life > 0) count++;
		lastPaddle = "paddle1";
		if (this.paddle2 && this.paddle2.life > 0) count++;
		lastPaddle = "paddle2";
		if (this.paddle3 && this.paddle3.life > 0) count++;
		lastPaddle = "paddle3";
		if (this.paddle4 && this.paddle4.life > 0) count++;
		lastPaddle = "paddle4";

		if (count === 1) return lastPaddle;
		return null;
	}

	resetGame() {
		this.setupPaddles();
		this.setupBall();
		this.setIdle(true);
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		if (this.idle) {
			this.animateIdleCamera();
		} else if (this.cameraAnimating) {
			this.animateCameraTransition();
		}

		const inlife = this.countPaddlesInLife();
		switch(inlife) {
			case "paddle1":
				this.gameState.win_score.player1++;
				this.resetGame();
				break;
			case "paddle2":
				this.gameState.win_score.player2++;
				this.resetGame();
				break;
			case "paddle3":
				this.gameState.win_score.player3++;
				this.resetGame();
				break;
			case "paddle4":
				this.gameState.win_score.player4++;
				this.resetGame();
				break;
			}

		// State update
		this.gameState.update(this);
		this.controls.update();
		
		// Update movement
		this.updateMovements();
		this.checkBoardCollisions();

		// Render
		this.renderer.render(this.scene, this.camera);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
