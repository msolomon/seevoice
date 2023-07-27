<template>
  <div class="about">
    <h1>About</h1>

    <p>Copyright 2023, Michael Solomon. All rights reserved.</p>

    <br>

    <p>SeeVoice uses <a href="https://wavesurfer-js.org/">Wavesurfer.js</a>
      and is built with <a href="https://vuejs.org/">Vue</a>.
    </p>
    <p>
      It relies on transcripts from <a href="https://deepgram.com/">Deepgram</a>
      requested with these parameters:
    </p>
    <pre>
      punctuate=true
      diarize=true
      smart_format=true
      alternatives=4
      paragraphs=true
    </pre>
    <p>
      To use it, set the <var>audioPath</var> and <var>jsonPath</var> query parameters to corresponding servable files.
    </p>
  </div>
</template>

<style>
.about {
  border-top: 1px solid var(--color-border);
}
</style>
