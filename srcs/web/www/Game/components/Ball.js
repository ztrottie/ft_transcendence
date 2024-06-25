import * as THREE from "three";

export class Ball {
	constructor(_x, _y, _z) {
		//properties
		this.radius = 0.2;
		this.speed = 0.03;

		//mesh
		this.geometry = new THREE.SphereGeometry(this.radius, 1000, 1000);
		this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(_x, _y, _z);

		//light
		this.light = new THREE.PointLight(0xf44336, 30, 100);
		this.light.position.set(_x, _y, _z);

		//physics
		this.velocity = new THREE.Vector3(this.speed * 2, 0, this.speed);
	}

	addToScene(scene) {
		scene.add(this.mesh);
		scene.add(this.light);
	}

	checkPaddleCollision(paddle) {
		if (
			this.mesh.position.x - this.radius <
				paddle.mesh.position.x + paddle.width / 2 &&
			this.mesh.position.x + this.radius >
				paddle.mesh.position.x - paddle.width / 2 &&
			this.mesh.position.y - this.radius <
				paddle.mesh.position.y + paddle.height / 2 &&
			this.mesh.position.y + this.radius >
				paddle.mesh.position.y - paddle.height / 2 &&
			this.mesh.position.z - this.radius <
				paddle.mesh.position.z + paddle.depth / 2 &&
			this.mesh.position.z + this.radius >
				paddle.mesh.position.z - paddle.depth / 2
		) {
			this.velocity.x = -this.velocity.x + paddle.velocity * 0.5;
		}
	}

	update(board) {
		this.light.position.copy(this.mesh.position);
		this.mesh.position.add(this.velocity);
		const edgeSpace = 0.4;

		if (
			this.mesh.position.x - this.radius <=
				board.position.x + edgeSpace ||
			this.mesh.position.x + this.radius >=
				board.position.x + board.width - edgeSpace
		) {
			this.velocity.x = -this.velocity.x;
		}

		if (
			this.mesh.position.z - this.radius <=
				board.position.z + edgeSpace ||
			this.mesh.position.z + this.radius >=
				board.position.z + board.depth - edgeSpace
		) {
			this.velocity.z = -this.velocity.z;
		}
	}
}
