<template>
  <div class="w-screen h-screen bg-white">
    <div class="my-10 px-10 font-mono">
      <p class="text-6xl text-gray-800 text-left">
        kanban
      </p>
    </div>
    <div class="mx-auto mb-10 w-3/4">
      <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="shadow overflow-hidden rounded-md">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-1">
                <label class="block text-lg font-medium text-gray-700">
                  Number
                </label>
                <input
                  type="number"
                  v-model="num"
                  class="mt-1 block w-full h-8 shadow text-base border-gray-300 rounded-md"
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label class="block text-lg font-medium text-gray-700">Which</label>
                <select
                  v-model="which"
                  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                >
                  <option>must</option>
                  <option>value</option>
                  <option>illusion</option>
                  <option>unnecessary</option>
                </select>
              </div>
              <div class="col-span-6">
                <label class="block text-lg font-medium text-gray-700">Memo</label>
                <input
                  type="text"
                  v-model="memo"
                  class="mt-1 block w-full h-8 shadow text-base border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              @click="addMemo"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
            <button
              @click="deleteMemo"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Delete
            </button>
            <button
              @click="logout"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    <canvas class="artwork__canvas" ref="canvas"></canvas>
    <div class="mx-auto w-1 h-1 w-3/4 h-3/4 rounded-3xl shadow-2xl grid gap-0 grid-cols-2">
      <div class="bg-indigo-600 bg-opacity-25 rounded-tl-3xl text-xl pl-5 pt-4">MUST</div>
      <div class="bg-indigo-100 rounded-tr-3xl text-xl pl-5 pt-4">価値</div>
      <div class="bg-indigo-100 rounded-bl-3xl text-xl pl-5 pt-4">錯覚</div>
      <div class="bg-indigo-600 bg-opacity-25 rounded-br-3xl text-xl pl-5 pt-4">ムダ</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import database from '@/plugin/firebase'
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore"
import * as THREE from "three"
import { DragControls } from "three/examples/jsm/controls/DragControls"

interface DataType {
  memo: string
  num: number
  which: string
  width: number
  height: number
  scale: Object
  position_obj: Object
  dict_memo: Object
}

const scene = new THREE.Scene()

export default Vue.extend({
  name: 'BaseBackground',
  data ():DataType {
    return {
      memo: "example",
      num: 1,
      which: "must",
      width: 960,
      height: 540,
      scale: {
        x: 20,
        y: 20,
        z: 20,
      },
      position_obj: {
        "must": {
          x: -20,
          y: 50,
          z: -40
        },
        "value": {
          x: 10,
          y: 50,
          z: -40
        },
        "illusion": {
          x: -20,
          y: -20,
          z: -40
        },
        "unnecessary": {
          x: 10,
          y: -20,
          z: -40
        }
      },
      dict_memo: {}
    } as DataType
  },
  async mounted() {
    const _this = this
    const uid = this.$store.getters.getUserUid
    const querySnapshot = await getDocs(collection(database, uid))
    querySnapshot?.forEach((doc) => {
      const renderer = _this.createRenderer()
      const camera = _this.createCamera()

      const memo = doc.id + '. ' + doc.data().memo
      const createCanvasForTexture = _this.createCanvasForTexture(500, 500, memo, 100)

      const canvasTexture = new THREE.CanvasTexture(
        createCanvasForTexture
      )

      const which = doc.data().which
      // @ts-ignore
      const position = _this.position_obj[which]
      _this.createSprite(canvasTexture, _this.scale, position, doc.id, camera, renderer)

      tick()

      function tick() {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()

        renderer.render(scene, camera)
        requestAnimationFrame(tick)
      }

      _this.onResize(renderer, camera)
      // @ts-ignore
      window.addEventListener('resize', _this.onResize(renderer, camera))
    })
  },
  watch: {
    '$window.width'() {
      console.log(`width: ${(this as any).$window.width}`)
    },
    '$window.height'() {
      console.log(`height: ${(this as any).$window.height}`)
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    createRenderer() {
      const renderer = new THREE.WebGLRenderer({
        // @ts-ignore
        canvas: this.$refs.canvas,
        alpha: true,
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(this.width, this.height)

      return renderer
    },
    createCamera() {
      const camera = new THREE.PerspectiveCamera(45, this.width / this.height)
      camera.position.set(0, 0, 150)
      camera.lookAt(new THREE.Vector3(0, 0, 0))

      return camera
    },
    createSprite(texture:any, scale:any, position:any, num:string, camera:any, renderer:any) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(scale.x, scale.y, scale.z)
      sprite.position.set(position.x, position.y, position.z)

      scene.add(sprite)

      // @ts-ignore
      this.dict_memo[num] = sprite

      const controls = new DragControls( [sprite], camera, renderer.domElement )
    },
    createCanvasForTexture(canvasWidth:any, canvasHeight:any, text:any, fontSize:any) {
      const canvasForText = document.createElement('canvas')
      const ctx = canvasForText.getContext('2d')
      if (ctx) {
        ctx.canvas.width = canvasWidth
        ctx.canvas.height = canvasHeight
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px serif`;
        ctx.fillText(
          text,
          (canvasWidth - ctx.measureText(text).width) / 2,
          canvasHeight / 2 + ctx.measureText(text).actualBoundingBoxAscent / 2
        )
      }
      return canvasForText
    },
    onResize(renderer:any, camera:any) {
      const width = window.innerWidth
      const height = window.innerHeight

      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height)

      camera.aspect = width / height
      camera.updateProjectionMatrix()
    },
    async deleteMemo() {
      // @ts-ignore
      const mesh = this.dict_memo[String(this.num)]
      scene.remove( mesh )
      mesh?.material.dispose()
      mesh?.geometry.dispose()

      // @ts-ignore
      delete this.dict_memo[String(this.num)]

      const uid = this.$store.getters.getUserUid

      await deleteDoc(doc(database, uid, String(this.num)))
    },
    async addMemo() {
      // @ts-ignore
      if (this.dict_memo[String(this.num)]) {
        await this.deleteMemo()
      }

      const uid = this.$store.getters.getUserUid

      await setDoc(doc(database, uid, String(this.num)), {
        which: this.which,
        memo: this.memo
      })

      const renderer = this.createRenderer()
      const camera = this.createCamera()

      const memo = this.num + '. ' + this.memo
      const createCanvasForTexture = this.createCanvasForTexture(500, 500, memo, 100)
      
      const canvasTexture = new THREE.CanvasTexture(
        createCanvasForTexture
      )

      // @ts-ignore
      const position = this.position_obj[this.which]
      this.createSprite(canvasTexture, this.scale, position, String(this.num), camera, renderer)

      tick()

      function tick() {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()

        renderer.render(scene, camera)
        requestAnimationFrame(tick)
      }

      this.onResize(renderer, camera)
      // @ts-ignore
      window.addEventListener('resize', this.onResize(renderer, camera))

      this.num++
    },
  },
})
</script>

<style lang="scss" scoped>
.artwork__canvas {
  position: absolute;
  z-index: 1;
  width: 80% !important;
  height: 80% !important;
  margin-left: 12%;
}
</style>
