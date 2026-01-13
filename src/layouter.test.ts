import { describe, expect, it } from 'vitest'
import { Component, Container, Layouter, SizeMeasurable, StyleProperties } from './index'

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

  public resize(parent: Component | SizeMeasurable) {
    super.resize(parent)
    this.layouter.resize(this, parent)
  }

  public move(ox: number, oy: number, parent: Component | SizeMeasurable) {
    super.move(ox, oy, parent)
    this.layouter.move(this, ox, oy, parent)
  }

  public relayout(ox: number, oy: number, parent: Component | SizeMeasurable) {
    this.resize(parent)
    this.move(ox, oy, parent)
  }
}

const snapshotComponent = (component: Component) => ({
  id: component.id,
  x: component.x,
  y: component.y,
  w: component.width,
  h: component.height,
})

describe('Layouter examples', () => {
  it('matches the current example output', () => {
    const root = new Box('root', {
      layout: 'flow',
      width: 360,
      height: 200,
      padding: [8],
    })

    root.addComponent(new Component('title', { width: 200, height: 24 }))
    root.addComponent(new Component('badge', { width: 60, height: 20, margin: [0, 0, 0, 8] }))
    root.addComponent(new Component('break', { width: 1, height: 1, breakAfter: true }))
    root.addComponent(new Component('body', { width: 320, height: 80 }))

    root.relayout(0, 0, { width: 360, height: 200 })

    expect(root.components.map(snapshotComponent)).toEqual([
      { id: 'title', x: 8, y: 8, w: 200, h: 24 },
      { id: 'badge', x: 216, y: 8, w: 60, h: 20 },
      { id: 'break', x: 276, y: 8, w: 1, h: 1 },
      { id: 'body', x: 8, y: 32, w: 320, h: 80 },
    ])

    const row = new Box('row', {
      layout: 'horizontalBox',
      width: 300,
      height: 100,
      padding: [4],
      justifyContent: 'spaceBetween',
      alignItems: 'center',
    })

    row.addComponent(new Component('left', { width: 80, height: 40 }))
    row.addComponent(new Component('middle', { width: 60, height: 20 }))
    row.addComponent(new Component('right', { width: 40, height: 60 }))

    row.relayout(0, 0, { width: 300, height: 100 })

    expect(row.components.map(snapshotComponent)).toEqual([
      { id: 'left', x: 4, y: 30, w: 80, h: 40 },
      { id: 'middle', x: 140, y: 40, w: 60, h: 20 },
      { id: 'right', x: 256, y: 20, w: 40, h: 60 },
    ])

    const column = new Box('column', {
      layout: 'verticalBox',
      width: 240,
      height: 220,
      padding: [6],
      justifyContent: 'center',
      alignItems: 'spaceBetween',
    })

    const rowA = new Box('rowA', {
      layout: 'horizontalBox',
      width: 200,
      height: 40,
      padding: [2],
      justifyContent: 'left',
      alignItems: 'center',
    })
    rowA.addComponent(new Component('rowA-left', { width: 60, height: 20 }))
    rowA.addComponent(new Component('rowA-right', { width: 40, height: 24, margin: [0, 0, 0, 8] }))

    const rowB = new Box('rowB', {
      layout: 'horizontalBox',
      width: 200,
      height: 60,
      padding: [2],
      justifyContent: 'spaceBetween',
      alignItems: 'bottom',
    })
    rowB.addComponent(new Component('rowB-left', { width: 80, height: 30 }))
    rowB.addComponent(new Component('rowB-right', { width: 50, height: 40 }))

    column.addComponent(rowA)
    column.addComponent(rowB)

    column.relayout(0, 0, { width: 240, height: 220 })

    const verticalSnapshots = [column, ...column.components, ...rowA.components, ...rowB.components].map(snapshotComponent)
    expect(verticalSnapshots).toEqual([
      { id: 'column', x: 0, y: 0, w: 240, h: 220 },
      { id: 'rowA', x: 20, y: 6, w: 200, h: 40 },
      { id: 'rowB', x: 20, y: 154, w: 200, h: 60 },
      { id: 'rowA-left', x: 22, y: 16, w: 60, h: 20 },
      { id: 'rowA-right', x: 90, y: 14, w: 40, h: 24 },
      { id: 'rowB-left', x: 22, y: 182, w: 80, h: 30 },
      { id: 'rowB-right', x: 168, y: 172, w: 50, h: 40 },
    ])

    const flowWithAbsolute = new Box('flow-abs', {
      layout: 'flow',
      width: 320,
      height: 160,
      padding: [8],
    })

    flowWithAbsolute.addComponent(new Component('flow-a', { width: 100, height: 20 }))
    flowWithAbsolute.addComponent(new Component('flow-abs-1', { width: 60, height: 30, position: 'absolute', top: 10, right: 10 }))
    flowWithAbsolute.addComponent(new Component('flow-b', { width: 140, height: 24, margin: [0, 0, 0, 6] }))
    flowWithAbsolute.addComponent(new Component('flow-abs-2', { width: 40, height: 40, position: 'absolute', left: 0.5, bottom: 0 }))

    flowWithAbsolute.relayout(0, 0, { width: 320, height: 160 })

    expect(flowWithAbsolute.components.map(snapshotComponent)).toEqual([
      { id: 'flow-a', x: 8, y: 8, w: 100, h: 20 },
      { id: 'flow-abs-1', x: 250, y: 10, w: 60, h: 30 },
      { id: 'flow-b', x: 114, y: 8, w: 140, h: 24 },
      { id: 'flow-abs-2', x: 140, y: 0, w: 40, h: 40 },
    ])
  })
})

