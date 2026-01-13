import { Component, Container, Layouter, StyleProperties, SizeMeasurable } from '../src'

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

const printLayout = (label: string, components: Component[]) => {
  console.log(label)
  components.forEach((component) => {
    console.log(
      `${component.id}: x=${component.x}, y=${component.y}, w=${component.width}, h=${component.height}`,
    )
  })
}

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
printLayout('flow layout', root.components)

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
printLayout('horizontalBox layout', row.components)

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
printLayout('verticalBox with horizontal rows', [column, ...column.components, ...rowA.components, ...rowB.components])

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
printLayout('flow with absolute children', flowWithAbsolute.components)
