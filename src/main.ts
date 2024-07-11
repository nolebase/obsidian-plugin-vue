import { Plugin } from 'obsidian'
import type { EditorView, PluginValue, ViewUpdate } from '@codemirror/view'
import { ViewPlugin } from '@codemirror/view'
import { type App, createApp, defineComponent, h } from 'vue'

import { unified } from 'unified'
import RemarkParse from 'remark-parse'
import RemarkRehype from 'remark-rehype'
import RehypeRaw from 'rehype-raw'
import { remove } from 'unist-util-remove'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class VueViewPlugin implements PluginValue {
  private view: EditorView
  private vueInstance: App<Element> | undefined

  constructor(view: EditorView) {
    this.view = view

    this.init()
  }

  update(update: ViewUpdate) {
    if (!update.docChanged || !update.viewportChanged)
      return

    // eslint-disable-next-line no-console
    console.log('update', update)
  }

  destroy(): void {
    // eslint-disable-next-line no-console
    console.log('destroy')
  }

  async init() {
    await this.waitForViewDOM()

    // eslint-disable-next-line no-console
    console.log('view ready', this.view.dom)

    let vueDom = this.view.dom.querySelector('.obsidian-plugin-vue')
    if (!vueDom) {
      vueDom = this.view.dom.querySelector('.cm-scroller .cm-sizer')!.createDiv()
      vueDom.classList.add('.obsidian-plugin-vue')
    }

    const parsedMarkdownAst = await unified()
      .use(RemarkParse)
      .use(() => tree => remove(tree, 'heading'))
      .parse(this.view.state.doc.toString())

    const transformedHast = await unified()
      .use(RemarkRehype, { allowDangerousHtml: true })
      .use(() => tree => remove(tree, 'text'))
      .use(RehypeRaw)
      .use(() => tree => remove(tree, (node, _, parent) => parent?.type === 'root' && node.type === 'text'))
      .run(parsedMarkdownAst)

    // eslint-disable-next-line no-console
    console.log('transformedHast', transformedHast)

    this.vueInstance?.unmount()

    const comp = defineComponent({
      setup() {
        return () => [
          h('div', 'Hello World'),
        ]
      },
    })

    this.vueInstance = createApp(comp)
    this.vueInstance!.mount(vueDom)
  }

  async waitForViewDOM(seconds: number = 5) {
    let i = 0

    while (!this.view || !this.view.dom) {
      await sleep(1000)

      i++
      if (i > seconds)
        return
    }
  }
}

export default class VuePlugin extends Plugin {
  async onload() {
    // this.registerMarkdownPostProcessor((element, context) => {
    // })

    const editorPlugins = ViewPlugin.define(view => new VueViewPlugin(view))
    this.registerEditorExtension(editorPlugins)
  }
}
