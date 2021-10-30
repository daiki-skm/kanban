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
  name: 'Point',
  mounted () {
    const width = 960;
    const height = 540;
    let rot = 0; // 角度

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

    createStarField();

    function createStarField() {
        // 頂点情報を格納する配列
        const vertices = [];

        // 配置する範囲
        const SIZE = 3000;
        // 配置する個数
        const LENGTH = 1000;

        for (let i = 0; i < LENGTH; i++) {
            const x = SIZE * (Math.random() - 0.5);
            const y = SIZE * (Math.random() - 0.5);
            const z = SIZE * (Math.random() - 0.5);

            vertices.push(x, y, z);
        }

        // 形状データを作成
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // マテリアルを作成
        const material = new THREE.PointsMaterial({
            // 一つ一つのサイズ
            size: 10,
            // 色
            color: 0xffffff,
        });

        // 物体を作成
        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
    }

    tick()

    function tick() {
        rot += 1;

        // ラジアンに変換する
        const radian = (rot * Math.PI) / 180;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }
  },
})
</script>
