---
title: Encrypted Blog Using CryptoJS
categories:
  - demo
---

# Encrypted Blog Using CryptoJS

## Introduction

Want to hide something that only you can see in your public blog? Encrypt your content in a few steps!

## Demo

<form @submit.prevent="cryptoSubmit()">
  <label>Password:</label>
  <input type="text" autocomplete="off" class="form-control" v-model="key">
  <input type="submit" hidden>
</form>
<div v-html="decryptedContent"></div>

## Tutorial

Import CryptoJS.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js"></script>
```

Convert your content into ciphertext in console.
DO NOT commit or it will leak from git history.

```js
CryptoJS.AES.encrypt("Hello world", "key").toString();
```

Save the ciphertext.

```js
var ciphertext = "U2FsdGVkX19ZS8PPl0RE2pIZYe6oz4+mdwJvuzC3idc=";
```

Decrypt ciphertext with the key from input and convert to string.

```js
var bytes = CryptoJS.AES.decrypt(ciphertext, key);
var text = bytes.toString(CryptoJS.enc.Utf8);
```

<ClientOnly>
  <component is="script" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js">
  </component>
</ClientOnly>

<script setup lang="ts">
import { ref } from "vue";
const key = ref("");
const decryptedContent = ref("");

function cryptoSubmit() {
  const CryptoJS = (window as any).CryptoJS;
  const ciphertext = "U2FsdGVkX19ZS8PPl0RE2pIZYe6oz4+mdwJvuzC3idc=";
  var bytes = CryptoJS.AES.decrypt(ciphertext, key.value);
  try {
    var text = bytes.toString(CryptoJS.enc.Utf8);
    if (!text) {
      throw new Error("Decryption failed");
    }
    decryptedContent.value = text;
  } catch (e) {
    decryptedContent.value = e.toString();
  }
  return false;
}
</script>
