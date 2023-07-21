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
</script>

<template>
  {{ maybeRedirect() }}
  <main>
    <div>
      <div class="uploads">
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
      </div>
      <WaveSurfer />
    </div>
    <div class="wrapper">
      <Suspense>
        <Transcription />
      </Suspense>
      <div class="detail-wrapper">
        <Details />
        <div class="metadata">
          <h3>Metadata</h3>
          <pre>{{ store.transcriptionMetadata }}</pre>
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
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr;
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
  /* overflow-y: auto; */
}

.detail-wrapper div {
  margin-bottom: 2em;
}
</style>
```