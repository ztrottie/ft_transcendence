import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export class Text {
	constructor(scene, position, initialText) {
		this.scene = scene;
		this.position = position;
		this._text = initialText;
		this.textMesh = null;
		this.font = null;

		this.loadFont();
	}

	loadFont() {
		const loader = new FontLoader();
		loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
			this.font = font;
			this.createTextMesh();
		});
	}
	

	createTextMesh() {
		if (!this.font) {
			console.error('Font not loaded yet');
			return;
		}

		if (this.textMesh) {
			this.scene.remove(this.textMesh);
			this.textMesh.geometry.dispose();
			this.textMesh.material.dispose();
		}
	
		const textGeometry = new TextGeometry(String(this._text), {
			font: this.font,
			size: 0.5,
			height: 0.1,
			curveSegments: 12,
			bevelEnabled: false,
		});
	
		const textMaterial = new THREE.MeshStandardMaterial({ color: 0x245287 });
		this.textMesh = new THREE.Mesh(textGeometry, textMaterial);
	
		textGeometry.computeBoundingBox();
		const bbox = textGeometry.boundingBox;
		const textWidth = bbox.max.x - bbox.min.x;
		const textDepth = bbox.max.z - bbox.min.z;
	
		// Centrer le texte
		this.textMesh.position.set(
			this.position.x - (textWidth / 2) - (textWidth / 8),
			this.position.y,
			this.position.z + textDepth * 2
		);
		
		this.textMesh.rotation.x = -Math.PI / 2;
	
		this.scene.add(this.textMesh);
	}
	

	update(newText) {
		if (this._text !== newText) {
			this._text = newText;
			this.createTextMesh();
		}
	}
}