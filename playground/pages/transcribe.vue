<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-center">
            Voice record
          </v-card-title>

          <v-card-text class="text-center">
            <div class="text-h2 my-4">
              {{ formattedTime }}
            </div>

            <v-btn
              :color="isRecording ? 'error' : 'primary'"
              @click="toggleRecording"
              :loading="isInitializing"
              rounded="pill"
              size="x-large"
            >
              <v-icon :icon="isRecording ? 'mdi-stop' : 'mdi-microphone'" class="mr-2" />
              {{ isRecording ? 'Остановить запись' : 'Начать запись' }}
            </v-btn>

            <!-- last record -->
            <v-expand-transition>
              <div v-if="audioUrl != null" class="mt-6">
                <h3 class="text-subtitle-1 mb-2">The last record:</h3>
                <audio :src="audioUrl" controls></audio>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  class="mt-2"
                  @click="transcribe"
                >
                  Get text version
                </v-btn>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { MediaRecorder, register, IMediaRecorder } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

const isRecording = ref(false)
const isInitializing = ref(false)
const audioUrl = ref<string | null>(null)
const mediaRecorder = ref<IMediaRecorder | null>(null)
const startTime = ref<number>(0)
const currentTime = ref<number>(0)
const timer = ref<number | null>(null)
const chunks: BlobPart[] = [];

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(currentTime.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const getBlob = () =>
  new Blob(chunks, { type: 'audio/webm' })

async function initRecorder() {
  try {
    await register(await connect());

    isInitializing.value = true
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream, { mimeType: "audio/wav" });
    
    mediaRecorder.value.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    mediaRecorder.value.onstop = () =>
      audioUrl.value = URL.createObjectURL(getBlob());

    isInitializing.value = false
  } catch (error) {
    console.error('Ошибка при инициализации записи:', error)
    isInitializing.value = false
  }
}

async function toggleRecording() {
  if (!mediaRecorder.value) {
    await initRecorder()
  }

  if (!isRecording.value) {
    chunks.length = 0;
    mediaRecorder.value?.start()
    isRecording.value = true
    startTime.value = Date.now()
    currentTime.value = 0
    audioUrl.value = null
    
    timer.value = window.setInterval(() => {
      currentTime.value = Date.now() - startTime.value
    }, 100)
  } else {
    mediaRecorder.value?.stop()
    isRecording.value = false;
    
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }
}

async function transcribe() {
  if (!audioUrl.value) return;

  const formData = new FormData();

  formData.append("audioFile", getBlob(), "speech.webm");

  const res = await fetch("/api/transcribe", {
    body: formData,
    method: "post"
  })

}
</script>