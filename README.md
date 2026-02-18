# rehype-mermaid-lite

[![npm version](https://img.shields.io/npm/v/rehype-mermaid-lite)](https://www.npmjs.com/package/rehype-mermaid-lite)
[![CI](https://github.com/ChiahongHong/rehype-mermaid-lite/actions/workflows/ci.yaml/badge.svg)](https://github.com/ChiahongHong/rehype-mermaid-lite/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/ChiahongHong/rehype-mermaid-lite/branch/main/graph/badge.svg)](https://codecov.io/gh/ChiahongHong/rehype-mermaid-lite)
[![license](https://img.shields.io/npm/l/rehype-mermaid-lite)](LICENSE)

A lightweight [rehype](https://github.com/rehypejs/rehype) plugin that transforms Mermaid code blocks into `<pre class="mermaid">` elements for **client-side rendering**: no Playwright, no build-time overhead.

## Why?

Most Mermaid rehype/remark plugins render diagrams at build time using headless browsers such as Playwright. This adds heavy dependencies and slows down builds. If you prefer to let the browser handle rendering (via the official [Mermaid library](https://mermaid.js.org/)), this plugin simply rewrites the code blocks so Mermaid can pick them up at runtime.

### Before

```html
<pre>
  <code class="language-mermaid">
    graph TD
    A --> B
  </code>
</pre>
```

### After

```html
<pre class="mermaid">
  graph TD
  A --> B
</pre>
```

## Installation

```bash
npm install rehype-mermaid-lite
```

## Usage

### Astro

```js
// astro.config.mjs
import rehypeMermaidLite from "rehype-mermaid-lite"

export default defineConfig({
  markdown: {
    syntaxHighlight: {
      excludeLangs: ["mermaid"],
    },
    rehypePlugins: [rehypeMermaidLite],
  },
})
```

### unified

```js
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeMermaidLite from "rehype-mermaid-lite"

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMermaidLite)
  .use(rehypeStringify)
```

## Client-Side Mermaid Setup

After the HTML is generated, initialize Mermaid in the browser:

```ts
import mermaid from "mermaid"

mermaid.initialize({ startOnLoad: false })
await mermaid.run()
```

Or load it via CDN:

```html
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"
  mermaid.initialize({ startOnLoad: false })
  await mermaid.run()
</script>
```

## API

```ts
import rehypeMermaidLite from "rehype-mermaid-lite"
```

The default export is a [unified](https://github.com/unifiedjs/unified) plugin. It takes no options.

The plugin walks the hast tree looking for `<pre><code class="language-mermaid">` nodes and replaces them with `<pre class="mermaid">`, preserving the text content for client-side Mermaid rendering.

## License

[MIT](LICENSE) © Chiahong Hong
