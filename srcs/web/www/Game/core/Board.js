import * as THREE from "three";

export class Board {
	constructor(_x, _y, _z) {
		this.position = new THREE.Vector3(_x, _y, _z);
		this.width = 20;
		this.height = 0;
		this.depth = 10;
		this.center = new THREE.Vector3(
			_x + this.width / 2,
			_y + this.height,
			_z + this.depth / 2
		);
	}

	addToScene(scene) {
		const geometry = new THREE.PlaneGeometry(this.width, this.depth);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const plane = new THREE.Mesh(geometry, material);
		plane.rotation.x = -Math.PI / 2;
		plane.position.copy(this.center);
		plane.position.y = this.position.y;
		scene.add(plane);
	}

	inBoard(position) {
		return (
			position.x > this.position.x &&
			position.x < this.position.x + this.width &&
			position.z > this.position.z &&
			position.z < this.position.z + this.depth
		);
	}
}
