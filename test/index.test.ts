// MIT License

// Copyright (c) 2026 Chiahong Hong

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { describe, it, expect } from "vitest"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeMermaidLite from "../src/index"

describe("rehype-mermaid-lite", () => {
  it('transforms mermaid code block into <pre class="mermaid">', async () => {
    const input = `
\`\`\`mermaid
graph TD
A --> B
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain('<pre class="mermaid">')
    expect(html).toContain("graph TD")
    expect(html).not.toContain("language-mermaid")
  })

  it("does not modify non-mermaid code blocks", async () => {
    const input = `
\`\`\`js
console.log("hi")
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain("language-js")
    expect(html).not.toContain('class="mermaid"')
  })

  it("exports rehypeMermaidLite as a named export", async () => {
    const { rehypeMermaidLite: named } = await import("../src/index")
    expect(named).toBeDefined()
    expect(typeof named).toBe("function")
  })

  it("does not modify plain text without code blocks", async () => {
    const input = "Hello, world!"

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain("Hello, world!")
    expect(html).not.toContain("mermaid")
    expect(html).not.toContain("<pre")
  })

  it("transforms multi-line mermaid diagrams correctly", async () => {
    const input = `
\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob
    Bob-->>Alice: Hi Alice
    Alice->>Bob: How are you?
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain('<pre class="mermaid">')
    expect(html).toContain("sequenceDiagram")
    expect(html).toContain("Alice")
    expect(html).not.toContain("language-mermaid")
  })

  it("transforms multiple mermaid blocks in the same document", async () => {
    const input = `
\`\`\`mermaid
graph TD
A --> B
\`\`\`

Some text between.

\`\`\`mermaid
pie
"A" : 40
"B" : 60
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    const matches = html.match(/<pre class="mermaid">/g)
    expect(matches).toHaveLength(2)
    expect(html).toContain("graph TD")
    expect(html).toContain("pie")
  })

  it("transforms mermaid blocks while preserving other code blocks", async () => {
    const input = `
\`\`\`mermaid
graph TD
A --> B
\`\`\`

\`\`\`js
console.log("hello")
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain('<pre class="mermaid">')
    expect(html).toContain("language-js")
    expect(html).toContain("graph TD")
    expect(html).toContain("console.log")
  })

  it("handles empty mermaid code blocks", async () => {
    const input = `
\`\`\`mermaid
\`\`\`
`

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeMermaidLite)
      .use(rehypeStringify)
      .process(input)

    const html = String(file)

    expect(html).toContain('<pre class="mermaid">')
    expect(html).not.toContain("language-mermaid")
  })
})
