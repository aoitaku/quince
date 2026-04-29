import { describe, expect, it } from 'vitest'
import {
  addComponent,
  applyMove,
  applyResize,
  createComponent,
  createContainer,
  getHeight,
  getWidth,
  getX,
  getY,
  move,
  relayoutContainer,
  resize,
  type Component,
  type Container,
  type StyleProperties,
} from './index'
import type { Layoutable } from './layouter'

function createBox(id: string, style?: StyleProperties): Layoutable {
  return {
    ...createComponent(id, style),
    ...createContainer(),
  }
}

function add(box: Container, component: Component) {
  addComponent(box, component)
}

const snapshotComponent = (component: Component) => ({
  id: component.id,
  x: getX(component),
  y: getY(component),
  w: getWidth(component),
  h: getHeight(component),
})

describe('Layouter examples', () => {
  it('matches the current example output', () => {
    const root = createBox('root', {
      layout: 'flow',
      width: 360,
      height: 200,
      padding: [8],
    })

    add(root, createComponent('title', { width: 200, height: 24 }))
    add(root, createComponent('badge', { width: 60, height: 20, margin: [0, 0, 0, 8] }))
    add(root, createComponent('break', { width: 1, height: 1, breakAfter: true }))
    add(root, createComponent('body', { width: 320, height: 80 }))

    relayoutContainer(root, 0, 0, { width: 360, height: 200 })

    expect(root.components.map(snapshotComponent)).toEqual([
      { id: 'title', x: 8, y: 8, w: 200, h: 24 },
      { id: 'badge', x: 216, y: 8, w: 60, h: 20 },
      { id: 'break', x: 276, y: 8, w: 1, h: 1 },
      { id: 'body', x: 8, y: 32, w: 320, h: 80 },
    ])

    const row = createBox('row', {
      layout: 'horizontalBox',
      width: 300,
      height: 100,
      padding: [4],
      justifyContent: 'spaceBetween',
      alignItems: 'center',
    })

    add(row, createComponent('left', { width: 80, height: 40 }))
    add(row, createComponent('middle', { width: 60, height: 20 }))
    add(row, createComponent('right', { width: 40, height: 60 }))

    relayoutContainer(row, 0, 0, { width: 300, height: 100 })

    expect(row.components.map(snapshotComponent)).toEqual([
      { id: 'left', x: 4, y: 30, w: 80, h: 40 },
      { id: 'middle', x: 140, y: 40, w: 60, h: 20 },
      { id: 'right', x: 256, y: 20, w: 40, h: 60 },
    ])

    const column = createBox('column', {
      layout: 'verticalBox',
      width: 240,
      height: 220,
      padding: [6],
      justifyContent: 'center',
      alignItems: 'spaceBetween',
    })

    const rowA = createBox('rowA', {
      layout: 'horizontalBox',
      width: 200,
      height: 40,
      padding: [2],
      justifyContent: 'left',
      alignItems: 'center',
    })
    add(rowA, createComponent('rowA-left', { width: 60, height: 20 }))
    add(rowA, createComponent('rowA-right', { width: 40, height: 24, margin: [0, 0, 0, 8] }))

    const rowB = createBox('rowB', {
      layout: 'horizontalBox',
      width: 200,
      height: 60,
      padding: [2],
      justifyContent: 'spaceBetween',
      alignItems: 'bottom',
    })
    add(rowB, createComponent('rowB-left', { width: 80, height: 30 }))
    add(rowB, createComponent('rowB-right', { width: 50, height: 40 }))

    add(column, rowA)
    add(column, rowB)

    relayoutContainer(column, 0, 0, { width: 240, height: 220 })

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

    const flowWithAbsolute = createBox('flow-abs', {
      layout: 'flow',
      width: 320,
      height: 160,
      padding: [8],
    })

    add(flowWithAbsolute, createComponent('flow-a', { width: 100, height: 20 }))
    add(flowWithAbsolute, createComponent('flow-abs-1', { width: 60, height: 30, position: 'absolute', top: 10, right: 10 }))
    add(flowWithAbsolute, createComponent('flow-b', { width: 140, height: 24, margin: [0, 0, 0, 6] }))
    add(flowWithAbsolute, createComponent('flow-abs-2', { width: 40, height: 40, position: 'absolute', left: 0.5, bottom: 0 }))

    relayoutContainer(flowWithAbsolute, 0, 0, { width: 320, height: 160 })

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
    const flow = createBox('flow', {
      layout: 'flow',
      width: 200,
      height: 100,
    })

    const first = createComponent('first', { width: 80, height: 10, breakAfter: true })
    expect(first.style.breakAfter).toBe(true)
    add(flow, first)
    add(flow, createComponent('second', { width: 80, height: 20 }))

    relayoutContainer(flow, 0, 0, { width: 200, height: 100 })

    expect(flow.components.map(snapshotComponent)).toEqual([
      { id: 'first', x: 0, y: 0, w: 80, h: 10 },
      { id: 'second', x: 0, y: 10, w: 80, h: 20 },
    ])
  })

  it('wraps to the next row when flow width overflows', () => {
    const flow = createBox('flow', {
      layout: 'flow',
      width: 160,
      height: 100,
      padding: [0],
    })

    add(flow, createComponent('first', { width: 80, height: 10 }))
    add(flow, createComponent('second', { width: 80, height: 10 }))
    add(flow, createComponent('third', { width: 80, height: 10 }))

    relayoutContainer(flow, 0, 0, { width: 160, height: 100 })

    expect(flow.components.map(snapshotComponent)).toEqual([
      { id: 'first', x: 0, y: 0, w: 80, h: 10 },
      { id: 'second', x: 80, y: 0, w: 80, h: 10 },
      { id: 'third', x: 0, y: 10, w: 80, h: 10 },
    ])
  })

  it('supports ratio sizing based on parent verticalItemArrangement', () => {
    const parent = createComponent('parent', {
      width: 200,
      height: 100,
      horizontalItemArrangement: 'ratio',
      verticalItemArrangement: 'ratio',
    })

    applyResize(parent, resize(parent, { width: 200, height: 100 }))

    const child = createComponent('child', { width: 0.5, height: 0.25 })
    applyResize(child, resize(child, parent))

    expect(snapshotComponent(child)).toEqual({
      id: 'child',
      x: undefined,
      y: undefined,
      w: 100,
      h: 25,
    })
  })

  it('positions absolute children using fractional offsets', () => {
    const parent = createComponent('parent', {
      width: 200,
      height: 100,
    })

    applyResize(parent, resize(parent, { width: 200, height: 100 }))
    applyMove(parent, move(parent, 10, 20, { width: 200, height: 100 }))

    const child = createComponent('child', {
      width: 40,
      height: 20,
      position: 'absolute',
      left: 0.5,
      top: 0.5,
    })

    applyResize(child, resize(child, parent))
    applyMove(child, move(child, getX(parent) || 0, getY(parent) || 0, parent))

    expect(snapshotComponent(child)).toEqual({
      id: 'child',
      x: 90,
      y: 60,
      w: 40,
      h: 20,
    })
  })
})
