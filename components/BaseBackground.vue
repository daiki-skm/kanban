<template>
    <div class="container w-screen h-screen bg-white">
        <canvas class="artwork__canvas" ref="canvas"></canvas>
        <div class="container h-1/6 mt-10 px-10 font-mono">
            <p class="text-6xl text-gray-800 text-left mb-10">
                kanban
            </p>
            <p class="text-right mr-20">
                <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="text"
                        v-model="memo"
                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 bg-red-100 rounded-md"
                        placeholder="memo"
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center">
                        <span
                            @click="addMemo"
                            class="rounded-full py-3 px-6 bg-red-100"
                        >
                            追加
                        </span>
                    </div>
                </div>
            </p>
            <canvas class="artwork__canvas" ref="canvas"></canvas>
        </div>
        <div class="container mx-auto w-1 h-1 w-3/4 h-3/4 rounded-3xl shadow-2xl grid gap-0 grid-cols-2">
            <div class="bg-red-100 rounded-tl-3xl">MUST</div>
            <div class="bg-yellow-100 rounded-tr-3xl">価値</div>
            <div class="bg-green-100 rounded-bl-3xl">錯覚</div>
            <div class="bg-blue-100 rounded-br-3xl">ムダ</div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import database from '@/plugin/firebase'
import { collection, addDoc } from "firebase/firestore"
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls"

interface DataType {
  memo: string
}

class Donuts extends THREE.Mesh {
    /** コンストラクターです。 */
    constructor() {
        // ジオメトリを作成
        const geometry = new THREE.TorusGeometry(120, 40, 60, 50);

        // マテリアルを作成
        const material = new THREE.MeshNormalMaterial();

        // 継承元のコンストラクターを実行
        super(geometry, material);
    }
}

export default Vue.extend({
    name: 'BaseBackground',
    data ():DataType {
        return {
            memo: ""
        } as DataType
    },
    methods: {
        async addMemo () {
            // const docRef = await addDoc(collection(database, "user"), {
            //     memo: this.memo,
            // });
            // console.log("Document written with ID: ", docRef.id);

            const width = 960;
            const height = 540;

            const renderer = new THREE.WebGLRenderer({
                // @ts-ignore
                canvas: this.$refs.canvas,
                alpha: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);

            // 3D空間、3Dオブジェクトや光源などの置き場
            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(45, width / height);
            camera.position.set(-100, 150, 500);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            // ドーナツを作る
            const mesh = new Donuts();
            scene.add(mesh);

            tick()

            function tick() {
                renderer.render(scene, camera);
                requestAnimationFrame(tick);
            }

            const controls = new DragControls( [mesh], camera, renderer.domElement );

            controls.addEventListener( 'hoveron', function ( event ) {
                event.object.material.emissive.set( 0x000000 );
            } );
            
            controls.addEventListener( 'hoveroff', function ( event ) {
                event.object.material.emissive.set( 0x000000 );
            } );

            // 初期化のために実行
            onResize();
            // リサイズイベント発生時に実行
            window.addEventListener('resize', onResize);

            function onResize() {
                // サイズを取得
                const width = window.innerWidth;
                const height = window.innerHeight;

                // レンダラーのサイズを調整する
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(width, height);

                // カメラのアスペクト比を正す
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        },
    },
})
</script>

<style lang="scss" scoped>

</style>
