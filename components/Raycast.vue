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
  name: 'Raycast',
  mounted () {
    const width = 960;
    const height = 540;

    // マウス座標管理用のベクトルを作成
    const mouse = new THREE.Vector2();

    // canvas 要素の参照を取得する
    const canvas = this.$refs.canvas

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // 3D空間、3Dオブジェクトや光源などの置き場
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, 1000);

    const geometry = new THREE.BoxBufferGeometry(50, 50, 50);

    // マウスとの交差を調べたいものは配列に格納する
    const meshList = [];
    for (let i = 0; i < 200; i++) {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 800;
        mesh.position.y = (Math.random() - 0.5) * 800;
        mesh.position.z = (Math.random() - 0.5) * 800;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        scene.add(mesh);

        // 配列に保存
        meshList.push(mesh);
    }

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // レイキャストを作成
    const raycaster = new THREE.Raycaster();

    canvas.addEventListener('mousemove', handleMouseMove);

    tick()

    function handleMouseMove(event) {
        const element = event.currentTarget;
        // canvas要素上のXY座標
        const x = event.clientX - element.offsetLeft;
        const y = event.clientY - element.offsetTop;
        // canvas要素の幅・高さ
        const w = element.offsetWidth;
        const h = element.offsetHeight;

        // -1〜+1の範囲で現在のマウス座標を登録する
        mouse.x = (x / w) * 2 - 1;
        mouse.y = -(y / h) * 2 + 1;
    }

    function tick() {
        // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
        raycaster.setFromCamera(mouse, camera);

        // その光線とぶつかったオブジェクトを得る
        const intersects = raycaster.intersectObjects(meshList);

        meshList.map((mesh) => {
            // 交差しているオブジェクトが1つ以上存在し、
            // 交差しているオブジェクトの1番目(最前面)のものだったら
            if (intersects.length > 0 && mesh === intersects[0].object) {
                // 色を赤くする
                mesh.material.color.setHex(0xff0000);
            } else {
                // それ以外は元の色にする
                mesh.material.color.setHex(0xffffff);
            }
        });
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
  },
})
</script>
