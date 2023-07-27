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

  for (let i = 0; i < props.paragraph.num_words; i++) {
    paragraphWords.push(words[start + i])
  }
  return paragraphWords
}
const approx = 0.1 // loosely match words. in seconds
function playing() {
  return store.currentTime.value >= props.paragraph.start - approx &&
    store.currentTime.value <= props.paragraph.end + approx
}

const paragraphWords = getWords()
const speakers = store.speakers

</script>

<template>
  <textarea rows="1" cols="10" class="speaker" v-if="props.paragraph.speaker != props.lastSpeaker"
    v-model="speakers[props.paragraph.speaker]" />
  <span class="speaker" v-else=""></span>
  <div :class="'words' + (playing() ? ' playing' : '')">
    <WordVue v-for=" word in paragraphWords " :key="JSON.stringify(word)" :word="word" />
  </div>
</template>

<style >
.speaker {
  font-weight: bold;
  border: none;
  text-align: right;
  padding-right: 1em;
}

.words {
  padding-left: 1em;
  text-indent: -1em;
  width: fit-content;
}

.playing {
  background-color: #00bd7e33;
  border-radius: 4px;
}
</style>