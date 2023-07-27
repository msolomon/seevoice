<script setup lang="ts">
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia';
import WordDetail from './WordDetail.vue';

const store = storeToRefs(useStore())
</script>

<template>
  <div class="details">
    <h2>{{ store.hoveredDesc.value ? `Details for "${store.hoveredDesc.value}"` : 'Details' }}</h2>
    <div v-if="store.currentWords.value.length > 0" class="words-details">
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
        <WordDetail v-for="word in store.currentWords.value" :word="word" />
      </table>
      <br />
    </div>
  </div>
</template>

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
</style>
