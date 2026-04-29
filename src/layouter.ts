import {
  type Component,
  type SizeMeasurable,
  applyMove,
  applyResize,
  getLayout,
  move,
  resize,
} from './component'
import type { Container } from './container'
import {
  arrangeFlowSequence,
  arrangeHorizontalBoxSequence,
  arrangeVerticalBoxSequence,
  type ArrangePatch,
  measureFlowSequence,
  measureHorizontalBoxSequence,
  measureVerticalBoxSequence,
  type MeasurePatch,
} from './sequence'

export type Layoutable = Component & Container

function hasComponents(component: Component): component is Layoutable {
  return 'components' in component && Array.isArray(component.components)
}

function resizeLayoutChild(child: Component, parent: Component) {
  applyResize(child, resize(child, parent))
  if (hasComponents(child)) {
    resizeContainer(child, parent)
  }
}

function applyArrangePatches(component: Layoutable, patches: ArrangePatch[]) {
  component.components.forEach((child, index) => {
    const patch = patches[index]
    applyMove(child, patch)
    if (hasComponents(child)) {
      moveContainer(child, patch.x, patch.y, component)
    }
  })
}

function applyMeasurePatch(component: Layoutable, patch: MeasurePatch) {
  if (patch.contentWidth !== undefined) {
    component.contentWidth = patch.contentWidth
  }
  if (patch.contentHeight !== undefined) {
    component.contentHeight = patch.contentHeight
  }
}

export function resizeContainer(component: Layoutable, parent: Component | SizeMeasurable) {
  switch (getLayout(component)) {
    case 'flow':
      resizeComponentsForFlowLayout(component, parent)
      break
    case 'horizontalBox':
      resizeComponentsForHorizontalBox(component, parent)
      break
    case 'verticalBox':
      resizeComponentsForVerticalBox(component, parent)
      break
    default:
      break
  }
}

export function moveContainer(component: Layoutable, ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
  switch (getLayout(component)) {
    case 'flow':
      moveComponentsForFlowLayout(component, ox, oy, parent)
      break
    case 'horizontalBox':
      moveComponentsForHorizontalBox(component, ox, oy, parent)
      break
    case 'verticalBox':
      moveComponentsForVerticalBox(component, ox, oy, parent)
      break
    default:
      break
  }
}

export function relayoutContainer(component: Layoutable, ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
  applyResize(component, resize(component, parent))
  resizeContainer(component, parent)
  applyMove(component, move(component, ox, oy, parent))
  moveContainer(component, ox, oy, parent)
}

function resizeComponentsForFlowLayout(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureFlowSequence(component.components, component))
}

function moveComponentsForFlowLayout(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeFlowSequence(component.components, component))
}

function resizeComponentsForVerticalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureVerticalBoxSequence(component.components, component))
}

function moveComponentsForVerticalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeVerticalBoxSequence(component.components, component))
}

function resizeComponentsForHorizontalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureHorizontalBoxSequence(component.components, component))
}

function moveComponentsForHorizontalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeHorizontalBoxSequence(component.components, component))
}
