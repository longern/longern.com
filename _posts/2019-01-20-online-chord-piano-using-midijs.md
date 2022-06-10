---
title: Online Chord Piano Using MIDI.js
categories:
  - demo
tags:
  - music
---

# Online Chord Piano Using MIDI.js

## Introduction

Accompanying singing has never been easier! Just press the digit key on the keyboard to play the corresponding chord.

## Demo

<ClientOnly>
  <component is="script" src="https://cdn.jsdelivr.net/npm/midi.js@0.3.1/lib/midi.min.js" @load="midiLoaded"></component>
</ClientOnly>

Pitch shift: <span style="margin-right: 3em" v-text="pitchShift"></span>
<span class="btn-group" role="group">
<button class="btn btn-default" @click="pitchShift++">+</button>
<button class="btn btn-default" @click="pitchShift--">-</button>
</span>

Press 1~7 to play!

<script setup lang="ts">
import { ref } from "vue";
const pitchShift = ref(0);

function midiLoaded() {
  const MIDI = (window as any).MIDI;
  MIDI.loadPlugin({
    soundfontUrl: "/assets/soundfont/",
  });
  let lastRootNote: number | null = null;
  window.onkeydown = function (event: KeyboardEvent) {
    if (event.repeat) return;

    const which = event.code.replace("Digit", "");
    if (!which.match(/^[1-7]$/)) return;

    const shift = pitchShift.value;

    let rootNote =
      [60, 62, 64, 65, 67, 57, 59][Number.parseInt(which) - 1] + shift;
    if (event.shiftKey) rootNote -= 12;

    let minor = false;
    if ([2, 4, 9].indexOf(rootNote % 12) !== -1) minor = true;

    const notes = [rootNote, rootNote + (minor ? 3 : 4), rootNote + 7];
    if (lastRootNote !== rootNote) notes.push(rootNote - 12);
    lastRootNote = rootNote;
    MIDI.chordOn(0, notes, 127, 0);
  };
}
</script>
