import * as THREE from "three";
export class Ball {
	constructor(_x, _y, _z) {
		// Properties
		this.radius = 0.2;
		this.lastSide = null;

		// Mesh
		this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
		this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(_x, _y, _z);

		// Light
		this.light = new THREE.PointLight(0xf44336, 30, 100);
		this.light.position.set(_x, _y, _z);

		//physics
		this.minSpeed = 0.01; // Minimum speed
		this.maxSpeed = 0.08; // Maximum speed
		this.speed = 0; // Current speed
		this.acceleration = 0.01; // Acceleration value
		this.friction = 0.0; // Friction value
		this.direction = new THREE.Vector3(1, 0, 1); // Initial direction

		// curve
		this.curveStrength = 0.02; // Adjust this value to control the curve effect
		this.curveAxis = new THREE.Vector3(0, 0, 0).normalize(); // Curve around the Y-axis
		this.curveDuration = 0; // Duration for which the curve effect is active
		this.maxCurveDuration = 50; // Maximum duration for the curve effect
	}

	addToScene(scene) {
		scene.add(this.mesh);
		scene.add(this.light);
	}

	checkPaddleCollision(paddle) {
		
	}
	
	

	applyAcceleration() {
		if (this.speed < this.maxSpeed) {
			this.speed += this.acceleration;
		}else if (this.speed > this.maxSpeed)
			this.speed = this.maxSpeed;
	}

	applyFriction() {
		if (this.speed > this.minSpeed && this.speed < this.maxSpeed) {
			this.speed -= this.friction;
		}else if (this.speed < this.minSpeed) {
			this.speed = this.minSpeed;
		}
	}

	updateDirection() {
		if (this.curveDuration > 0) {
			// Apply the curve effect by rotating the direction vector around the Y-axis
			const quaternion = new THREE.Quaternion();
			quaternion.setFromAxisAngle(this.curveAxis, this.curveStrength);
			this.direction.applyQuaternion(quaternion);
			this.direction.normalize();
		}
	}

	updatePosition() {
		const displacement = this.direction.clone().normalize().multiplyScalar(this.speed);
		this.mesh.position.add(displacement);
	}

	printValue(){
		console.log("speed:", this.speed,"curve duration:", this.curveDuration, "side touched", this.lastSide);
	}

	update(board) {
		this.printValue();
		this.applyAcceleration();
		this.applyFriction();
		this.updateDirection();
		this.updatePosition();
		this.light.position.copy(this.mesh.position);
		const side = board.sideTouched(this.mesh.position, this.radius*2);
		if (side) {
			if (side === "top" || side === "bottom") {
				this.direction.z *= -1;
			} else {
				this.direction.x *= -1;
			}
		}
		if (this.curveDuration > 0) {
			this.curveDuration--;
		}
	}
}
