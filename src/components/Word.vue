<script setup lang="ts">
import { useStore } from '@/stores/store';
import type { Word } from '@/types/deepgram';
import Color from 'colorjs.io'

const props = defineProps<{
  word: Word
}>()

const store = useStore()

function setHoverData() {
  // console.log('hovering', JSON.stringify(props.word))
  store.currentBounded = props.word
  store.updateRegion() // TODO: do this with reactivity
}

const fullColor = new Color("#e6324b")
function colorize(confidence: number) {
  fullColor.alpha = (1.0 - confidence) * 0.6
  return fullColor.toString()
}

const color = colorize(props.word.confidence)
</script>

<template>
  <span class="word" :style="{ 'background-color': color }" @mouseenter="setHoverData" @click="store.jumpToAudio">
    {{ props.word.word }}
  </span>
  {{ " " }}
</template>

<style>
.word {
  white-space: pre-line;
  border-radius: 2px;
  text-indent: 2em;
}
</style>
