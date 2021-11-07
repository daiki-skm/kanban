import * as THREE from "three"

class Donuts extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry( 10, 10 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

    super(geometry, material);
  }
}

// ドーナツを作る
// const mesh = new Donuts();
// scene.add(mesh);
