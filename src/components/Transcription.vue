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
  console.log('fetching json data', jsonPath.value)
  if (jsonPath.value) return await fetch(jsonPath.value)
    .then((response) => response.json())
    .then((data: DeepgramResult) => parseDeepgramResult(data))
}

watch(jsonPath, fetchData)
await fetchData()
await fetchData() // TODO: fix. we have to wait for a second tick

// const alternative = jsonPath && store.getAlternative
const paragraphs = store.transcription.value?.results?.channels[store.channelAlternative.value?.channel].alternatives[store.channelAlternative.value?.alternative]?.paragraphs?.paragraphs
</script>

<template>
  <div class="transcription">
    <h2 class="green">Transcription for {{ jsonPath }}</h2>
    <div v-if="paragraphs" class="paragraphs">
      <div class="wrapper">
        <Paragraph v-for="(paragraph, i) in paragraphs" :key="JSON.stringify(paragraph)" :paragraph="paragraph"
          :lastSpeaker="(paragraphs && paragraphs[i - 1]) ? paragraphs[i - 1].speaker : -1" />
      </div>
    </div>
    <div v-else>Loading...
    </div>
  </div>
</template>

<script lang="ts">

</script>

<style scoped>
.transcription {
  flex: 2;
}

.wrapper {
  /* display: flex; */
  display: grid;
  /* flex-direction: column; */
  grid-template-columns: min-content 1fr;
  /* column-gap: 2em; */
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

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
