<template>
  <section class="artwork">
    <canvas class="artwork__canvas" ref="canvas"></canvas>
  </section>
</template>

<script>
import Vue from 'vue'
import * as THREE from "three";

export default Vue.extend({
  name: 'Geo',
  mounted () {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas
    });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    // 奥行き、上下角度、拡張（近く）
    camera.position.set(0, 500, +1000);
    // lookAt()：どの位置からでも指定した座標に強制的に向かせる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const container = new THREE.Object3D();
    scene.add(container);

    // 座標軸
    const axes = new THREE.AxisHelper(500);
    container.add(axes);

    const material = new THREE.MeshStandardMaterial({
      color: 0x87CEEB,
      side: THREE.DoubleSide,
    });

    const geometryList = [
      new THREE.SphereGeometry(50), // 球体
      new THREE.BoxGeometry(100, 100, 100), // 直方体
      new THREE.PlaneGeometry(100, 100), // 平面
      new THREE.TetrahedronGeometry(100, 0), // 三角錐
      new THREE.ConeGeometry(100, 100, 32), // 円錐
      new THREE.CylinderGeometry(50, 50, 100, 32), // 円柱
      new THREE.TorusGeometry(50, 30, 16, 100), // ドーナツ形状
    ];

    geometryList.map((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, material);

      // 3D表示インスタンスのsceneプロパティーが3D表示空間となる
      container.add(mesh);

      // 円周上に配置、右手座標系
      mesh.position.x = 400 * Math.sin((index / geometryList.length) * Math.PI * 2);
      mesh.position.z = 400 * Math.cos((index / geometryList.length) * Math.PI * 2);
    });

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    tick()

    function tick() {
      container.rotation.y += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }
  },
})
</script>
