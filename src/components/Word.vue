<script setup lang="ts">
import { useStore } from '@/stores/store';
import type { Word } from '@/types/deepgram';
import { colorizeRed } from '@/see';

const props = defineProps<{
  word: Word
}>()

const store = useStore()

function setHoverData() {
  store.currentBounded = props.word
  store.updateRegion() // TODO: do this with reactivity
}

const color = colorizeRed(props.word.confidence)
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
