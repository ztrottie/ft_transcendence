import * as THREE from 'three';

export class Ball {
	constructor(_x, _y, _z) {
		const geometry = new THREE.SphereGeometry(0.2, 100, 100);
		const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(_x, _y, _z);
	}

	update() {
		//logical
	}
}