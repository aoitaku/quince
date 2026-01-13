import { Component, Container, Layouter, StyleProperties } from '../../src'

class Box extends Component implements Container {
  public components: Component[] = []
  public readonly layouter = new Layouter()

  constructor(id: string, style?: StyleProperties) {
    super(id, style)
  }

  public addComponent(component: Component) {
    this.components.push(component)
  }

  public find(id: string) {
    return this.components.find((component) => component.id === id)
  }

  public resize(parent: Component | { width: number; height: number }) {
    super.resize(parent)
    this.layouter.resize(this, parent)
  }

  public move(ox: number, oy: number, parent: Component | { width: number; height: number }) {
    super.move(ox, oy, parent)
    this.layouter.move(this, ox, oy, parent)
  }

  public relayout(ox: number, oy: number, parent: { width: number; height: number }) {
    this.resize(parent)
    this.move(ox, oy, parent)
  }
}

const isContainer = (component: Component): component is Component & Container =>
  'components' in component

class CanvasRenderer {
  private readonly ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  public clear() {
    const { width, height } = this.ctx.canvas
    this.ctx.clearRect(0, 0, width, height)
  }

  public render(component: Component) {
    if (!component.visible) {
      return
    }
    this.drawComponent(component)
    if (isContainer(component)) {
      component.components.forEach((child) => this.render(child))
    }
  }

  private drawComponent(component: Component) {
    this.ctx.strokeStyle = '#2b2b2b'
    this.ctx.strokeRect(component.x, component.y, component.width, component.height)
    this.ctx.fillStyle = '#2b2b2b'
    this.ctx.font = '12px sans-serif'
    this.ctx.fillText(component.id, component.x + 4, component.y + 14)
  }
}

const getCanvas = () => {
  const existing = document.querySelector<HTMLCanvasElement>('#layout')
  if (existing) {
    return existing
  }
  const canvas = document.createElement('canvas')
  canvas.id = 'layout'
  canvas.width = 640
  canvas.height = 320
  document.body.appendChild(canvas)
  return canvas
}

const canvas = getCanvas()
const ctx = canvas.getContext('2d')
if (!ctx) {
  throw new Error('CanvasRenderingContext2D is not available')
}

const root = new Box('root', {
  layout: 'flow',
  width: canvas.width,
  height: canvas.height,
  padding: [12],
})

root.addComponent(new Component('title', { width: 200, height: 24 }))
root.addComponent(new Component('badge', { width: 72, height: 20, margin: [0, 0, 0, 8] }))
root.addComponent(new Component('break', { width: 1, height: 1, breakAfter: true }))
root.addComponent(new Component('body', { width: 400, height: 90 }))
root.addComponent(new Component('aside', { width: 160, height: 90, margin: [0, 0, 0, 12] }))

root.relayout(0, 0, { width: canvas.width, height: canvas.height })

const renderer = new CanvasRenderer(ctx)
renderer.clear()
renderer.render(root)
