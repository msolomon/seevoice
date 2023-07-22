<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.js'

import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const rawStore = useStore()
const store = storeToRefs(rawStore)
const route = useRoute()
const audioPath = route.query.audioPath?.toString() ?? ''

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

const region = store.activeRegion?.value
const bounded = store.currentBounded
if (region) {
  console.log('updating region', store.currentBounded)
  region.start = bounded.value.start
  region.end = bounded.value.end
}


onMounted(() => {
  const audio = new Audio()
  audio.controls = true
  audio.style.width = '100%'
  document.getElementById('audio')?.appendChild(audio)

  const regions = Regions.create()
  const wavesurfer = WaveSurfer.create({
    media: audio,
    container: '#waveform',
    waveColor: '#00bd7e',
    progressColor: '#006644',
    url: audioPath,

    minPxPerSec: 5,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,

    plugins: [
      regions,
      Minimap.create({
        container: '#waveform',
        height: 20,
        waveColor: '#ddd',
        progressColor: '#999',
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

  wavesurfer.on('ready', () => loading.value = false)
  wavesurfer.on('timeupdate', (ts) => rawStore.currentTime = ts)

  rawStore.wavesurfer = wavesurfer
  rawStore.wsRegions = regions
})
</script>

<template>
  <h4 class="green">{{ audioPath }}</h4>
  <div v-if="loading"> Loading {{ audioPath }}...</div>
  <label style="line-break: normal;">
    <input type="range" min="1" max="1000" value="5" style="width: 100%" />
  </label>
  <div id="waveform"></div>
  <div id="audio"></div>
</template>

<script lang="ts">

</script>

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

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
