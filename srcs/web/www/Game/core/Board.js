import * as THREE from "three";

export class Board {
	constructor(_x, _y, _z) {
		this.position = new THREE.Vector3(_x, _y, _z);
		this.width = 8;
		this.height = 0;
		this.depth = 8;
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

	inBoard(position, gap = 0) {
		return (
			position.x > (this.position.x + gap) &&
			position.x < (this.position.x + this.width - gap) &&
			position.z > (this.position.z + gap) &&
			position.z < (this.position.z + this.depth - gap)
		);
	}

	isValidPaddlePosition(position, paddleHeight) {
		return (
			position.z - paddleHeight / 2 >= this.position.z &&
			position.z + paddleHeight / 2 <= this.position.z + this.depth
		);
	}	

	sideTouched(position, gap = 0) {
		if (position.x <= (this.position.x + gap) && position.z <= (this.position.z + gap)) {
			return "topLeft";
		} else if (position.x >= (this.position.x + this.width - gap) && position.z <= (this.position.z + gap)) {
			return "topRight";
		} else if (position.x <= (this.position.x + gap) && position.z >= (this.position.z + this.depth - gap)) {
			return "bottomLeft";
		} else if (position.x >= (this.position.x + this.width - gap) && position.z >= (this.position.z + this.depth - gap)) {
			return "bottomRight";
		} else if (position.x <= (this.position.x + gap)) {
			return "left";
		} else if (position.x >= (this.position.x + this.width - gap)) {
			return "right";
		} else if (position.z <= (this.position.z + gap)) {
			return "top";
		} else if (position.z >= (this.position.z + this.depth - gap)) {
			return "bottom";
		}
		return null; // Inside the board
	}
}
