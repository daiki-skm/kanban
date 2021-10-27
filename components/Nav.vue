<template>
  <section class="artwork">
    <canvas class="artwork__canvas" ref="canvas"></canvas>
  </section>
</template>

<script>
import Vue from 'vue'
import * as THREE from "three";
import img from "@/static/earth.jpg"

export default Vue.extend({
  name: 'Nav',
  mounted () {
    const width = 960;
    const height = 540;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas
    });
    renderer.setSize(width, height);

    // 3D空間、3Dオブジェクトや光源などの置き場
    const scene = new THREE.Scene();

    // 座標軸
    const axes = new THREE.AxisHelper(500);
    scene.add(axes);

    // どの視点から空間を撮影するか（画角、アスペクト比、描画開始距離、描画終了距離）
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    // 奥行き、上下角度、拡張（近く）
    camera.position.set(0, 0, +1000);

    // ジオメトリ：頂点情報や面情報を持っている
    // マテリアル：色や質感の情報を持っている、着色や画像・陰影の割り当て、ライティングの反射などを適用できる

    // 箱
    // const geometry = new THREE.BoxGeometry(400, 400, 400);
    // 球体
    const geometry = new THREE.SphereGeometry(300, 30, 30);
    // 平面
    // const geometry = new THREE.PlaneGeometry( 400, 300, 300 );
    // 三角錐
    // const geometry = new THREE.ConeGeometry( 200, 400, 400 );
    // 円柱
    // const geometry = new THREE.CylinderGeometry( 200, 200, 400, 100 )
    // ドーナツ状
    // const geometry = new THREE.TorusGeometry( 200, 70, 200, 200 );

    // ノーマル色
    // const material = new THREE.MeshNormalMaterial();
    // 単色塗り
    const material = new THREE.MeshStandardMaterial({color: 0x87CEEB});
    // 強制環境光？
    // const material = new THREE.MeshBasicMaterial({color: 0x87CEEB});
    // 平面の時、裏面も色を塗りたいため
    // const material = new THREE.MeshBasicMaterial({color: 0x87CEEB, side: THREE.DoubleSide});

    // 画像（GPUの制約から、2の累乗の高さ・幅である画像のみ利用可能）
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load('static/demo.jpg');
    // const material = new THREE.MeshStandardMaterial({map: texture});

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    // 環境光
    // const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    // scene.add(ambientLight);

    tick()

    function tick() {
      // mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      // mesh.rotation.z += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }
  },
})
</script>
