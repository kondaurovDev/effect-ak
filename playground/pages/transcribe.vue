<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <div class="d-flex align-center justify-space-between">
            <!-- Индикатор записи -->
            <v-fade-transition>
              <div v-if="isRecording" class="d-flex align-center">
                <v-progress-circular
                  indeterminate
                  color="red"
                  size="20"
                  class="mr-2"
                />
                <span class="text-red">{{ formattedTime }}</span>
              </div>
            </v-fade-transition>

            <!-- Кнопка записи -->
            <v-btn
              :color="isRecording ? 'red' : 'primary'"
              :icon="true"
              size="large"
              @click="startRecording"
              :disabled="isUploading"
            >
              <v-icon>
                {{ isRecording ? 'mdi-stop' : 'mdi-microphone' }}
              </v-icon>
            </v-btn>
          </div>

          <!-- Сообщение об ошибке -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mt-4"
            dismissible
            @input="error = null"
          >
            {{ error }}
          </v-alert>

          <!-- Индикатор загрузки -->
          <v-overlay
            v-model="isUploading"
            class="align-center justify-center"
          >
            <v-progress-circular
              indeterminate
              size="64"
            />
          </v-overlay>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

// Состояния
const isRecording = ref(false)
const recordingTime = ref(0)
const error = ref<string | null>(null)
const isUploading = ref(false)

// Переменные для записи
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let timer: number | null = null

// Форматированное время
const formattedTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60)
  const seconds = recordingTime.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// Форматирование времени записи (на случай, если понадобится отдельно)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Начало записи
const startRecording = async () => {
  if (isUploading.value) {
    error.value = 'Загрузка уже идет. Подождите завершения.'
    return
  }

  try {
    error.value = null
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onerror = (event) => {
      // console.error('MediaRecorder ошибка:', event.error as any)
      error.value = 'Ошибка записи аудио.'
      stopRecording()
    }

    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0

    // Запуск таймера
    timer = window.setInterval(() => {
      recordingTime.value++
    }, 1000)

  } catch (err) {
    error.value = 'Не удалось получить доступ к микрофону.'
    console.error('Ошибка доступа к микрофону:', err)
  }
}

// Остановка записи
const stopRecording = () => {
  if (!isRecording.value || !mediaRecorder) return

  mediaRecorder.stop()
  isRecording.value = false

  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }

  mediaRecorder.onstop = async () => {
    try {
      if (audioChunks.length === 0) {
        throw new Error('Нет записанных данных.')
      }

      isUploading.value = true
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })

      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Ошибка при отправке аудио.')
      }

      // Обработка успешной загрузки (например, отображение результата)
      // const result = await response.json()
      // console.log('Транскрипция:', result)

    } catch (err: any) {
      error.value = err.message || 'Неизвестная ошибка при загрузке аудио.'
      console.error('Ошибка загрузки аудио:', err)
    } finally {
      // Очистка ресурсов
      mediaRecorder?.stream.getTracks().forEach(track => track.stop())
      mediaRecorder = null
      audioChunks = []
      isUploading.value = false
    }
  }
}

// Очистка при размонтировании компонента
onUnmounted(() => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
  if (timer !== null) {
    clearInterval(timer)
  }
})
</script>
