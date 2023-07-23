<script setup lang="ts">
import Details from '@/components/Details.vue';
import WaveSurfer from '../components/WaveSurfer.vue'
import Transcription from '@/components/Transcription.vue';
import { useStore } from '@/stores/store'
import { useRouter, useRoute } from 'vue-router';
import { parseDeepgramResult } from '@/see';
import { onBeforeMount, onMounted, watchEffect } from 'vue';
const store = useStore()

const router = useRouter()
const route = useRoute()

function onFileChange(e: any) {
  var files = e.target?.files || e.dataTransfer?.files;
  if (!files?.length) return
  for (const file of files) {
    handleUpload(file)
  }
}
function onUrlChange(e: any) {
  const url: string = e.target?.value
  if (!url) return
  if (url.toLowerCase().endsWith('.json')) {
    route.query.jsonPath = url
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        parseDeepgramResult(data)
      })
  } else {
    route.query.audioPath = url
    store.wavesurfer?.load(url)
  }
}

async function handleUpload(file: File) {
  if (file.name.endsWith('.json')) {
    console.log('Uploading JSON file', file.name)
    await file.text().then((text) => {
      const data = JSON.parse(text)
      console.log('parsed JSON', data)
      return parseDeepgramResult(data)
    })
  } else {
    console.log('Uploading audio', file.name)
    console.log(file)
    const url = URL.createObjectURL(file)
    console.log(url, file)
    store.wavesurfer?.once('ready', () => URL.revokeObjectURL(url))
    store.wavesurfer?.load(url)
  }
}

function flatten(data: object) {
  let result: any = {}
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i++)
        recurse(cur[i], prop + "[" + i + "]");
    } else {
      let isEmpty = true;
      for (let p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

</script>

<template>
  <main>
    <div>
      <!-- <div class="uploads">
        <form method="get" enctype="multipart/form-data">
          <label>
            Audio file:
            <input type="file" name="audioFile" id="audioFile" @submit.native.prevent="" @change="onFileChange">
          </label>
          <label>
            Audio URL:
            <input type="text" formmethod="get" v-model="route.query.audioPath">
          </label>
        </form>
        <form method="get" enctype="multipart/form-data">
          <label>
            Deepgram JSON file:
            <input type="file" name="jsonFile" id="jsonFile" @submit.native.prevent="" @change="onFileChange">
          </label>
          <label>
            JSON URL:
            <input type="text" formmethod="get" v-model="route.query.jsonPath">
          </label>
        </form>
      </div> -->
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
  /* grid-template-rows: min-content 1fr; */
  /* grid-template-columns: 1fr; */
  box-sizing: border-box;
  flex: 0 1 auto;
}

.wrapper {
  display: flex;
  overflow-y: auto;
}

.uploads {
  display: flex;
  flex: 1;
  gap: 2em;
}

label {
  font-weight: bold;
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