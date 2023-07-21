
import type { DeepgramResult, Bounded } from "./types/deepgram"
import { useStore } from '@/stores/store'

export function parseDeepgramResult(result: DeepgramResult): void {
  const store = useStore()
  store.transcription = result
  const { metadata, results } = result
  store.transcriptionMetadata = metadata


  results.channels.forEach((channel) => {
    for (const alternative of channel.alternatives) {
      alternative.words.forEach((word) => {
        fillIndex(store.indices.word, word)
      })

      alternative.paragraphs?.paragraphs.forEach((paragraph) => {
        fillIndex(store.indices.paragraph, paragraph)
        paragraph.sentences.forEach((sentence) => {
          fillIndex(store.indices.sentence, sentence)
        })
      })
      // break // only do the first alternative
    }
  })

  results.utterances.forEach((utterance) => {
    fillIndex(store.indices.utterance, utterance)
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

export function fetchFromIndex<T extends Proxy<Bounded>>(index: T[][], item: Bounded, getKey: ((T) => any)): T[] {
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
