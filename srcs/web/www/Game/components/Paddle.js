import * as THREE from "three";

export class Paddle {
	constructor(_x, _y, _z, _width, _height, _depth, _col) {
		//properties
		this.width = _width;
		this.height = _height;
		this.depth = _depth;
		this.col = _col;

		//mesh
		this.geometry = new THREE.BoxGeometry(
			this.width,
			this.height,
			this.depth
		);
		this.material = new THREE.MeshToonMaterial({ color: _col });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(_x, _y, _z);

		//physics
		this.speed = 0;
		this.acceleration = 0;
		this.velocity = 0;
		this.friction = 0;
	}

	addToScene(scene) {
		scene.add(this.mesh);
	}

	update() {
		this.velocity += this.acceleration;
		this.velocity *= this.friction;
		this.mesh.position.z += this.velocity;
	}
}
