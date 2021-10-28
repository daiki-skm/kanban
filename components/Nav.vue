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
    renderer.shadowMap.enabled = true;

    // 3D空間、3Dオブジェクトや光源などの置き場
    const scene = new THREE.Scene();

    // どの視点から空間を撮影するか（画角、アスペクト比、描画開始距離、描画終了距離）
const camera = new THREE.OrthographicCamera(-480, +480, 270, -270, 1, 1000);
    camera.fov = 60

    {
      const spotLight = new THREE.SpotLight(0xffffff, 4, 2000, Math.PI / 5, 0.2, 1.5);
      spotLight.position.set(500, 300, 500);
      spotLight.castShadow = true; // 影を落とす設定
      spotLight.shadow.mapSize.width = 2048;
      spotLight.shadow.mapSize.height = 2048;
      scene.add(spotLight);
    }

        // 地面を作成
    {
      // 床のテクスチャー
      const texture = new THREE.TextureLoader().load('imgs/floor.png');
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // リピート可能に
      texture.repeat.set(10, 10); // 10x10マスに設定
      texture.magFilter = THREE.NearestFilter; // アンチエイリアスを外す

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.0,
          metalness: 0.6,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true; // 影の設定
      scene.add(floor);
    }

            // マス目を作成
        {
          // 立方体のマテリアルとジオメトリを作成
          const material = new THREE.MeshStandardMaterial({
            color: 0x22dd22,
            roughness: 0.1,
            metalness: 0.2,
          });
          const geometry = new THREE.BoxGeometry(45, 45, 45);

          // 立方体を複数作成しランダムに配置
          for (let i = 0; i < 60; i++) {
            const box = new THREE.Mesh(geometry, material);
            box.position.x = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
            box.position.y = 25;
            box.position.z = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
            // 影の設定
            box.receiveShadow = true;
            box.castShadow = true;
            scene.add(box);
          }
        }

    tick()

    function tick() {
                // 角度に応じてカメラの位置を設定
          camera.position.x = 500 * Math.sin(Date.now() / 2000);
          camera.position.y = 250;
          camera.position.z = 500 * Math.cos(Date.now() / 2000);
          // 原点方向を見つめる
          camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }
  },
})
</script>
