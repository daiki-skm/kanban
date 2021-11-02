<template>
    <div class="container w-screen h-screen bg-white">
        <div class="container h-1/6 ml-10 mt-10">
            <p class="font-mono text-6xl text-gray-800 text-left">
                kanban
            </p>
        </div>
        <div class="container mx-auto w-hull h-hull w-4/5 h-4/5">
            <div class="textbox">
                <p class="vertical">
                    重要
                </p>
            </div>
            <div class="container mx-auto w-1 h-1 w-3/4 h-3/4 bg-blue-200 rounded-3xl shadow-2xl">
            </div>
            <span>
                緊急
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'BaseBackground',
})
</script>

<style lang="scss" scoped>
    .textbox {
        position: absolute;
        right: 50%;

        .vertivcal {
            writing-mode: vertical-rl;
            text-orientation: upright;
        }
    }
</style>
