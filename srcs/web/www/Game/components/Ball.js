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
		this.minSpeed = 0.01;
		this.maxSpeed = 0.1;
		this.speed = 0;
		this.acceleration = 0.01;
		this.friction = 0.0;
		this.direction = new THREE.Vector3(1, 0, 1);
		this.firstPosition = new THREE.Vector3(_x, _y, _z);
		this.nextPosition = new THREE.Vector3(1, 0, 1);
	}
	
	addToScene(scene) {
		scene.add(this.mesh);
		scene.add(this.light);
	}
	
	removeFromScene(scene) {
		scene.remove(this.mesh);
		scene.remove(this.light);
		this.mesh.position = firstPosition;
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
			if (paddle.orientation == "vertical" && (this.nextPosition.x < paddle.mesh.position.x - paddle.width / 2 || this.nextPosition.x > paddle.mesh.position.x + paddle.width / 2)) {
				this.direction.x *= -1;
				// Positionner la balle juste à l'extérieur du paddle
				this.mesh.position.x = this.nextPosition.x < paddle.mesh.position.x ? 
				paddle.mesh.position.x - paddle.width / 2 - this.width / 2 :
				paddle.mesh.position.x + paddle.width / 2 + this.width / 2;
			}

			if (paddle.orientation == "horizontal" && (this.nextPosition.z < paddle.mesh.position.z - paddle.depth / 2 || this.nextPosition.z > paddle.mesh.position.z + paddle.depth / 2)) {
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

	updatePosition() {
		const displacement = this.direction.clone().normalize().multiplyScalar(this.speed);
		this.mesh.position.add(displacement);
		this.nextPosition = new THREE.Vector3().addVectors(this.mesh.position, this.direction.clone().normalize().multiplyScalar(this.speed));
	}

	update(board) {
		this.applyAcceleration();
		this.applyFriction();
		this.updatePosition();
		this.light.position.copy(this.mesh.position);
		const side = board.sideTouched(this.mesh.position, this.radius*2);
		if (side) {
			if (side === "top"){
				this.direction.z *= -1;
				const btop = board.center.z - board.depth / 2;
				this.mesh.position.z = btop + this.radius * 2;
			}
			else if (side === "bottom") {
				this.direction.z *= -1;
				const btop = board.center.z + board.depth / 2;
				this.mesh.position.z = btop - this.radius * 2;
			} else if (side === "left"){
				this.direction.x *= -1;
				const bleft = board.center.x - board.width / 2;
				this.mesh.position.x = bleft + this.radius * 2;
				console.log("die");
			}else if (side === "right") {
				this.direction.x *= -1;
				const bright = board.center.x + board.width / 2;
				this.mesh.position.x = bright - this.radius * 2;
				console.log("die");
			} else {
				this.direction.x *= -1;
				this.direction.z *= -1;
			}
		}
	}
}
