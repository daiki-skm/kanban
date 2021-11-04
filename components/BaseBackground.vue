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
            <p class="text-right mr-20">
                <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="number"
                        v-model="num"
                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 bg-red-100 rounded-md"
                        placeholder="num"
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center">
                        <span
                            @click="deleteMemo"
                            class="rounded-full py-3 px-6 bg-red-100"
                        >
                            削除
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
import { collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, getDocs } from "firebase/firestore"
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls"

interface DataType {
    memo: string
    num: number
    width: number
    height: number
}

let dict_memo = {}

const scene = new THREE.Scene();

export default Vue.extend({
    name: 'BaseBackground',
    data ():DataType {
        return {
            memo: "",
            num: 1,
            width: 960,
            height: 540
        } as DataType
    },
    async mounted () {
        const querySnapshot = await getDocs(collection(database, "memo"));
        querySnapshot.forEach((doc) => {
            const renderer = this.createRenderer()
            const camera = this.createCamera()

            const createSprite = (texture:any, scale:any, position:any, num:string) => {
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(scale.x, scale.y, scale.z);
                sprite.position.set(position.x, position.y, position.z);

                scene.add(sprite);

                // @ts-ignore
                dict_memo[num] = sprite

                const controls = new DragControls( [sprite], camera, renderer.domElement );
            };

            const createCanvasForTexture = (canvasWidth:any, canvasHeight:any, text:any, fontSize:any) => {
                // 貼り付けるcanvasを作成。
                const canvasForText = document.createElement('canvas');
                const ctx = canvasForText.getContext('2d');
                if (ctx) {
                    ctx.canvas.width = canvasWidth; // 小さいと文字がぼやける
                    ctx.canvas.height = canvasHeight; // 小さいと文字がぼやける 
                    // 透過率50%の青背景を描く
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    //
                    ctx.fillStyle = 'black';
                    ctx.font = `${fontSize}px serif`;
                    ctx.fillText(
                        text,
                        // x方向の余白/2をx方向開始時の始点とすることで、横方向の中央揃えをしている。
                        (canvasWidth - ctx.measureText(text).width) / 2,
                        // y方向のcanvasの中央に文字の高さの半分を加えることで、縦方向の中央揃えをしている。
                        canvasHeight / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
                    );
                }
                return canvasForText;
            };

            const memo = doc.id + '. ' + doc.data().memo

            const canvasTexture = new THREE.CanvasTexture(
                createCanvasForTexture(500, 500, memo, 100)
            );

            const scaleMaster = 20;

            createSprite(
                canvasTexture,
                {
                    x: scaleMaster,
                    y: scaleMaster,
                    z: scaleMaster,
                },
                { x: -20, y: 0, z: -40 },
                doc.id
            );

            tick()

            function tick() {
                renderer.render(scene, camera);
                requestAnimationFrame(tick);
            }

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
        });
    },
    methods: {
        createRenderer () {
            const renderer = new THREE.WebGLRenderer({
                // @ts-ignore
                canvas: this.$refs.canvas,
                alpha: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(this.width, this.height);

            return renderer
        },
        createCamera () {
            const camera = new THREE.PerspectiveCamera(45, this.width / this.height);
            camera.position.set(0, -20, 100);
            // camera.lookAt(new THREE.Vector3(0, 0, 0));

            return camera
        },
        createSprite (texture:any, scale:any, position:any, num:string, camera:any, renderer:any) {
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(scale.x, scale.y, scale.z);
            sprite.position.set(position.x, position.y, position.z);

            scene.add(sprite);

            // @ts-ignore
            dict_memo[num] = sprite

            const controls = new DragControls( [sprite], camera, renderer.domElement );
        },
        createCanvasForTexture (canvasWidth:any, canvasHeight:any, text:any, fontSize:any) {
            // 貼り付けるcanvasを作成。
            const canvasForText = document.createElement('canvas');
            const ctx = canvasForText.getContext('2d');
            if (ctx) {
                ctx.canvas.width = canvasWidth; // 小さいと文字がぼやける
                ctx.canvas.height = canvasHeight; // 小さいと文字がぼやける 
                // 透過率50%の青背景を描く
                ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                //
                ctx.fillStyle = 'black';
                ctx.font = `${fontSize}px serif`;
                ctx.fillText(
                    text,
                    // x方向の余白/2をx方向開始時の始点とすることで、横方向の中央揃えをしている。
                    (canvasWidth - ctx.measureText(text).width) / 2,
                    // y方向のcanvasの中央に文字の高さの半分を加えることで、縦方向の中央揃えをしている。
                    canvasHeight / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
                );
            }
            return canvasForText;
        },
        onResize (renderer:any, camera:any) {
            // サイズを取得
            const width = window.innerWidth;
            const height = window.innerHeight;

            // レンダラーのサイズを調整する
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);

            // カメラのアスペクト比を正す
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        },
        async deleteMemo () {
            console.log('-----', dict_memo)
            // @ts-ignore
            const mesh = dict_memo[String(this.num)]
            scene.remove( mesh )
            mesh?.material.dispose();
            mesh?.geometry.dispose();

            // @ts-ignore
            delete dict_memo[String(this.num)]

            console.log('-----', dict_memo)

            await deleteDoc(doc(database, "memo", String(this.num)));
        },
        async addMemo () {
            await setDoc(doc(database, "memo", String(this.num)), {
                memo: this.memo,
            });

            // @ts-ignore
            if (dict_memo[String(this.num)]) {
                this.deleteMemo()
            }

            const renderer = this.createRenderer()
            const camera = this.createCamera()

            const memo = this.num + '. ' + this.memo
            const createCanvasForTexture = this.createCanvasForTexture(500, 500, memo, 100)
            
            const canvasTexture = new THREE.CanvasTexture(
                createCanvasForTexture
            );

            const scaleMaster = 20;
            const scale = {
                x: scaleMaster,
                y: scaleMaster,
                z: scaleMaster,
            }
            const position = {
                x: -20,
                y: 0,
                z: -40
            }

            this.createSprite(canvasTexture, scale, position, String(this.num), camera, renderer)

            tick()

            function tick() {
                renderer.render(scene, camera);
                requestAnimationFrame(tick);
            }

            // 初期化のために実行
            this.onResize(renderer, camera);
            // リサイズイベント発生時に実行
            // @ts-ignore
            window.addEventListener('resize', this.onResize(renderer, camera));

            console.log('-----', dict_memo)
            this.num++
        },
    },
})
</script>

<style lang="scss" scoped>

</style>
