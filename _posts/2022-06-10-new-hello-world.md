# Another hello world

As my previous personal website will expire after my graduation, I have to move my blog to a permanent service provider. GitHub + Jekyll is a good choice for building a blog if dynamic pages are not necessary. All you have to do is clone a theme and then write Markdowns in GitHub editor. Code snippets will be automatically rendered. For example:

```python
temp = x
x = y
y = temp
```

Rendering formulas such as $e^{i\pi}+1=0$ is supported.

Dynamic content is the main reason why I moved from Jekyll to Vuepress 2.
<div>Count: {{ count }}</div>
<div>
  <button @click="count++">Add</button>
</div>

<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>
