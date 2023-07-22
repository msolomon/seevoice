<script setup lang="ts">
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia';
import type { Ref } from 'vue';
import WordDetail from './WordDetail.vue';
import ParagraphDetail from './ParagraphDetail.vue';
import type { Word } from '@/types/deepgram';
import { json } from 'stream/consumers';

const store = storeToRefs(useStore())

const paragraphs = store.currentParagraphs
const words = store.currentWords

const hoveredDesc = store.hoveredDesc

function title() {
  if (hoveredDesc.value) {
    return `Details for "${hoveredDesc.value}"`
  }
  return "Details"
}

</script>

<template>
  <div class="details">
    <h2>{{ title() }}</h2>
    <div v-if="words.length > 0" class="words-details">
      <h3>Words</h3>
      <p class="desc">
        Shows how confident the software is in transcribing audio into different word choices spoken by various people in
        the recording.
      </p>
      <table>
        <thead>
          <tr>
            <th style="min-width: 25%">Word</th>
            <th style="width: 0">Confidence</th>
            <th style="width: 0">Speaker</th>
            <th style="width: 0">Speaker Confidence</th>
          </tr>
        </thead>
        <WordDetail v-for="word in words" :word="word" />
      </table>
      <br />
    </div>
    <!-- <div v-if="paragraphs.length > 0" class="paragraphs-details">
      <h3>Paragraphs</h3>
      <p class="desc">
        Shows the word in its surrounding paragraph, including alternative transcriptions.
      </p>
      <table>
        <thead>
          <tr>
            <th style="width: 0">Speaker</th>
            <th style="width: 100%">Paragraph</th>
          </tr>
        </thead>
        <ParagraphDetail v-for="paragraph in paragraphs" :paragraph="paragraph" />
      </table>
    </div> -->
  </div>
</template>

<script lang="ts">

</script>

<style >
.desc {
  font-style: italic;
}

.details {
  min-width: 10em;
  border-style: dashed;
  border-color: hsla(160, 100%, 37%, 1);
  padding: 1em;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 4px;
  width: 100%;
}

table,
thead,
th,
td {
  border: solid 1px grey;
  padding: 4px;
  text-align: left;
}

th {
  font-weight: bold;
}

thead {
  font-weight: bold;
  background-color: hsla(160, 100%, 37%, 0.2);
  ;
}

table tr:nth-child(odd) td {
  background-color: hsla(160, 100%, 37%, 0.1);
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
