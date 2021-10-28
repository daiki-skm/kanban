<template>
  <section class="artwork">
    <canvas class="artwork__canvas" ref="canvas"></canvas>
  </section>
</template>

<script>
import Vue from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import img from "@/static/earth.jpg"

export default Vue.extend({
  name: 'Nav',
  mounted () {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // 3D空間、3Dオブジェクトや光源などの置き場
    const scene = new THREE.Scene();

    // どの視点から空間を撮影するか（画角、アスペクト比、描画開始距離、描画終了距離）
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // 奥行き、上下角度、拡張（近く）
    camera.position.set(0, 0, 1000);

    // ドーナツを作成
    const geometry = new THREE.TorusGeometry(300, 100, 64, 100);
    // マテリアルを作成
    const material = new THREE.MeshStandardMaterial({
      color: 0x6699ff,
      roughness: 0.0,
    });
    // メッシュを作成
    const mesh = new THREE.Mesh(geometry, material);
    // 3D空間にメッシュを追加
    scene.add(mesh);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // ポイント光源
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    scene.add(pointLight);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
    scene.add(pointLightHelper);    

    tick()

    function tick() {
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01

      pointLight.position.set(
        500 * Math.sin(Date.now() / 500),
        500 * Math.sin(Date.now() / 1000),
        500 * Math.cos(Date.now() / 500)
      );

      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }
  },
})
</script>
