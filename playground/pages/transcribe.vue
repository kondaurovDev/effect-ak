<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {
  console.log("mounted!")
})

const recordAudio = () => {
  console.log("Recording...")
}

const message = ref('Hello Vue!!! :)');
</script>

<template>
  <v-btn @click="recordAudio">
    Record
  </v-btn>
  <p>
    {{ message }}
  </p>
  <input v-model="message" />
</template>
