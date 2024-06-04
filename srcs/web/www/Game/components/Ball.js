import * as THREE from "three";
export class Ball {
	constructor(_x, _y, _z) {
		// Properties
		this.radius = 0.2;
		this.width = this.radius * 2;
		this.height = this.radius * 2;
		this.depth = this.radius * 2;

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
		this.maxSpeed = 0.1; // Maximum speed
		this.speed = 0; // Current speed
		this.acceleration = 0.01; // Acceleration value
		this.friction = 0.0; // Friction value
		this.direction = new THREE.Vector3(1, 0, 1); // Initial direction
		this.nextPosition = new THREE.Vector3(1, 0, 1);

		// curve
		// this.curveStrength = 0.02; // Adjust this value to control the curve effect
		// this.curveAxis = new THREE.Vector3(0, 0, 1).normalize(); // Curve around the Y-axis
		// this.curveDuration = 0; // Duration for which the curve effect is active
		// this.maxCurveDuration = 50; // Maximum duration for the curve effect

		this.cooldown = 0;
	}

	addToScene(scene) {
		scene.add(this.mesh);
		scene.add(this.light);
	}

	removeFromScene(scene) {
		scene.remove(this.mesh);
		scene.remove(this.light);
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		this.light = null;
		this.mesh = null;
	}

	applyForce(forceVector) {
		this.direction.add(forceVector);
	}

	collides(pos, obj2) {
		const halfWidth1 = this.width / 2;
		const halfHeight1 = this.height / 2;
		const halfDepth1 = this.depth / 2;
	
		const halfWidth2 = obj2.width / 2;
		const halfHeight2 = obj2.height / 2;
		const halfDepth2 = obj2.depth / 2;
	
		return pos.x - halfWidth1 < obj2.mesh.position.x + halfWidth2 &&
			pos.x + halfWidth1 > obj2.mesh.position.x - halfWidth2 &&
			pos.y - halfHeight1 < obj2.mesh.position.y + halfHeight2 &&
			pos.y + halfHeight1 > obj2.mesh.position.y - halfHeight2 &&
			pos.z - halfDepth1 < obj2.mesh.position.z + halfDepth2 &&
			pos.z + halfDepth1 > obj2.mesh.position.z - halfDepth2;
	}

	checkPaddleCollision(paddle) {
		// Calculer la position future de la balle
		this.nextPosition.copy(this.mesh.position).add(this.direction.clone().normalize().multiplyScalar(this.speed));
	  
		// Vérifier la collision avec la future position
		const a = this.collides(this.nextPosition, paddle);
		if (a) {
		  console.log("Collision detected!");
	  
		  // Ajuster la direction de la balle en fonction de la direction de collision
		  if (this.nextPosition.x < paddle.mesh.position.x - paddle.width / 2 || this.nextPosition.x > paddle.mesh.position.x + paddle.width / 2) {
			this.direction.x *= -1;
			// Positionner la balle juste à l'extérieur du paddle
			this.mesh.position.x = this.nextPosition.x < paddle.mesh.position.x ? 
			  paddle.mesh.position.x - paddle.width / 2 - this.width / 2 :
			  paddle.mesh.position.x + paddle.width / 2 + this.width / 2;
		  }
		  
		  if (this.nextPosition.z < paddle.mesh.position.z - paddle.depth / 2 || this.nextPosition.z > paddle.mesh.position.z + paddle.depth / 2) {
			this.direction.z *= -1;
			// Positionner la balle juste à l'extérieur du paddle
			this.mesh.position.z = this.nextPosition.z < paddle.mesh.position.z ? 
			  paddle.mesh.position.z - paddle.depth / 2 - this.depth / 2 :
			  paddle.mesh.position.z + paddle.depth / 2 + this.depth / 2;
		  }
		}
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
		}
	
		// Ensure the direction is not (0, 0, 1)
		const epsilon = 0.2;
		if (Math.abs(this.direction.x) < epsilon && Math.abs(this.direction.y) < epsilon && Math.abs(this.direction.z - 1) < epsilon) {
			this.direction.x += epsilon;
			this.direction.z -= epsilon;
			this.direction.normalize();
		}
	
		this.direction.normalize();
	}

	updatePosition() {
		const displacement = this.direction.clone().normalize().multiplyScalar(this.speed);
		this.mesh.position.add(displacement);
		this.nextPosition = new THREE.Vector3().addVectors(this.mesh.position, this.direction.clone().normalize().multiplyScalar(this.speed));

	}

	printValue(){
		console.log("speed:", this.speed, "dir X:", this.direction.x);
	}

	update(board) {
		//  this.printValue();
		this.applyAcceleration();
		this.applyFriction();
		// this.updateDirection();
		this.updatePosition();
		this.light.position.copy(this.mesh.position);
		const side = board.sideTouched(this.mesh.position, this.radius*2);
		if (side) {
			if (side === "top" || side === "bottom") {
				this.direction.z *= -1;
			} else if (side === "left" || side === "right") {
				this.direction.x *= -1;
				console.log("die");
			} else {
				this.direction.x *= -1;
				this.direction.z *= -1;
			}
		}
		// if (this.curveDuration > 0) {
		// 	this.curveDuration--;
		// }
	}
}
