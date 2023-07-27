# 👁️See🎙️Voice

SeeVoice is a (hacked-together) tool for exploring audio transcriptions from Deepgram.

- Click on a word to play the audio from that point in the transcript
- Red words are low confidence transcriptions
- Hover over a word to see it in the transcript
- With "Details" enabled, see alternate word transcriptions and confidence scores
- Zoom and browse the waveform view
- Currently, only [Deepgram](https://deepgram.com) transcripts are supported (I have no affiliation)

  

https://github.com/msolomon/seevoice/assets/267142/07b3f564-0395-4ad9-941f-ae129d6541de



## Usage

First, clone the repo.

Then, get a transcript from Deepgram for your audio file:

```bash
curl \
  --request POST \
  --header 'Authorization: Token <YOUR_DEEPGRAM_API_KEY>' \
  --url 'https://api.deepgram.com/v1/listen?tier=nova&language=en-US&punctuate=true&diarize=true&smart_format=true&alternatives=4&paragraphs=true' \
  --data-binary @myfile.mp3 \
  -o myfile.mp3.json
```

Then, move files you want to read into the `public` folder, or alternatively symlink them.
`public` will be served in webserver root.

```bash
ln -s /path/to/myfile.mp3 public/
ln -s /path/to/myfile.mp3.json public/
cp /path/to/myfile2.mp3* public/
```

Then, run the following commands:

```bash
yarn install
yarn dev
```

This opens a webserver at `localhost:5173` by default.
Visit this URL in your browser with `audioPath` and `jsonPath` query parameters:

http://localhost:5173/?audioPath=myfile.mp3&jsonPath=myfile.mp3.json

Enjoy browsing your transcript!

# Tech
SeeVoice uses Vue 3 and Vite, along with a small list of dependencies.

Presently, it runs best in dev mode.
