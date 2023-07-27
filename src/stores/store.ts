import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import WaveSurfer from 'wavesurfer.js'

import type {
  Word,
  Paragraph,
  Utterance,
  Sentence,
  DeepgramResult,
  Bounded
} from 'src/types/deepgram'
import { fetchFromIndex } from '@/see'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'

type ChannelAlternative = {
  channel: number
  alternative: number
}

export const useStore = defineStore('store', {
  state: () => {
    return {
      wavesurfer: ref(null) as Ref<WaveSurfer | null>, // wavesurfer instance
      wsRegions: null as RegionsPlugin | null, // wavesurfer regions plugin
      transcription: {} as DeepgramResult, // results from the transcription api
      speakers: [] as string[], // ordered list of speaker names in transcription
      transcriptionMetadata: {} as any, // metadata from the transcription api
      channelAlternative: { channel: 0, alternative: 0 } as ChannelAlternative, // currently selected channel and alternative
      options: {
        showDetails: false
      },
      audioPath: 'Fri-09-07-2007A.ogg',
      jsonPath: 'Fri-09-07-2007A.ogg.json',
      currentBounded: { start: 0, end: 0 } as Bounded,
      currentTime: 0,
      indices: {
        // per-second index of objects in the transcription
        word: [] as Word[][],
        sentence: [] as Sentence[][],

        paragraph: [] as Paragraph[][],
        utterance: [] as Utterance[][]
      },
      audioError: null as string | null,
      transcriptionError: null as string | null
    }
  },
  getters: {
    getAlternative: (state) => {
      return state.transcription.results?.channels[state.channelAlternative.channel].alternatives[
        state.channelAlternative.alternative
      ]
    },
    currentWords: (state) => {
      if (state.currentBounded === null) return []
      else return fetchFromIndex(state.indices.word, state.currentBounded, (word) => word.word)
    },
    currentParagraphs: (state) => {
      if (state.currentBounded === null) return []
      else return fetchFromIndex(state.indices.paragraph, state.currentBounded, JSON.stringify)
    },
    hoveredDesc: (state) => {
      if (state.currentBounded === null) return ''
      else if ('word' in state.currentBounded) return state.currentBounded.word as string
      else return ''
    },
    activeRegion: (state) => {
      return state.wsRegions?.getRegions()[0]
    },
    getSpeaker: (state) => (speaker: number) => {
      return state.transcriptionMetadata.speakers[speaker] || `Speaker ${speaker}`
    }
  },
  actions: {
    updateRegion() {
      // TODO: fix wavesurfer so everything doesn't have to be destroyed and recreated. the bug is in the regions plugin
      this.wsRegions?.destroy()
      const regions = RegionsPlugin.create()
      this.wsRegions = regions
      this.wavesurfer?.registerPlugin(regions)
      regions.addRegion({
        content: this.hoveredDesc,
        color: 'hsla(100, 100%, 30%, 0.5)',
        start: this.currentBounded.start,
        end: this.currentBounded.end
      })
    },
    jumpToAudio() {
      this.wavesurfer?.seekTo(this.currentBounded.start / this.transcriptionMetadata.duration)
    }
  }
})
