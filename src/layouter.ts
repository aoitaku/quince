import {
  type Component,
  type SizeMeasurable,
  getAlignItems,
  getBreakAfter,
  getHeight,
  getInnerHeight,
  getInnerWidth,
  getJustifyContent,
  getLayout,
  getLayoutHeight,
  getLayoutWidth,
  getMarginBottom,
  getMarginLeft,
  getMarginRight,
  getMarginTop,
  getPaddingBottom,
  getPaddingLeft,
  getPaddingRight,
  getPaddingTop,
  getPosition,
  getWidth,
  getX,
  getY,
  move,
  resize,
} from './component'
import type { Container } from './container'

export type Layoutable = Component & Container

const chunkBy = <T>(array: T[], predicate: (element: T) => boolean): T[][] =>
  array.reduce((prev, current) => {
    const shouldBreak = predicate(current)
    if (prev.length === 0 || shouldBreak) {
      prev.push([current])
    } else {
      prev[prev.length - 1].push(current)
    }
    return prev
  }, [] as T[][])

const maxBy = <T>(array: T[], selector: (item: T) => number): T | undefined => {
  if (array.length === 0) {
    return undefined
  }
  return array.reduce((best, current) => (selector(current) > selector(best) ? current : best))
}

const last = <T>(array: T[]): T | undefined => array[array.length - 1]

function hasComponents(component: Component): component is Layoutable {
  return 'components' in component && Array.isArray(component.components)
}

function resizeLayoutChild(child: Component, parent: Component) {
  resize(child, parent)
  if (hasComponents(child)) {
    resizeContainer(child, parent)
  }
}

function moveLayoutChild(child: Component, x: number, y: number, parent: Component) {
  move(child, x, y, parent)
  if (hasComponents(child)) {
    moveContainer(child, x, y, parent)
  }
}

function getLayoutX(component: Component) {
  return getX(component) || 0
}

function getLayoutY(component: Component) {
  return getY(component) || 0
}

function getContentWidth(component: Component) {
  return component.contentWidth || 0
}

function getContentHeight(component: Component) {
  return component.contentHeight || 0
}

function testIfComponentsOverflow(component: Component) {
  let horizontalMargin = getPaddingLeft(component)
  let width = 0
  const maxWidth = getContentWidth(component)
  let forceBreak = false
  return (child: Component) => {
    if (getPosition(child) === 'absolute') {
      return false
    }
    const horizontalSpace = Math.max(horizontalMargin, getMarginLeft(child)) + getWidth(child)
    if (forceBreak) {
      forceBreak = getBreakAfter(child)
      width = horizontalSpace
      horizontalMargin = getPaddingLeft(component)
      return true
    } else {
      forceBreak = getBreakAfter(child)
    }
    const expectedWidth = width + getLayoutWidth(child) + getPaddingLeft(component) + getPaddingRight(component)
    if (width > 0 && expectedWidth > maxWidth) {
      width = horizontalSpace
      horizontalMargin = getPaddingLeft(component)
      return true
    } else {
      width += horizontalSpace
      horizontalMargin = getMarginRight(child)
      return false
    }
  }
}

function evaluateRowWidth(component: Component, withExtraCalcuration?: (child: Component, horizontalSpace: number) => number) {
  let horizontalMargin = getPaddingLeft(component)
  return (width: number, child: Component) => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(child)) + width
    if (withExtraCalcuration) {
      horizontalSpace = withExtraCalcuration(child, horizontalSpace)
    }
    if (getPosition(child) === 'absolute') {
      return width
    }
    horizontalMargin = getMarginRight(child)
    return horizontalSpace + getWidth(child)
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
  resize(component, parent)
  resizeContainer(component, parent)
  move(component, ox, oy, parent)
  moveContainer(component, ox, oy, parent)
}

function resizeComponentsForFlowLayout(component: Layoutable, _parent: Component | SizeMeasurable) {
  let verticalMargin = getPaddingTop(component)
  component.contentWidth = component.rawWidth
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  component.contentHeight = chunkBy(component.components, testIfComponentsOverflow(component))
    .filter((row) => row.length > 0)
    .reduce((height: number, row: Component[]) => {
      const child = maxBy(row, (col) => getLayoutHeight(col))!
      if (getPosition(child) === 'absolute') {
        return height
      }
      const verticalSpace = Math.max(verticalMargin, getMarginTop(child)) + height
      verticalMargin = getMarginBottom(child)
      return verticalSpace + getHeight(child)
    }, 0) + Math.max(verticalMargin, getPaddingBottom(component))
}

function moveComponentsForFlowLayout(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  let verticalMargin = getPaddingTop(component)
  return chunkBy(component.components, testIfComponentsOverflow(component))
    .filter((row) => row.length > 0)
    .reduce((height: number, row: Component[]) => {
      const tallestComponent = maxBy(row, (col) => getLayoutHeight(col))!
      const maxComponentHeight = getHeight(tallestComponent)
      const verticalSpace = Math.max(verticalMargin, getMarginTop(tallestComponent)) + height
      verticalMargin = getMarginBottom(tallestComponent)
      const rowLast = last(row)!
      const innerWidth = row.reduce(evaluateRowWidth(component), 0) + Math.max(getMarginRight(rowLast), getPaddingRight(component))
      row.reduce(evaluateRowWidth(component, (child, horizontalSpace) => {
        let x = getLayoutX(component) + horizontalSpace
        switch (getJustifyContent(component)) {
          case 'spaceBetween':
            if (row.length > 1 && !getBreakAfter(rowLast)) {
              horizontalSpace += (getWidth(component) - innerWidth) / (row.length - 1.0)
            }
            break
          case 'center':
            x += (getWidth(component) - innerWidth) / 2.0
            break
          case 'right':
            x += (getWidth(component) - innerWidth)
            break
        }
        let y = getLayoutY(component) + verticalSpace
        switch (getAlignItems(component)) {
          case 'center':
            y += (maxComponentHeight - getHeight(child)) / 2.0
            break
          case 'bottom':
            y += (maxComponentHeight - getHeight(child))
            break
        }
        if (getPosition(child) === 'absolute') {
          moveLayoutChild(child, getLayoutX(component), getLayoutY(component), component)
        } else {
          moveLayoutChild(child, x, y, component)
        }
        return horizontalSpace
      }), 0)
      return verticalSpace + maxComponentHeight
    }, 0)
}

function resizeComponentsForVerticalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  let verticalMargin = getPaddingTop(component)
  component.contentHeight = component.components.reduce((height: number, child: Component) => {
    const verticalSpace = Math.max(verticalMargin, getMarginTop(child)) + height
    resizeLayoutChild(child, component)
    if (getPosition(child) === 'absolute') {
      return height
    }
    verticalMargin = getMarginBottom(child)
    return verticalSpace + getHeight(child)
  }, 0) + Math.max(verticalMargin, getPaddingBottom(component))
  const widestComponent = maxBy(component.components, (child) => getLayoutWidth(child))
  if (widestComponent) {
    component.contentWidth = getWidth(widestComponent) +
      Math.max(getMarginLeft(widestComponent), getPaddingLeft(component)) +
      Math.max(getMarginRight(widestComponent), getPaddingRight(component))
  }
}

function moveComponentsForVerticalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  let verticalMargin = getPaddingTop(component)
  component.components.reduce((height: number, child: Component) => {
    const horizontalSpace = Math.max(getPaddingLeft(component), getMarginLeft(child))
    let verticalSpace = Math.max(verticalMargin, getMarginTop(child)) + height
    let x = getLayoutX(component) + horizontalSpace
    switch (getJustifyContent(component)) {
      case 'center':
        x += (getInnerWidth(child, component) - getWidth(child)) / 2
        break
      case 'right':
        x += (getInnerWidth(child, component) - getWidth(child))
        break
    }
    let y = getLayoutY(component) + verticalSpace
    switch (getAlignItems(component)) {
      case 'spaceBetween':
        if (component.rawHeight && component.components.length > 1) {
          verticalSpace += (component.rawHeight - getContentHeight(component)) / (component.components.length - 1)
        }
        break
      case 'center':
        y += (component.rawHeight ? (component.rawHeight - getContentHeight(component)) / 2 : 0)
        break
      case 'bottom':
        y += (component.rawHeight ? component.rawHeight - getContentHeight(component) : 0)
        break
    }
    if (getPosition(child) === 'absolute') {
      moveLayoutChild(child, getLayoutX(component), getLayoutY(component), component)
    } else {
      moveLayoutChild(child, x, y, component)
    }
    if (getPosition(child) === 'absolute') {
      return height
    }
    verticalMargin = getMarginBottom(child)
    return verticalSpace + getHeight(child)
  }, 0)
}

function resizeComponentsForHorizontalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  let horizontalMargin = getPaddingLeft(component)
  component.contentWidth = component.components.reduce((width: number, child: Component) => {
    resizeLayoutChild(child, component)
    if (getPosition(child) === 'absolute') {
      return width
    }
    const horizontalSpace = Math.max(horizontalMargin, getMarginLeft(child)) + width
    horizontalMargin = getMarginRight(child)
    return horizontalSpace + getWidth(child)
  }, 0) + Math.max(horizontalMargin, getPaddingRight(component))
  const tallestComponent = maxBy(component.components, (child: Component) => getLayoutHeight(child))
  if (tallestComponent) {
    component.contentHeight = getHeight(tallestComponent) +
      Math.max(getMarginTop(tallestComponent), getPaddingTop(component)) +
      Math.max(getMarginBottom(tallestComponent), getPaddingBottom(component))
  }
}

function moveComponentsForHorizontalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  let horizontalMargin = getPaddingLeft(component)
  component.components.reduce((width: number, child: Component) => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(child)) + width
    const verticalSpace = Math.max(getPaddingTop(component), getMarginTop(component))
    let x = getLayoutX(component) + horizontalSpace
    switch (getJustifyContent(component)) {
      case 'spaceBetween':
        if (component.rawWidth && component.components.length > 1) {
          horizontalSpace += (component.rawWidth - getContentWidth(component)) / (component.components.length - 1)
        }
        break
      case 'center':
        x += (component.rawWidth ? (component.rawWidth - getContentWidth(component)) / 2 : 0)
        break
      case 'right':
        x += (component.rawWidth ? component.rawWidth - getContentWidth(component) : 0)
        break
    }
    let y = getLayoutY(component) + verticalSpace
    switch (getAlignItems(component)) {
      case 'center':
        y += (getInnerHeight(child, component) - getHeight(child)) / 2
        break
      case 'bottom':
        y += getInnerHeight(child, component) - getHeight(child)
        break
    }
    if (getPosition(component) === 'absolute') {
      moveLayoutChild(child, getLayoutX(component), getLayoutY(component), component)
    } else {
      moveLayoutChild(child, x, y, component)
    }
    if (getPosition(component) === 'absolute') {
      return width
    }
    horizontalMargin = getMarginRight(child)
    return horizontalSpace + getWidth(child)
  }, 0)
}
