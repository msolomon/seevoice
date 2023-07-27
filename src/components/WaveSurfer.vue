<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.js'

import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = storeToRefs(useStore())

function secondsToLabel(seconds: number) {
  let minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  minutes = minutes - (hours * 60)
  const hourStr = hours > 0 ? `${hours}:` : ''
  let minutesStr = `${minutes}`
  if (hours > 0) { minutesStr = minutesStr.padStart(2, "0") }
  return `${hourStr}${minutesStr}:${`${Math.floor(seconds % 60)}`.padStart(2, "0")}`
}

const loading = ref(true)
const audioPath = store.audioPath
const audioError = store.audioError

onMounted(() => {

  fetch(audioPath.value, { method: 'HEAD' })
    .then((response) => {
      if (response.status == 404) { audioError.value = `File not found: ${audioPath.value}` }
    })
    .catch((error) => { audioError.value = `Error loading ${audioPath.value}: ${error}` })

  // easier to add here and have a JS reference to the audio element
  const audio = new Audio()
  audio.controls = true
  audio.style.width = '100%'
  document.getElementById('audio')?.appendChild(audio)

  const wavesurfer = WaveSurfer.create({
    media: audio,
    container: '#waveform',
    waveColor: '#00bd7e',
    progressColor: '#006644',

    minPxPerSec: 5,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,

    plugins: [
      Minimap.create({
        container: '#waveform',
        height: 24,
        waveColor: '#00bd7e',
        progressColor: '#006644',
      }),
      Timeline.create({
        height: 20,
        insertPosition: 'beforebegin',
        timeInterval: 1,
        primaryLabelInterval: 60,
        secondaryLabelInterval: 60,
        formatTimeCallback: secondsToLabel,
        style: {
          fontSize: '10px',
          color: '#2D5B88',
        },
      }),
    ],
  })

  wavesurfer.on('ready', () => {
    audioError.value = null
    loading.value = false
  })

  wavesurfer
    .load(audioPath.value)
    .catch((error) => audioError.value = `Error loading ${audioPath.value}: ${error}`)

  wavesurfer.once('decode', () => {
    const slider = document.querySelector('input[type="range"]')

    slider?.addEventListener('input', (e: any) => {
      const minPxPerSec = e.target?.valueAsNumber
      wavesurfer.zoom(minPxPerSec)
    })
  })

  wavesurfer.once('interaction', () => {
    wavesurfer.play()
  })
  wavesurfer.on('timeupdate', (ts) => store.currentTime.value = ts)

  store.wavesurfer.value = wavesurfer
  useStore().updateRegion()
})
</script>

<template>
  <h3 class="green"><strong>Audio:</strong> {{ audioPath }}</h3>
  <div v-if="audioError != null"> {{ audioError }}</div>
  <div v-else-if="loading"> Loading {{ audioPath }}...</div>
  <label class="zoom">
    Zoom:
    <input type="range" min="1" max="500" value="5" />
  </label>
  <div id="waveform"></div>
  <div id="audio"></div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.zoom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.zoom input {
  margin-left: 1em;
  width: 100%
}
</style>
