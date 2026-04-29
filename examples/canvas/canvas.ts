import {
  addComponent,
  createComponent,
  createContainer,
  getHeight,
  getVisible,
  getWidth,
  getX,
  getY,
  relayoutContainer,
  type Component,
  type Container,
  type StyleProperties,
} from '../../src'
import type { Layoutable } from '../../src/layouter'

function createBox(id: string, style?: StyleProperties): Layoutable {
  return {
    ...createComponent(id, style),
    ...createContainer(),
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
    if (!getVisible(component)) {
      return
    }
    this.drawComponent(component)
    if (isContainer(component)) {
      component.components.forEach((child) => this.render(child))
    }
  }

  private drawComponent(component: Component) {
    const x = getX(component) || 0
    const y = getY(component) || 0
    this.ctx.strokeStyle = '#2b2b2b'
    this.ctx.strokeRect(x, y, getWidth(component), getHeight(component))
    this.ctx.fillStyle = '#2b2b2b'
    this.ctx.font = '12px sans-serif'
    this.ctx.fillText(component.id, x + 4, y + 14)
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

const root = createBox('root', {
  layout: 'flow',
  width: canvas.width,
  height: canvas.height,
  padding: [12],
})

addComponent(root, createComponent('title', { width: 200, height: 24 }))
addComponent(root, createComponent('badge', { width: 72, height: 20, margin: [0, 0, 0, 8] }))
addComponent(root, createComponent('break', { width: 1, height: 1, breakAfter: true }))
addComponent(root, createComponent('body', { width: 400, height: 90 }))
addComponent(root, createComponent('aside', { width: 160, height: 90, margin: [0, 0, 0, 12] }))

relayoutContainer(root, 0, 0, { width: canvas.width, height: canvas.height })

const renderer = new CanvasRenderer(ctx)
renderer.clear()
renderer.render(root)
