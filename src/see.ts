import { storeToRefs } from 'pinia'
import type { DeepgramResult, Bounded } from './types/deepgram'
import { useStore } from '@/stores/store'

export function parseDeepgramResult(result: DeepgramResult): void {
  const store = storeToRefs(useStore())
  store.transcription.value = result
  const { metadata, results } = result
  store.transcriptionMetadata.value = metadata

  results.channels.forEach((channel, channelNum) => {
    let alternativeNum = 0
    for (const alternative of channel.alternatives) {
      if (alternative.paragraphs == null) {
        console.warn('no paragraphs in alternative, skipping alternative', alternative)
        store.transcription.value.results.channels[channelNum].alternatives.splice(
          alternativeNum,
          1
        )
        continue
      }
      alternative.words.forEach((word) => {
        fillIndex(store.indices.value.word, word)
        if (store.speakers.value[word.speaker] === undefined)
          store.speakers.value[word.speaker] = `Speaker ${word.speaker}`
      })

      alternative.paragraphs?.paragraphs.forEach((paragraph) => {
        fillIndex(store.indices.value.paragraph, paragraph)
        paragraph.sentences.forEach((sentence) => {
          fillIndex(store.indices.value.sentence, sentence)
        })
      })
    }
  })

  results.utterances?.forEach((utterance) => {
    fillIndex(store.indices.value.utterance, utterance)
    // I don't think we want to fill the index with the words in the utterance,
    // because they're already in the index from the channel.alternatives
  })
}

function fillIndex(index: Bounded[][], item: Bounded): void {
  let slot = Math.floor(item.start)
  const finalSlot = Math.ceil(item.end)
  while (slot < finalSlot) {
    let slotList = index[slot]
    if (!slotList) index[slot] = slotList = []
    slotList.push(item)
    slot++
  }
}

export function fetchFromIndex<T extends Bounded>( // really, Proxy<Bounded>
  index: T[][],
  item: Bounded,
  getKey: (t: T) => any
): T[] {
  let slot = Math.floor(item.start)
  const finalSlot = Math.ceil(item.end)
  let result: T[] = []
  let seen = new Set()
  while (slot < finalSlot) {
    const slotList = index[slot]
    if (slotList) {
      for (const slotItem of slotList) {
        if (slotItem.end <= item.start || slotItem.start >= item.end) continue // don't include items which just happen to be in the bucket
        const key = getKey(slotItem)
        if (seen.has(key)) continue
        seen.add(key)
        result.push(slotItem)
      }
    }
    slot++
  }
  return result
}

export function colorizeRed(confidence: number) {
  const alpha = (1.0 - confidence) * 0.6
  return `rgba(230, 50, 75, ${alpha})`
}

export function flatten(data: object) {
  let result: any = {}
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i++) recurse(cur[i], prop + '[' + i + ']')
    } else {
      let isEmpty = true
      for (let p in cur) {
        isEmpty = false
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
      if (isEmpty && prop) result[prop] = {}
    }
  }
  recurse(data, '')
  return result
}
