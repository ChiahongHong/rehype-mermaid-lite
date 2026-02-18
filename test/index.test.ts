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
})
