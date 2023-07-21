<script setup lang="ts">
import type { Word } from '@/types/deepgram';

const props = defineProps<{
  word: Word
}>()

</script>

<template>
  <tr class="word-detail">
    <td> {{ props.word.word }} </td>
    <td>
      {{ props.word.confidence.toLocaleString(undefined, { style: 'percent' }) }}
      {{ props.word.confidence > 0.9 ? '👍' : (props.word.confidence < 0.5 ? '👎' : '') }} </td>
    <td> {{ props.word.speaker }} </td>
    <td>
      {{ props.word.speaker_confidence.toLocaleString(undefined, { style: 'percent' }) }}
      {{ props.word.speaker_confidence > 0.9 ? '👍' : (props.word.speaker_confidence < 0.5 ? '👎' : '') }} </td>
  </tr>
</template>

<style>
.word-detail {
  white-space: pre-line;
  background-color: rgba('', alpha);
}
</style>
