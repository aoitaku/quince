import { describe, expect, it } from 'vitest'
import { applyMove, applyResize, createComponent, getHeight, getWidth, move, resize } from './component'
import { arrangeHorizontalBoxSequence, arrangeVerticalBoxSequence, measureHorizontalBoxSequence } from './sequence'

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

describe('horizontalBox absolute children', () => {
  it('places absolute children at the parent origin and skips advancing the cursor', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
      padding: [4],
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))
    parent.contentWidth = 30
    parent.contentHeight = 10
    applyMove(parent, move(parent, 5, 7, { width: 100, height: 40 }))

    const left = createComponent('left', { width: 10, height: 10 })
    const abs = createComponent('abs', {
      width: 20,
      height: 10,
      position: 'absolute',
      left: 3,
      top: 2,
    })
    const right = createComponent('right', { width: 10, height: 10 })
    applyResize(left, resize(left, parent))
    applyResize(abs, resize(abs, parent))
    applyResize(right, resize(right, parent))

    expect(arrangeHorizontalBoxSequence([left, abs, right], parent)).toEqual([
      { id: 'left', x: 9, y: 11 },
      { id: 'abs', x: 8, y: 9 },
      { id: 'right', x: 19, y: 11 },
    ])
  })
})

describe('horizontalBox per-component vertical offset', () => {
  it('uses each component top margin for verticalSpace, not the parent', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))
    applyMove(parent, move(parent, 0, 0, { width: 100, height: 40 }))

    const a = createComponent('a', { width: 10, height: 10, margin: [3, 0, 0, 0] })
    const b = createComponent('b', { width: 10, height: 10, margin: [7, 0, 0, 0] })
    applyResize(a, resize(a, parent))
    applyResize(b, resize(b, parent))

    expect(arrangeHorizontalBoxSequence([a, b], parent)).toEqual([
      { id: 'a', x: 0, y: 3 },
      { id: 'b', x: 10, y: 7 },
    ])
  })
})

describe('verticalBox asymmetric horizontal padding', () => {
  it('centers children using both left and right offsets', () => {
    const parent = createComponent('parent', {
      layout: 'verticalBox',
      width: 100,
      height: 60,
      padding: [0, 30, 0, 10],
      justifyContent: 'center',
    })
    applyResize(parent, resize(parent, { width: 100, height: 60 }))
    applyMove(parent, move(parent, 0, 0, { width: 100, height: 60 }))

    const child = createComponent('child', { width: 20, height: 10 })
    applyResize(child, resize(child, parent))

    expect(arrangeVerticalBoxSequence([child], parent)).toEqual([
      { id: 'child', x: 10 + (100 - 10 - 30 - 20) / 2, y: 0 },
    ])
  })

  it('right-aligns children using right offset', () => {
    const parent = createComponent('parent', {
      layout: 'verticalBox',
      width: 100,
      height: 60,
      padding: [0, 30, 0, 10],
      justifyContent: 'right',
    })
    applyResize(parent, resize(parent, { width: 100, height: 60 }))
    applyMove(parent, move(parent, 0, 0, { width: 100, height: 60 }))

    const child = createComponent('child', { width: 20, height: 10 })
    applyResize(child, resize(child, parent))

    expect(arrangeVerticalBoxSequence([child], parent)).toEqual([
      { id: 'child', x: 100 - 30 - 20, y: 0 },
    ])
  })
})

describe('width: full with asymmetric horizontal padding', () => {
  it('subtracts both paddingLeft and paddingRight from the inner width', () => {
    const parent = createComponent('parent', {
      width: 100,
      height: 40,
      padding: [0, 30, 0, 10],
    })
    applyResize(parent, resize(parent, { width: 100, height: 40 }))

    const child = createComponent('child', { width: 'full', height: 10 })
    applyResize(child, resize(child, parent))

    expect(getWidth(child)).toBe(60)
    expect(getHeight(child)).toBe(10)
  })
})
