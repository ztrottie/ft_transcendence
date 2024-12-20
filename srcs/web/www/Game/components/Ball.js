import * as THREE from "three";
export class Ball {
	constructor(_x, _y, _z, game) {
		// Properties
		this.radius = 0.2;
		this.width = this.radius * 2;
		this.height = this.radius * 2;
		this.depth = this.radius * 2;
		this.lastPaddle = null;
		
		// Mesh
		this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
		this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(_x, _y, _z);
		
		// Light
		this.light = new THREE.PointLight(0xffff00, 1, 10);
		this.light.position.set(_x, _y + 2, _z);

		//physics
		this.minSpeed = 0.01;
		this.maxSpeed = game.ballMaxSpeed;
		this.speed = 0;
		this.acceleration = 0.001;
		this.friction = 0.0;
		this.direction = this.getRandomDirection();
		this.firstPosition = new THREE.Vector3(_x, _y, _z);
		this.nextPosition = new THREE.Vector3(1, 0, 1);

		// Cooldown
		this.cooldown = 3000; // 3 seconds
		this.cooldownTimer = 0;
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
	}	
	
	getRandomDirection() {
		let direction;
		do {
			const randomX = (Math.random() - 0.5) * 2;
			const randomY = 0;
			const randomZ = (Math.random() - 0.5) * 2;
			direction = new THREE.Vector3(randomX, randomY, randomZ).normalize();
		} while (Math.abs(direction.x) < 0.2 || Math.abs(direction.z) < 0.2);
		return direction;
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

	checkPaddleCollision(game, paddle) {
		this.lastPaddle = paddle.name;
		this.nextPosition.copy(this.mesh.position).add(this.direction.clone().normalize().multiplyScalar(this.speed));
	
		if (paddle.life > 0 && this.collides(this.nextPosition, paddle)) {

			if (game.reverse){
				if (paddle.life > 0) this.reset();
				if (!game.manager.state.idle && paddle.life > 0) paddle.life--;
				return;
			}
	
			// Add some randomness to the direction after collision
			const randomFactor = 0.4;
			const randomX = (Math.random() - 0.5) * randomFactor;
			const randomZ = (Math.random() - 0.5) * randomFactor;
	
			// Adjust this value to control the amount of influence from the paddle's movement
			const influenceFactor = 0.4;
	
			if (paddle.orientation == "vertical" && (this.nextPosition.x < paddle.mesh.position.x - paddle.width / 2 || this.nextPosition.x > paddle.mesh.position.x + paddle.width / 2)) {
				this.direction.x *= -1;
				this.direction.x += randomX;
	
				// If the paddle is moving up or down, adjust the ball's Z direction
				if (paddle.direction.z !== 0) {
					this.direction.z = paddle.direction.z * influenceFactor;
				} else {
					this.direction.z += randomZ;
				}
	
				// Add small deviation
				const deviationAngle = 0.1; // Adjust this value as needed
				this.direction.x += (Math.random() - 0.5) * deviationAngle;
				this.direction.z += (Math.random() - 0.5) * deviationAngle;
				this.direction.normalize();
	
				this.mesh.position.x = this.nextPosition.x < paddle.mesh.position.x ?
					paddle.mesh.position.x - paddle.width / 2 - this.width / 2 :
					paddle.mesh.position.x + paddle.width / 2 + this.width / 2;
			}
	
			if (paddle.orientation == "horizontal" && (this.nextPosition.z < paddle.mesh.position.z - paddle.depth / 2 || this.nextPosition.z > paddle.mesh.position.z + paddle.depth / 2)) {
				this.direction.z *= -1;
				this.direction.z += randomZ;
	
				// If the paddle is moving left or right, adjust the ball's X direction
				if (paddle.direction.x !== 0) {
					this.direction.x = paddle.direction.x * influenceFactor;
				} else {
					this.direction.x += randomX;
				}
	
				// Add small deviation
				const deviationAngle = 0.1; // Adjust this value as needed
				this.direction.x += (Math.random() - 0.5) * deviationAngle;
				this.direction.z += (Math.random() - 0.5) * deviationAngle;
				this.direction.normalize();
	
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

	reset() {
		this.mesh.position.copy(this.firstPosition);
		this.direction = this.getRandomDirection();
		this.speed = 0;
		this.light.position.copy(this.mesh.position);
		this.cooldownTimer = Date.now() + this.cooldown;
	}	

	updatePosition() {
		const displacement = this.direction.clone().normalize().multiplyScalar(this.speed);
		this.mesh.position.add(displacement);
		this.nextPosition = new THREE.Vector3().addVectors(this.mesh.position, this.direction.clone().normalize().multiplyScalar(this.speed));
	}

	reverseColision(game, board){
		const gap = this.radius * 2 + 0.08;
		const side = board.sideTouched(this.mesh.position, gap);
		if (side) {
			switch (side) {
				case "top":
					this.direction.z *= -1;
					const btop = board.center.z - board.depth / 2;
					this.mesh.position.z = btop + gap ;
					if (!game.reverse && game.paddles[2] && game.paddles[2].life > 0) this.reset();
					if (!game.reverse && !game.manager.state.idle && game.paddles[2] && game.paddles[2].life > 0) game.paddles[2].life--;
					break;
				case "bottom":
					this.direction.z *= -1;
					const bbot = board.center.z + board.depth / 2;
					this.mesh.position.z = bbot - gap;
					if (!game.reverse && game.paddles[3] && game.paddles[3].life > 0) this.reset();
					if (!game.reverse && !game.manager.state.idle && game.paddles[3] && game.paddles[3].life > 0) game.paddles[3].life--;
					break;
				case "left":
					this.direction.x *= -1;
					const bleft = board.center.x - board.width / 2;
					this.mesh.position.x = bleft + gap;
					if (!game.reverse && game.paddles[0] && game.paddles[0].life > 0) this.reset();
					if (!game.reverse && !game.manager.state.idle && game.paddles[0] && game.paddles[0].life > 0) game.paddles[0].life--;
					break;
				case "right":
					this.direction.x *= -1;
					const bright = board.center.x + board.width / 2;
					this.mesh.position.x = bright - gap;
					if (!game.reverse && game.paddles[1] && game.paddles[1].life > 0) this.reset(); // wall hit
					if (!game.reverse && !game.manager.state.idle && game.paddles[1] && game.paddles[1].life > 0) game.paddles[1].life--;
					break;
				default:
					this.direction.x *= -1;
					this.direction.z *= -1;
					break;
			}
		}
	}

	normalColision(game, board){
		const gap = this.radius * 2 + 0.08;
		const side = board.sideTouched(this.mesh.position, gap);
		if (side) {
			switch (side) {
				case "top":
					this.direction.z *= -1;
					const btop = board.center.z - board.depth / 2;
					this.mesh.position.z = btop + gap ;
					if (game.paddles[2] && game.paddles[2].life > 0) this.reset();
					if (!game.manager.state.idle && game.paddles[2] && game.paddles[2].life > 0) game.paddles[2].life--;
					break;
				case "bottom":
					this.direction.z *= -1;
					const bbot = board.center.z + board.depth / 2;
					this.mesh.position.z = bbot - gap;
					if (game.paddles[3] && game.paddles[3].life > 0) this.reset();
					if (!game.manager.state.idle && game.paddles[3] && game.paddles[3].life > 0) game.paddles[3].life--;
					break;
				case "left":
					this.direction.x *= -1;
					const bleft = board.center.x - board.width / 2;
					this.mesh.position.x = bleft + gap;
					if (game.paddles[0] && game.paddles[0].life > 0) this.reset();
					if (!game.manager.state.idle && game.paddles[0] && game.paddles[0].life > 0) game.paddles[0].life--;
					break;
				case "right":
					this.direction.x *= -1;
					const bright = board.center.x + board.width / 2;
					this.mesh.position.x = bright - gap;
					if (game.paddles[1] && game.paddles[1].life > 0) this.reset(); // wall hit
					if (!game.manager.state.idle && game.paddles[1] && game.paddles[1].life > 0) game.paddles[1].life--;
					break;
				default:
					this.direction.x *= -1;
					this.direction.z *= -1;
					break;
			}
		}
	}

	update(game, board) {
		
		const currentTime = Date.now();
		if (currentTime < this.cooldownTimer) {
			return; // Ball is on cooldown
		}
		this.applyAcceleration();
		this.applyFriction();
		this.updatePosition();
		this.light.position.copy(this.mesh.position);
		
		if (game.reverse){
			this.reverseColision(game, board);
		}else{
			this.normalColision(game, board);
		}
	}
}
