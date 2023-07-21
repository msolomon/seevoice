<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { routeLocationKey, useRoute } from 'vue-router'
import type { DeepgramResult } from '@/types/deepgram'

import { useStore } from '@/stores/store'
import { parseDeepgramResult } from '@/see';
import Word from '@/components/Word.vue'
import Paragraph from '@/components/Paragraph.vue'
import { storeToRefs } from 'pinia';

const store = storeToRefs(useStore())
const route = useRoute()
const jsonPath = route.query.jsonPath?.toString() || ''
console.log('jsonPath', jsonPath)

async function fetchJsonData() {
  await fetch(jsonPath)
    .then((response) => response.json())
    .then((data: DeepgramResult) => {
      parseDeepgramResult(data)
    })
}

await fetchJsonData()

const renderWords = store.options.value.displayBy == 'word'
const renderSentences = store.options.value.displayBy == 'sentence'
const renderParagraphs = store.options.value.displayBy == 'paragraph'
const renderUtterances = store.options.value.displayBy == 'utterance'
const alternative = store.getAlternative

// hack if paragraphs are missing from some alternative transcriptions
// TODO: fix
function verifyParagraphs() {
  if (renderParagraphs) {
    while (store.getAlternative.value.paragraphs == null && store.transcription.value.results.channels[store.channelAlternative.value.channel].alternatives.length > store.channelAlternative.value.alternative) {
      store.channelAlternative.value.alternative += 1
    }
  }
}
verifyParagraphs()
const paragraphs = store.getAlternative.value.paragraphs?.paragraphs
</script>

<template>
  <div class="transcription">
    <h2 class="green">Transcription for {{ $route.query.jsonPath }}</h2>
    <div v-if="renderWords" class="words">
      <Word v-for="word in alternative.words" :key="JSON.stringify(word)" :word="word" />
    </div>

    <div v-if="renderParagraphs" class="paragraphs">
      <div class="wrapper">
        <Paragraph v-for="(paragraph, i) in paragraphs" :key="JSON.stringify(paragraph)" :paragraph="paragraph"
          :lastSpeaker="(paragraphs && paragraphs[i - 1]) ? paragraphs[i - 1].speaker : -1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

</script>

<style scoped>
.wrapper {
  /* display: flex; */
  display: grid;
  /* flex-direction: column; */
  grid-template-columns: min-content 1fr;
  column-gap: 2em;
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
