<template>
  <div>
    <div v-if="!$store.getters.getLoggedIn">
      <Auth />
    </div>
    <div v-else>
      <BaseBackground />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
}

export default Vue.extend({
  async asyncData ({ store }) {
    try {
      store.dispatch('onAuth')
    } catch (err) {
      console.log('asyncData', err)
    }
  },
  data ():DataType {
    return {
    } as DataType
  },
})
</script>
