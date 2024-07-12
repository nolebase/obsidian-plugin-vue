import { Plugin } from 'obsidian'
import type { EditorView, PluginValue, ViewUpdate } from '@codemirror/view'
import { ViewPlugin } from '@codemirror/view'
import { type App, createApp, defineComponent, h } from 'vue'
import * as Vue from 'vue'
import { compileTemplate } from '@vue/compiler-sfc'

import { unified } from 'unified'
import RemarkParse from 'remark-parse'
import RemarkRehype from 'remark-rehype'
import RehypeRaw from 'rehype-raw'
import { remove } from 'unist-util-remove'
import { toHtml } from 'hast-util-to-html'

import { evaluateAnyModule } from './import'

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
    const anyGlobalThis = globalThis as any
    anyGlobalThis.Vue = Vue

    // eslint-disable-next-line no-console
    console.log('view ready', this.view.dom)

    let vueDom = this.view.dom.querySelector('.obsidian-plugin-vue')
    if (!vueDom) {
      vueDom = this.view.dom.querySelector('.cm-scroller .cm-sizer')!.createDiv()
      vueDom.classList.add('.obsidian-plugin-vue')
    }

    this.vueInstance?.unmount()

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

    let index = 0
    const renderFunctions: Array<() => void> = []

    for (const node of transformedHast.children) {
      index++

      const componentTemplateStr = toHtml(node)

      const { code, errors } = compileTemplate({
        isProd: false,
        source: componentTemplateStr,
        filename: `some-${index}`,
        id: index.toString(),
        compilerOptions: {
          mode: 'function',
        },
      })
      if (errors.length) {
        console.error(errors)
        throw new Error('Failed to compile template')
      }

      const res = await evaluateAnyModule<() => void>(code)
      if (!res)
        continue

      renderFunctions.push(res)
    }

    const comp = defineComponent({
      setup() {
        return () => [
          h('div', { class: 'obsidian-plugin-vue' }, renderFunctions.map(fn => fn())),
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
