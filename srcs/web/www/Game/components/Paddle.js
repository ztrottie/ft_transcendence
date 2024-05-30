import * as THREE from "three";

export class Paddle {
	constructor(_name, _x, _y, _z, _width, _height, _depth, _col) {
		//properties
		this.name = _name;
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
		this.minSpeed = 0.01; // Minimum speed
		this.maxSpeed = 0.08; // Maximum speed
		this.speed = 0; // Current speed
		this.acceleration = 0.01; // Acceleration value
		this.friction = 0.0; // Friction value
		this.direction = new THREE.Vector3(1, 0, 1); // Initial direction
	}

	addToScene(scene) {
		scene.add(this.mesh);
	}

	moveUp() {
		this.mesh.position.z -= 0.1; // Adjust the movement speed as needed
	}

	moveDown() {
		this.mesh.position.z += 0.1; // Adjust the movement speed as needed
	}

	update() {
		this.mesh.position.add(this.movement);
	}
}
