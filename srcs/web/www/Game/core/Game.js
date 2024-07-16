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

		// this.scene.background = new THREE.Color(0x444444);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		// Properties
		this.lifeNumber = 3;
		this.roundNumber = 0;
		this.playerNumber = 2;
		this.reverse = false;
		this.gameMode = null;
		
		// Players
		this.players = [];
		
		// Board
		this.board = new Board(4, 2, 0, this.scene);
		this.board.addToScene(this.scene);
		
		//paddles
		this.paddles = [];
		
		// Camera
		this.cameraHeight = 8;
		this.cameraDistance = 10;
		this.cameraYmove = 10;
		this.cameraYspeed = 0.003;
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);		
		this.camera.lookAt(this.board.center);

		// Camera animation properties
		this.cameraAnimating = false;
		this.cameraStartPos = new THREE.Vector3();
		this.cameraEndPos = new THREE.Vector3(this.board.center.x, this.board.center.y + this.cameraHeight, this.board.center.z);
		this.cameraStartQuat = new THREE.Quaternion();
		this.cameraEndQuat = new THREE.Quaternion();
		this.cameraAnimationTime = 1000;
		this.cameraAnimationStart = null;

		// Lights
		this.rectLight = new THREE.RectAreaLight( 0xFFFFFF, 10, 5, 2 );
		this.rectLight.position.set( this.board.center.x, this.board.center.y + 5, this.board.center.z );
		this.rectLight.lookAt( this.board.center.x, this.board.center.y, this.board.center.z );
		this.scene.add( this.rectLight )

		// Light helper
		// const rectLightHelper = new RectAreaLightHelper( this.rectLight );
		// this.scene.add( rectLightHelper );

		// const ambientLight = new THREE.AmbientLight(0xFFF5E1, 0.5);
		// this.scene.add(ambientLight);

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
		this.manager = new GameState();
		window.addEventListener("resize", () => this.onWindowResize(), false);

		// Background generation
		this.backgroundGeneration();
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

	setupPaddles() {
		// Remove existing paddles from scene if they exist
		if (this.paddles[0]) {
			this.paddles[0].removeFromScene(this.scene);
			this.paddles[0] = null;
		}
		if (this.paddles[1]) {
			this.paddles[1].removeFromScene(this.scene);
			this.paddles[1] = null;
		}
		if (this.paddles[2]) {
			this.paddles[2].removeFromScene(this.scene);
			this.paddles[2] = null;
		}
		if (this.paddles[3]) {
			this.paddles[3].removeFromScene(this.scene);
			this.paddles[3] = null;
		}
	
		// Initialize paddles based on player number
		this.paddles[0] = new Paddle(
			this.players[0],
			this.board.center.x - this.board.width / 2 + 0.5,
			this.board.center.y + 0.25,
			this.board.center.z,
			0.1,
			0.5,
			2,
			0xff0000,
			this.lifeNumber
		);
		this.paddles[1] = new Paddle(
			this.players[1],
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
		this.paddles[0].addToScene(this.scene);
		this.paddles[1].addToScene(this.scene);
		
		if (this.playerNumber >= 3) {
			this.paddles[2] = new Paddle(
				this.players[2],
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
			this.paddles[2].addToScene(this.scene);
		} else {
			this.paddles[2] = null;
		}
	
		if (this.playerNumber === 4) {
			this.paddles[3] = new Paddle(
				this.players[3],
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
			this.paddles[3].addToScene(this.scene);
		} else {
			this.paddles[3] = null;
		}
	}	

	isInSafeZone(x, y, z, origin, range = 10) {
		const safeZoneSize = range; // Taille de la zone de sécurité (carré centré à l'origine)
		return (
			x > origin.x - safeZoneSize && x < origin.x + safeZoneSize &&
			y > origin.y - safeZoneSize && y < origin.y + safeZoneSize &&
			z > origin.z - safeZoneSize && z < origin.z + safeZoneSize
		);
	}

	backgroundGeneration() {
		for (let i = 0; i < 3000; i++) {
			this.createRandomCube(this.board.center, 8, 80);
		}
		for (let i = 0; i < 40; i++) {
			this.createRandomLight(this.board.center, 30, 100);
		}
	}

	createRandomCube(origin, safeZoneSize, rangeMax) {
		
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshStandardMaterial({ color: 0x98806A });
		const cube = new THREE.Mesh(geometry, material);
	
		let x, y, z;
		do {
			x = origin.x + Math.random() * (2 * rangeMax) - rangeMax;
			y = origin.y + Math.random() * (2 * rangeMax) - rangeMax;
			z = origin.z + Math.random() * (2 * rangeMax) - rangeMax;
		} while (this.isInSafeZone(x, y, z, origin, safeZoneSize));
	
		cube.position.set(x, y, z);
	
		cube.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);

		this.scene.add(cube);
	}

	createRandomLight(origin, safeZoneSize, rangeMax) {
		const light = new THREE.PointLight(0xF98E1C, 2.5, 90);
	
		let x, y, z;
		do {
			x = origin.x + Math.random() * (2 * rangeMax) - rangeMax;
			y = origin.y + Math.random() * (2 * rangeMax) - rangeMax;
			z = origin.z + Math.random() * (2 * rangeMax) - rangeMax;
		} while (this.isInSafeZone(x, y, z, origin, safeZoneSize));
	
		light.position.set(x, y, z);
	
		this.scene.add(light);
	}

	setIdle() {
		this.ball.reset();
		this.cameraAnimating = true;
		this.cameraStartPos.copy(this.camera.position);
		this.cameraEndPos.set(this.board.center.x, this.board.center.y + this.cameraHeight, this.board.center.z);
		this.cameraAnimationStart = Date.now();
		this.camera.lookAt(this.board.center);
	}

	animateIdleCamera() {
		const radius = this.cameraDistance;
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
	
		const cameraDistance = 200; // Camera distance from the board
		const upPosition = new THREE.Vector3(this.board.center.x, this.board.center.y + cameraDistance, this.board.center.z);
	
		if (elapsedTime < 50) { // 50 ms
			this.camera.position.copy(upPosition);
		} else {
			this.camera.position.lerpVectors(upPosition, this.cameraEndPos, t);
		}
	
		this.camera.lookAt(this.board.center);
	
		if (t >= 1) {
			this.cameraAnimating = false;
			this.ball.reset();
		}
	}
	
	updateMovements() {
		if (this.playerNumber >= 2) {
			this.paddles[0].update(this.board, this.scene);
			this.paddles[1].update(this.board, this.scene);
		}
		if (this.playerNumber >= 3) {
			this.paddles[2].update(this.board, this.scene);
		}
		if (this.playerNumber === 4) {
			this.paddles[3].update(this.board, this.scene);
		}
	}
	
	checkBoardCollisions() {
		this.ball.checkPaddleCollision(this, this.paddles[0]);
		this.ball.checkPaddleCollision(this, this.paddles[1]);
		if (this.playerNumber >= 3) {
			this.ball.checkPaddleCollision(this, this.paddles[2]);
		}
		if (this.playerNumber === 4) {
			this.ball.checkPaddleCollision(this, this.paddles[3]);
		}
		this.ball.update(this, this.board);
	}

	countPaddlesInLife() {
		let count = 0;
		let lastPaddle = null;
		if (this.paddles[0] && this.paddles[0].life > 0) count++;
		lastPaddle = "paddle1";
		if (this.paddles[1] && this.paddles[1].life > 0) count++;
		lastPaddle = "paddle2";
		if (this.paddles[2] && this.paddles[2].life > 0) count++;
		lastPaddle = "paddle3";
		if (this.paddles[3] && this.paddles[3].life > 0) count++;
		lastPaddle = "paddle4";

		if (count === 1) return lastPaddle;
		return null;
	}

	resetRound() {
		this.setupPaddles();
		this.setupBall();
		this.manager.setState("idle", this);
		console.log("Round reset");
	}

	resetGame(){
		this.manager.win_score.player1 = 0;
		this.manager.win_score.player2 = 0;
		this.manager.win_score.player3 = 0;
		this.manager.win_score.player4 = 0;
		this.resetRound();
		console.log("Game reset");
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	start() {
		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		// Pause
		if (this.manager.state.pause){
			this.manager.update(this);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
			return;
		} 

		// Camera animation
		if (this.manager.state.idle) {
			this.animateIdleCamera();
		}
		else if (this.cameraAnimating) {
			this.animateCameraTransition();
		}
		
		// Check for the winner of the round
		const inlife = this.countPaddlesInLife();
		switch(inlife) {
			case "paddle1":
				this.manager.win_score.player1++;
				this.resetRound();
				break;
			case "paddle2":
				this.manager.win_score.player2++;
				this.resetRound();
				break;
			case "paddle3":
				this.manager.win_score.player3++;
				this.resetRound();
				break;
			case "paddle4":
				this.manager.win_score.player4++;
				this.resetRound();
				break;
		}

		// State update
		this.manager.update(this);
		this.controls.update();
		this.board.update(this);
		
		// Update movement
		this.updateMovements();
		this.checkBoardCollisions();

		// Render
		this.renderer.render(this.scene, this.camera);
	}
}