describe('Layouter edge cases', () => {
  it('forces a new flow row when breakAfter is set', () => {
    const flow = new Box('flow', {
      layout: 'flow',
      width: 200,
      height: 100,
    })

    const first = new Component('first', { width: 80, height: 10, breakAfter: true })
    expect(first.breakAfter).toBe(true)
    flow.addComponent(first)
    flow.addComponent(new Component('second', { width: 80, height: 20 }))

    flow.relayout(0, 0, { width: 200, height: 100 })

    expect(flow.components.map(snapshotComponent)).toEqual([
      { id: 'first', x: 0, y: 0, w: 80, h: 10 },
      { id: 'second', x: 0, y: 10, w: 80, h: 20 },
    ])
  })

  it('wraps to the next row when flow width overflows', () => {
    const flow = new Box('flow', {
      layout: 'flow',
      width: 160,
      height: 100,
      padding: [0],
    })

    flow.addComponent(new Component('first', { width: 80, height: 10 }))
    flow.addComponent(new Component('second', { width: 80, height: 10 }))
    flow.addComponent(new Component('third', { width: 80, height: 10 }))

    flow.relayout(0, 0, { width: 160, height: 100 })

    expect(flow.components.map(snapshotComponent)).toEqual([
      { id: 'first', x: 0, y: 0, w: 80, h: 10 },
      { id: 'second', x: 80, y: 0, w: 80, h: 10 },
      { id: 'third', x: 0, y: 10, w: 80, h: 10 },
    ])
  })

  it('supports ratio sizing based on parent verticalItemArrangement', () => {
    const parent = new Component('parent', {
      width: 200,
      height: 100,
      verticalItemArrangement: 'ratio',
    })

    parent.resize({ width: 200, height: 100 })

    const child = new Component('child', { width: 0.5, height: 0.25 })
    child.resize(parent)

    expect(snapshotComponent(child)).toEqual({
      id: 'child',
      x: undefined,
      y: undefined,
      w: 100,
      h: 25,
    })
  })

  it('positions absolute children using fractional offsets', () => {
    const parent = new Component('parent', {
      width: 200,
      height: 100,
    })

    parent.resize({ width: 200, height: 100 })
    parent.move(10, 20, { width: 200, height: 100 })

    const child = new Component('child', {
      width: 40,
      height: 20,
      position: 'absolute',
      left: 0.5,
      top: 0.5,
    })

    child.resize(parent)
    child.move(parent.x, parent.y, parent)

    expect(snapshotComponent(child)).toEqual({
      id: 'child',
      x: 90,
      y: 60,
      w: 40,
      h: 20,
    })
  })
})
