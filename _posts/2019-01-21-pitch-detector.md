---
categories:
  - demo
tags:
  - music
---

# Pitch Detector

## Introduction

I sometimes wonder how accurate my pitch is when singing. Then I made this demo.

## Demo

<button @click="recording = true">Start</button>

Algorithm from <a href="https://github.com/cwilso/PitchDetect/pull/23/commits/b0d5d28d2803d852dd85d2a1e53c22bcedba4cbf" target="_blank">here</a>

Project from <a href="https://github.com/cwilso/PitchDetect" target="_blank">here</a>

Pitch: <span v-text="pitch"></span> Hz

Note: <span v-text="note"></span>

<script setup>
import { ref, watch } from "vue";
const recording = ref(false);
const pitch = ref(0);
const note = ref("");

function autoCorrelate( buf, sampleRate ) {
	// Implements the ACF2+ algorithm
	var SIZE = buf.length;
	var rms = 0;

	for (var i = 0; i < SIZE; i++) {
		var val = buf[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01) // not enough signal
		return -1;

	var r1 = 0, r2 = SIZE - 1, thres = 0.2;
	for (var i = 0; i < SIZE / 2; i++)
		if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
	for (var i = 1; i < SIZE / 2; i++)
		if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }

	buf = buf.slice(r1, r2);
	SIZE = buf.length;

	var c = new Array(SIZE).fill(0);
	for (var i = 0; i < SIZE; i++)
		for (var j = 0; j < SIZE - i; j++)
			c[i] = c[i] + buf[j] * buf[j + i];

  var d=0;
  while (c[d] > c[d + 1])
    d++;
	var maxval = -1, maxpos = -1;
	for (var i = d; i < SIZE; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}
	var T0 = maxpos;

	var x1 = c[T0-1], x2 = c[T0], x3 = c[T0 + 1];
	var a = (x1 + x3 - 2 * x2) / 2;
	var b = (x3 - x1) / 2;
  if (a)
    T0 = T0 - b / (2 * a);

	return sampleRate / T0;
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

var audioContext = null;
var analyser = null;
var mediaStreamSource = null;

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency) {
	var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
	return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
	return 440 * Math.pow(2, (note - 69) / 12);
}

function centsOffFromPitch(frequency, note) {
	return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

function gotStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to the destination.
  analyser = audioContext.createAnalyser();
  mediaStreamSource.connect(analyser);
  updatePitch();
}

function updatePitch() {
  if (!analyser)
    return;

  var buf = new Float32Array(4096);
  analyser.getFloatTimeDomainData(buf);
  var detectedPitch = autoCorrelate(buf, audioContext.sampleRate);
  if (detectedPitch !== -1) {
    var noteNumber = noteFromPitch(detectedPitch);
    pitch.value = Math.round(detectedPitch);
    note.value = noteStrings[noteNumber % 12] + (Math.floor(noteNumber / 12) - 1);
  } else {
    pitch.value = null;
    note.value = null;
  }
  window.requestAnimationFrame(updatePitch);
}

watch(recording, function(newVal) {
  if (!newVal) return;

  audioContext = new AudioContext();

  navigator.getUserMedia(
    {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      }
    },
    gotStream,
    function(e) { }
  );
})
</script>
