import * as THREE from 'three';

export class paddle{
	constructor(_x, _y, _z, _width, _height, _tick, _col){
		const geometry = new THREE.BoxGeometry(0.2, 1, 0.1);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(_x, _y, _z);

		this.width = _width;
		this.height = _height;
		this.tick = _tick
		this.col = _col;
		this.speed = 0;
		this.velocity = 0;
	}
	
	update(){

	}
}