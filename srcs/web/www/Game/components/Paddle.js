import * as THREE from "three";
import { isInRectangle } from "./utils.js"

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

	ballColision(position, radius) {
		const halfWidth = this.width / 2;
		const halfHeight = this.depth / 2; // Utilisation de la profondeur (depth) pour l'axe z
	
		// Vérification des côtés
		const left = isInRectangle(position, { x: this.mesh.position.x - halfWidth - (radius/2), z: this.mesh.position.z }, radius, this.depth);
		const right = isInRectangle(position, { x: this.mesh.position.x + halfWidth + (radius/2), z: this.mesh.position.z }, radius, this.depth);
		const top = isInRectangle(position, { x: this.mesh.position.x, z: this.mesh.position.z - halfHeight - (radius/2) }, this.width, radius);
		const bottom = isInRectangle(position, { x: this.mesh.position.x, z: this.mesh.position.z + halfHeight + (radius/2) }, this.width, radius);
	
		let side = null;
		if (left) {
			side = 'left';
		} else if (right) {
			side = 'right';
		} else if (top) {
			side = 'top';
		} else if (bottom) {
			side = 'bottom';
		}
	
		if (side) {
			return side;
		}
	
		return null;
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
