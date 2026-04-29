import { describe, expect, it } from 'vitest'
import { createComponent, move, resize } from './component'
import { arrangeHorizontalBoxSequence } from './sequence'

describe('sequence arrange API', () => {
  it('arranges one sibling sequence and returns patches in the same order', () => {
    const parent = createComponent('parent', {
      layout: 'horizontalBox',
      width: 100,
      height: 40,
    })
    resize(parent, { width: 100, height: 40 })
    parent.contentWidth = 30
    parent.contentHeight = 10
    move(parent, 5, 7, { width: 100, height: 40 })

    const left = createComponent('left', { width: 10, height: 10 })
    const right = createComponent('right', { width: 20, height: 10 })
    resize(left, parent)
    resize(right, parent)

    expect(arrangeHorizontalBoxSequence(parent, [left, right])).toEqual([
      { id: 'left', x: 5, y: 7 },
      { id: 'right', x: 15, y: 7 },
    ])
  })
})
