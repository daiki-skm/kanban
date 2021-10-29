<template>
  <section class="artwork">
    <canvas class="artwork__canvas" ref="canvas"></canvas>

      <!-- ライン描画用のSVG -->
      <svg width="960" height="540" style="position: absolute; top: 0; left: 0">
        <g stroke="white">
          <line id="svgLine" x1="0" y1="0" x2="0" y2="0" stroke-width="3" />
        </g>
      </svg>

      <!-- 座標表示用のdivタグ -->
      <div id="hud" style="position: absolute; top: 0; left: 0; background: white"></div>
  </section>
</template>

<script>
import Vue from 'vue'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import img from "@/static/earth.jpg"
import demo from "@/static/demo"
import gun from "@/static/portalgun.3ds"

export default Vue.extend({
  name: 'Nav',
  mounted () {
    const width = 960;
    const height = 540;
    let rot = 0;


  const canvasElement = this.$refs.canvas
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
    });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

    // 3D空間、3Dオブジェクトや光源などの置き場
    const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        // カメラの初期座標を設定
        camera.position.set(0, 0, 5);

        const controls = new OrbitControls(camera, canvasElement);

        // 平行光源を作成
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        // 環境光を追加
        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

                // 3DS形式のモデルデータを読み込む
        const loader = new THREE.TDSLoader();
        // テクスチャーのパスを指定
        loader.setResourcePath(demo);
        // 3dsファイルのパスを指定
        loader.load(gun, (object) => {
          // 読み込み後に3D空間に追加
          scene.add(object);
        });

    tick()

    const tmp = this.$refs.hud

    function tick() {
renderer.render(scene, camera);
          requestAnimationFrame(tick);
    }
  },
})
</script>
