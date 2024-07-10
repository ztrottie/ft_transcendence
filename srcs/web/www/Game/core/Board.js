import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Text } from "../components/Text.js";
export class Board {
	constructor(_x, _y, _z, _scene) {
		this.position = new THREE.Vector3(_x, _y, _z);
		this.width = 8;
		this.height = 0;
		this.depth = 8;
		this.center = new THREE.Vector3(
			_x + this.width / 2,
			_y + this.height,
			_z + this.depth / 2
		);
		this.geometry = new THREE.PlaneGeometry(this.width, this.depth);
		this.material = new THREE.MeshStandardMaterial({ color: 0x228A37 });
		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.plane.rotation.x = -Math.PI / 2;
		this.plane.position.copy(this.center);
		this.plane.position.y = this.position.y;
		this.scene = _scene;
		this.texts = [];

		//texts
		this.texts[0] = new Text(this.scene, new THREE.Vector3(this.center.x - 3, this.center.y, this.center.z), '');
		this.texts[1] = new Text(this.scene, new THREE.Vector3(this.center.x + 3, this.center.y, this.center.z), '');
		this.texts[2] = new Text(this.scene, new THREE.Vector3(this.center.x, this.center.y, this.center.z - 3), '');
		this.texts[3] = new Text(this.scene, new THREE.Vector3(this.center.x, this.center.y, this.center.z + 3), '');

		
		// Wall properties
		const wallHeight = 0.2;
		const wallThickness = 0.1;
		const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x98806A });

		// Top
		const topWallGeometry = new THREE.BoxGeometry(this.width, wallHeight, wallThickness);
		this.topWall = new THREE.Mesh(topWallGeometry, wallMaterial);
		this.topWall.position.set(this.center.x, this.position.y + wallHeight / 2, this.position.z + wallThickness / 2);

		// Bottom
		const bottomWallGeometry = new THREE.BoxGeometry(this.width, wallHeight, wallThickness);
		this.bottomWall = new THREE.Mesh(bottomWallGeometry, wallMaterial);
		this.bottomWall.position.set(this.center.x, this.position.y + wallHeight / 2, this.position.z + this.depth - wallThickness / 2);

		// Left
		const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, this.depth);
		this.leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
		this.leftWall.position.set(this.position.x + wallThickness / 2, this.position.y + wallHeight / 2, this.center.z);

		// Right
		const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, this.depth);
		this.rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
		this.rightWall.position.set(this.position.x + this.width - wallThickness / 2, this.position.y + wallHeight / 2, this.center.z);
	}

	addToScene(scene) {
		scene.add(this.plane);
		scene.add(this.topWall);
		scene.add(this.bottomWall);
		scene.add(this.leftWall);
		scene.add(this.rightWall);
	}

	isValidPaddlePosition(position, paddleSize, orientation) {
		if (orientation === "vertical") {
			return (
				position.z - paddleSize / 2 >= this.position.z &&
				position.z + paddleSize / 2 <= this.position.z + this.depth
			);
		} else if (orientation === "horizontal") {
			return (
				position.x - paddleSize / 2 >= this.position.x &&
				position.x + paddleSize / 2 <= this.position.x + this.width
			);
		}
		return false;
	}

	sideTouched(position, gap = 0) {
		if (position.x <= (this.position.x + gap)) {
			return "left";
		} else if (position.x >= (this.position.x + this.width - gap)) {
			return "right";
		} else if (position.z <= (this.position.z + gap)) {
			return "top";
		} else if (position.z >= (this.position.z + this.depth - gap)) {
			return "bottom";
		}
		return null;
	}

	update(game){
		for (let i = 0; i < this.texts.length; i++) {
			if (!game.manager.state.idle && game.paddles[i] && game.paddles[i].life > 0)
				this.texts[i].update(game.paddles[i].life);
			else
				this.texts[i].update('');
		}
	}
}