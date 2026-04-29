import {
  addComponent,
  createComponent,
  createContainer,
  getHeight,
  getWidth,
  getX,
  getY,
  relayoutContainer,
  type Component,
  type StyleProperties,
} from '../src'
import type { Layoutable } from '../src/layouter'

function createBox(id: string, style?: StyleProperties): Layoutable {
  return {
    ...createComponent(id, style),
    ...createContainer(),
  }
}

const printLayout = (label: string, components: Component[]) => {
  console.log(label)
  components.forEach((component) => {
    console.log(
      `${component.id}: x=${getX(component)}, y=${getY(component)}, w=${getWidth(component)}, h=${getHeight(component)}`,
    )
  })
}

const root = createBox('root', {
  layout: 'flow',
  width: 360,
  height: 200,
  padding: [8],
})

addComponent(root, createComponent('title', { width: 200, height: 24 }))
addComponent(root, createComponent('badge', { width: 60, height: 20, margin: [0, 0, 0, 8] }))
addComponent(root, createComponent('break', { width: 1, height: 1, breakAfter: true }))
addComponent(root, createComponent('body', { width: 320, height: 80 }))

relayoutContainer(root, 0, 0, { width: 360, height: 200 })
printLayout('flow layout', root.components)

const row = createBox('row', {
  layout: 'horizontalBox',
  width: 300,
  height: 100,
  padding: [4],
  justifyContent: 'spaceBetween',
  alignItems: 'center',
})

addComponent(row, createComponent('left', { width: 80, height: 40 }))
addComponent(row, createComponent('middle', { width: 60, height: 20 }))
addComponent(row, createComponent('right', { width: 40, height: 60 }))

relayoutContainer(row, 0, 0, { width: 300, height: 100 })
printLayout('horizontalBox layout', row.components)

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
addComponent(rowA, createComponent('rowA-left', { width: 60, height: 20 }))
addComponent(rowA, createComponent('rowA-right', { width: 40, height: 24, margin: [0, 0, 0, 8] }))

const rowB = createBox('rowB', {
  layout: 'horizontalBox',
  width: 200,
  height: 60,
  padding: [2],
  justifyContent: 'spaceBetween',
  alignItems: 'bottom',
})
addComponent(rowB, createComponent('rowB-left', { width: 80, height: 30 }))
addComponent(rowB, createComponent('rowB-right', { width: 50, height: 40 }))

addComponent(column, rowA)
addComponent(column, rowB)

relayoutContainer(column, 0, 0, { width: 240, height: 220 })
printLayout('verticalBox with horizontal rows', [column, ...column.components, ...rowA.components, ...rowB.components])

const flowWithAbsolute = createBox('flow-abs', {
  layout: 'flow',
  width: 320,
  height: 160,
  padding: [8],
})

addComponent(flowWithAbsolute, createComponent('flow-a', { width: 100, height: 20 }))
addComponent(flowWithAbsolute, createComponent('flow-abs-1', { width: 60, height: 30, position: 'absolute', top: 10, right: 10 }))
addComponent(flowWithAbsolute, createComponent('flow-b', { width: 140, height: 24, margin: [0, 0, 0, 6] }))
addComponent(flowWithAbsolute, createComponent('flow-abs-2', { width: 40, height: 40, position: 'absolute', left: 0.5, bottom: 0 }))

relayoutContainer(flowWithAbsolute, 0, 0, { width: 320, height: 160 })
printLayout('flow with absolute children', flowWithAbsolute.components)
