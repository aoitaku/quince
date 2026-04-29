import { describe, expect, it } from 'vitest'
import { applyMove, applyResize, createComponent, move, resize } from './component'
import { arrangeHorizontalBoxSequence, measureHorizontalBoxSequence } from './sequence'

describe('sequence arrange API', () => {
  it('arranges one sibling sequence and returns patches in the same order', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))
    parent.contentWidth = 30
    parent.contentHeight = 10
    applyMove(parent, move(parent, 5, 7, { width: 100, height: 40 }))

    const left = createComponent('left', { width: 10, height: 10 })
    const right = createComponent('right', { width: 20, height: 10 })
    applyResize(left, resize(left, parent))
    applyResize(right, resize(right, parent))

    expect(arrangeHorizontalBoxSequence([left, right], parent)).toEqual([
      { id: 'left', x: 5, y: 7 },
      { id: 'right', x: 15, y: 7 },
    ])
  })

  it('uses component move rules when returning arrange patches', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))
    parent.contentWidth = 10
    parent.contentHeight = 10
    applyMove(parent, move(parent, 5, 7, { width: 100, height: 40 }))

    const child = createComponent('child', { width: 10, height: 10, left: 3, top: 2 })
    applyResize(child, resize(child, parent))

    expect(arrangeHorizontalBoxSequence([child], parent)).toEqual([
      { id: 'child', x: 8, y: 9 },
    ])
  })
})

describe('sequence measure API', () => {
  it('measures one sibling sequence and returns a parent content patch', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
      padding: [2],
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))

    const left = createComponent('left', { width: 10, height: 10 })
    const right = createComponent('right', { width: 20, height: 15, margin: [0, 3, 0, 4] })
    applyResize(left, resize(left, parent))
    applyResize(right, resize(right, parent))

    expect(measureHorizontalBoxSequence([left, right], parent)).toEqual({
      id: 'parent',
      contentWidth: 39,
      contentHeight: 19,
    })
  })
})
