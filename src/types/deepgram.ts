export type DeepgramResult = {
  metadata: Metadata;
  results: Results;
}

export type Metadata = {
  transaction_key: string;
  request_id: string;
  sha256: string;
  created: Date;
  duration: number;
  channels: number;
  models: string[];
  model_info: ModelInfos;
}

export type Bounded = {
  start: number;
  end: number;
}

export type ModelInfos = [string: ModelInfo]

export type ModelInfo = {
  name: string;
  version: string;
  arch: string;
}

export type Results = {
  channels: Channel[];
  utterances: Utterance[];
}

export type Channel = {
  alternatives: Alternative[];
}

export type Alternative = {
  transcript: string;
  confidence: number;
  words: Word[];

  paragraphs?: Paragraphs;
}

export type Paragraphs = {
  transcript: string;
  paragraphs: Paragraph[];
}

export type Paragraph = {
  sentences: Sentence[];
  speaker: number;
  num_words: number;
} & Bounded

export type Sentence = {
  text: string;
} & Bounded

export type Word = {
  word: string;
  confidence: number;
  speaker: number;
  speaker_confidence: number;
  punctuated_word: string;
} & Bounded

export type Utterance = {
  confidence: number;
  channel: number;
  transcript: string;
  words: Word[];
  speaker: number;
  id: string;
} & Bounded
