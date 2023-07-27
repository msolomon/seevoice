<script setup lang="ts">
import { ref, onMounted, watchEffect, watch } from 'vue'
import { routeLocationKey, useRoute, useRouter } from 'vue-router'
import type { DeepgramResult } from '@/types/deepgram'

import { useStore } from '@/stores/store'
import { parseDeepgramResult } from '@/see';
import Paragraph from '@/components/Paragraph.vue'
import { storeToRefs } from 'pinia';

const store = storeToRefs(useStore())

const jsonPath = store.jsonPath

async function fetchData() {
  if (jsonPath.value) return await fetch(jsonPath.value)
    .then((response) => {
      if (response.status == 404) {
        store.transcriptionError.value = `File not found: ${jsonPath.value}`
        return
      }
      return response.json().then(parseDeepgramResult).finally(() => store.transcriptionError.value = null)
    })
    .catch((error) => store.transcriptionError.value = `Error loading ${jsonPath.value}: ${error}`)
}

watch(jsonPath, fetchData)
await fetchData()
await fetchData() // TODO: fix. we have to wait for a second tick

const paragraphs = store.transcription.value?.results
  ?.channels[store.channelAlternative.value?.channel]
  ?.alternatives[store.channelAlternative.value?.alternative]
  ?.paragraphs?.paragraphs
</script>

<template>
  <div class="transcription">
    <h3 class="green">Transcription for {{ jsonPath }}</h3>
    <div v-if="paragraphs" class="paragraphs">
      <div class="wrapper">
        <Paragraph v-for="(paragraph, i) in paragraphs" :key="JSON.stringify(paragraph)" :paragraph="paragraph"
          :lastSpeaker="(paragraphs && paragraphs[i - 1]) ? paragraphs[i - 1].speaker : -1" />
      </div>
    </div>
    <div v-else-if="store.transcriptionError != null">
      {{ store.transcriptionError }}
    </div>
    <div v-else>Loading... </div>
  </div>
</template>

<style scoped>
.transcription {
  flex: 2;
}

.wrapper {
  display: grid;
  grid-template-columns: min-content 1fr;
  overflow-y: auto;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
