<template>
  <div>
    <BaseBackground />
    <!-- <Plane /> -->
    <!-- <Point /> -->
    <!-- <Raycast /> -->
    <!-- <Nav /> -->
    <!-- <Geo /> -->
     <!-- <div class="page">
      <label>
        <span>
          お名前:
        </span>
        <input
          type="text"
          v-model="user.name"
        >
      </label>
      <label>
        <span>
          email:
        </span>
        <input
          type="text"
          v-model="user.email"
        >
      </label>
      <button
        type="button"
        @click="submit"
      >
        Submit
      </button>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import database from '@/plugin/firebase'
import { collection, addDoc } from "firebase/firestore";

interface DataType {
  user: any
}

export default Vue.extend({
  data ():DataType {
    return {
      user: {
        name: "",
        email: ""
      }
    } as DataType
  },
  methods: {
    async submit () {
      const docRef = await addDoc(collection(database, "cities"), {
        name: "demo",
        country: "Japan"
      });
      console.log("Document written with ID: ", docRef.id);
    },
  },
})
</script>
