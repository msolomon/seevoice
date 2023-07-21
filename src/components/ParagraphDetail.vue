<script setup lang="ts">
import { useStore } from '@/stores/store';
import type { Paragraph, Word } from '@/types/deepgram';
import { storeToRefs } from 'pinia';
import WordVue from './Word.vue';

const props = defineProps<{
  paragraph: Paragraph,
  lastSpeaker?: number
}>()

const store = storeToRefs(useStore())

function getWords() {

  const words = store.getAlternative.value.words

  const start = words.findIndex(w => w.start == props.paragraph.start)

  const paragraphWords: Word[] = []

  if (start > -1) {
    for (let i = 0; i < props.paragraph.num_words; i++) {
      paragraphWords.push(words[start + i])
    }
  }
  return paragraphWords
}

const paragraphWords = getWords()

</script>

<template>
  <tr class="paragraph-detail">
    <td> {{ props.paragraph.speaker }} </td>
    <td class="words">
      <WordVue v-for="word in paragraphWords" :key="JSON.stringify(word)" :word="word" />
    </td>
  </tr>
</template>

<style >
.speaker {
  font-weight: bold;
  white-space: nowrap;
}

.words {
  padding-left: 1.3em;
  text-indent: -1em;
}
</style>