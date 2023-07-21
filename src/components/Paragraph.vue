<script setup lang="ts">
import { useStore } from '@/stores/store';
import type { Paragraph, Word } from '@/types/deepgram';
import { storeToRefs } from 'pinia';
import WordVue from './Word.vue';

const props = defineProps<{
  paragraph: Paragraph,
  lastSpeaker?: number
}>()

const rawStore = useStore()
const store = storeToRefs(rawStore)

function getWords() {

  const words = store.getAlternative.value.words

  const start = words.findIndex(w => w.start == props.paragraph.start)

  const paragraphWords: Word[] = []

  for (let i = 0; i < props.paragraph.num_words; i++) {
    paragraphWords.push(words[start + i])
  }
  return paragraphWords
}
function playing() {
  const playingThis = rawStore.currentTime >= props.paragraph.start && rawStore.currentTime <= props.paragraph.end
  const playing = playingThis ? 'playing' : ''
  return playing
}

const paragraphWords = getWords()

</script>

<template>
  <span class="speaker" v-if="props.paragraph.speaker != props.lastSpeaker">Speaker {{ props.paragraph.speaker }}</span>
  <span class="speaker" v-else=""></span>
  <div :class="'words ' + playing()">
    <WordVue v-for=" word in paragraphWords " :key="JSON.stringify(word)" :word="word" />
  </div>
</template>

<style >
.speaker {
  font-weight: bold;
  white-space: nowrap;
}

.words {
  margin-left: 1em;
  text-indent: -1em;
}

.playing {
  background-color: lightblue;
  border-radius: 4px;
}
</style>