<script setup lang="ts">
import Details from '@/components/Details.vue';
import WaveSurfer from '../components/WaveSurfer.vue'
import Transcription from '@/components/Transcription.vue'
import { useStore } from '@/stores/store'
import { flatten } from '@/see'
const store = useStore()

</script>

<template>
  <main>
    <div>
      <WaveSurfer />
      <div>
        <label>
          Show details
          <input type="checkbox" v-model="store.options.showDetails">
        </label>
      </div>
    </div>
    <div class="wrapper">
      <Suspense>
        <Transcription />
      </Suspense>
      <div class="detail-wrapper" v-if="store.options.showDetails">
        <Details />
        <div class="metadata">
          <h3>Metadata</h3>
          <div>
            <div class="wrapper" v-for="(md, k) in flatten(store.transcriptionMetadata)" :key="k">
              <span class="metadataKey">{{ k }}</span>:
              <p class="metadataValue">{{ md }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 0 1 auto;
}

.wrapper {
  display: flex;
  overflow-y: auto;
}

.detail-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content min-content min-content;
  flex: 1;
}

.detail-wrapper>div {
  margin-bottom: 2em;
}

.metadataKey {
  font-weight: bold;
}

.metadataValue {
  margin-left: 1em;
}
</style>
```