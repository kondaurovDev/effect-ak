<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>AI Image Generator</v-card-title>
          
          <v-card-text>
            <v-textarea
              v-model="prompt"
              label="Image description"
              rows="3"
              placeholder="Enter detailed description of the image you want to generate..."
              :disabled="isLoading"
            />

            <v-btn
              block
              color="primary"
              :loading="isLoading"
              :disabled="!prompt"
              @click="generateImage"
            >
              Generate Image
            </v-btn>

            <v-fade-transition>
              <div v-if="generatedImage" class="mt-6">
                <v-img
                  :src="generatedImage"
                  max-height="512"
                  contain
                  class="rounded-lg"
                />
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const isLoading = ref(false)
const generatedImage = ref('')

const generateImage = async () => {
  if (!prompt.value) return
  
  try {
    isLoading.value = true
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt.value
      })
    })

    const data = await response.json()
    generatedImage.value = `data:image/webp;base64,${data.image}`
  } catch (error) {
    console.error('Failed to generate image:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
