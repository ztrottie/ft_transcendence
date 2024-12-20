import * as THREE from "three";

export class Paddle {
	constructor(_name, _x, _y, _z, _width, _height, _depth, _col, _life, _orientation = "vertical") {
		// Properties
		this.orientation = _orientation;
		this.height = _height;
		this.width = _width;
		this.depth = _depth;
		this.name = _name;
		this.col = _col;
		this.isMoving = false;
		this.life = _life;

		// Mesh
		this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
		this.material = new THREE.MeshStandardMaterial({ color: _col });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(_x, _y, _z);

		const edges = new THREE.EdgesGeometry(this.geometry);
		this.line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000, linewidth: 10 }));
		
		// Physics
		this.minSpeed = 0.01; // Minimum speed
		this.maxSpeed = 0.08; // Maximum speed
		this.speed = 0.0; // Current speed
		this.acceleration = 0.01; // Acceleration value
		this.friction = 0.005; // Friction value
		this.direction = new THREE.Vector3(0, 0, 0); // Initial direction
		this.firstPosition = new THREE.Vector3(_x, _y, _z); // First object position
	}
	
	addToScene(scene) {
		scene.add(this.mesh);
		scene.add(this.line);
	}

	removeFromScene(scene) {
		scene.remove(this.mesh);
		scene.remove(this.line);
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
	}

	checkLife(scene) {
		if (this.life <= 0) {
			this.removeFromScene(scene);
		}
	}

	move(direction) {
		// Update direction vector based on the input direction
		switch (direction) {
			case 'up':
				this.direction.set(0, 0, -1);
				break;
			case 'down':
				this.direction.set(0, 0, 1);
				break;
			case 'left':
				this.direction.set(-1, 0, 0);
				break;
			case 'right':
				this.direction.set(1, 0, 0);
				break;
			default:
				console.error('Direction inconnue:', direction);
				return;
		}

		// Mark that the paddle is moving
		this.isMoving = true;

		// Apply acceleration
		this.applyAcceleration();
	}

	applyAcceleration() {
		if (this.speed < this.maxSpeed) {
			this.speed += this.acceleration;
		} else if (this.speed > this.maxSpeed) {
			this.speed = this.maxSpeed;
		}
	}

	applyFriction() {
		if (this.speed > this.minSpeed) {
			this.speed -= this.friction;
			if (this.speed < this.minSpeed) {
				this.speed = this.minSpeed;
			}
		} else {
			this.speed = 0;
		}
	}

	update(board, scene) {

		// Check if the paddle is still alive
		this.checkLife(scene);

		// Apply friction only if the paddle is not moving
		if (!this.isMoving) {
			this.applyFriction();
		}

		// Calculate new position
		const displacement = this.direction.clone().multiplyScalar(this.speed);
		const newPosition = this.mesh.position.clone().add(displacement);

		// Check if the new position is valid
		if (board.isValidPaddlePosition(newPosition, this.orientation === "vertical" ? this.depth + 1 : this.width + 1, this.orientation)) {
			this.mesh.position.copy(newPosition);
			this.line.position.copy(this.mesh.position);
		} else {
			this.speed = 0;
		}

		// Reset the moving flag
		this.isMoving = false;
	}
}
