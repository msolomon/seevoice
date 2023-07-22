<script setup lang="ts">
import Details from '@/components/Details.vue';
import TheWelcome from '../components/TheWelcome.vue'
import WaveSurfer from '../components/WaveSurfer.vue'
import Transcription from '@/components/Transcription.vue';
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router';
import { parseDeepgramResult } from '@/see';
const store = useStore()

const router = useRouter()

function maybeRedirect() {

  const queryParams = router.currentRoute.value.query
  if (!queryParams.jsonPath || !queryParams.audioPath) {
    if (!queryParams.jsonPath) { queryParams.jsonPath = 'Thu-8-21-2008.ogg.json' }
    if (!queryParams.audioPath) { queryParams.audioPath = 'Thu-8-21-2008.ogg' }
    router.push({ query: queryParams })
  }
}
maybeRedirect()

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
    router.currentRoute.value.query.jsonPath = url
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        parseDeepgramResult(data)
      })
  } else {
    router.currentRoute.value.query.audioPath = url
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
  function recurse(cur: any, prop) {
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
  {{ maybeRedirect() }}
  <main>
    <div>
      <!-- <div class="uploads">
        <form method="post" enctype="multipart/form-data">
          <label>
            Audio file:
            <input type="file" name="audioFile" id="audioFile" @submit.native.prevent="" @change="onFileChange">
          </label>
          <label>
            Audio URL:
            <input type="text" name="audioUrl" id="audioUrl" @submit.native.prevent="" @change="onUrlChange"
              :value="router.currentRoute.value.query.audioPath">
          </label>
        </form>
        <form method="post" enctype="multipart/form-data">
          <label>
            Deepgram JSON file:
            <input type="file" name="transcriptFile" id="transcriptFile" @submit.native.prevent="" @change="onFileChange">
          </label>
          <label>
            JSON URL:
            <input type="text" name="jsonUrl" id="jsonUrl" @submit.native.prevent="" @change="onUrlChange"
              :value="router.currentRoute.value.query.jsonPath">
          </label>
        </form>
      </div> -->
      <WaveSurfer />
      <div>
        <label>
          Show Details
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
              <pre class="metadataValue">{{ md }}</pre>
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