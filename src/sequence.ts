import {
  type Component,
  getAlignItems,
  getBreakAfter,
  getBottom,
  getHeight,
  getJustifyContent,
  getLayoutHeight,
  getLayoutWidth,
  getLeft,
  getMarginBottom,
  getMarginLeft,
  getMarginRight,
  getMarginTop,
  getPaddingBottom,
  getPaddingLeft,
  getPaddingRight,
  getPaddingTop,
  getPosition,
  getRight,
  getTop,
  getWidth,
  getX,
  getY,
} from './component'

export type ArrangePatch = {
  id: string
  x: number
  y: number
}

const maxBy = <T>(array: T[], selector: (item: T) => number): T | undefined => {
  if (array.length === 0) {
    return undefined
  }
  return array.reduce((best, current) => (selector(current) > selector(best) ? current : best))
}

const last = <T>(array: T[]): T | undefined => array[array.length - 1]

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

function getOriginX(component: Component) {
  return getX(component) || 0
}

function getOriginY(component: Component) {
  return getY(component) || 0
}

function getContentWidth(component: Component) {
  return component.contentWidth || 0
}

function getContentHeight(component: Component) {
  return component.contentHeight || 0
}

function moveX(component: Component, toX: number, parent: Component) {
  if (getPosition(component) === 'absolute') {
    if (getLeft(component) && typeof getLeft(component) === 'number') {
      return Number.isInteger(getLeft(component))
        ? toX + getLeft(component)
        : toX + (getWidth(parent) - getWidth(component)) * getLeft(component)
    }
    if (getRight(component) && typeof getRight(component) === 'number') {
      return Number.isInteger(getRight(component))
        ? toX + getWidth(parent) - getWidth(component) - getRight(component)
        : toX + (getWidth(parent) - getWidth(component)) * (1 - getRight(component))
    }
    return toX
  }

  if (getLeft(component) && typeof getLeft(component) === 'number') {
    return Number.isInteger(getLeft(component))
      ? toX + getLeft(component)
      : toX + getWidth(component) * getLeft(component)
  }
  if (getRight(component) && typeof getRight(component) === 'number') {
    return Number.isInteger(getRight(component))
      ? toX - getRight(component)
      : toX - getWidth(component) * getRight(component)
  }
  return toX
}

function moveY(component: Component, toY: number, parent: Component) {
  if (getPosition(component) === 'absolute') {
    if (getTop(component) && typeof getTop(component) === 'number') {
      return Number.isInteger(getTop(component))
        ? toY + getTop(component)
        : toY + (getHeight(parent) - getHeight(component)) * getTop(component)
    }
    if (getBottom(component) && typeof getBottom(component) === 'number') {
      return Number.isInteger(getBottom(component))
        ? toY + getHeight(parent) - getHeight(component) - getBottom(component)
        : toY + (getHeight(parent) - getHeight(component)) * (1 - getBottom(component))
    }
    return toY
  }

  if (getTop(component) && typeof getTop(component) === 'number') {
    return Number.isInteger(getTop(component))
      ? toY + getTop(component)
      : toY + getHeight(component) * getTop(component)
  }
  if (getBottom(component) && typeof getBottom(component) === 'number') {
    return Number.isInteger(getBottom(component))
      ? toY - getBottom(component)
      : toY - getHeight(component) * getBottom(component)
  }
  return toY
}

function placeComponent(component: Component, x: number, y: number, parent: Component): ArrangePatch {
  return {
    id: component.id,
    x: moveX(component, x, parent),
    y: moveY(component, y, parent),
  }
}

function testIfComponentsOverflow(parent: Component) {
  let horizontalMargin = getPaddingLeft(parent)
  let width = 0
  const maxWidth = getContentWidth(parent)
  let forceBreak = false
  return (component: Component) => {
    if (getPosition(component) === 'absolute') {
      return false
    }
    const horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + getWidth(component)
    if (forceBreak) {
      forceBreak = getBreakAfter(component)
      width = horizontalSpace
      horizontalMargin = getPaddingLeft(parent)
      return true
    } else {
      forceBreak = getBreakAfter(component)
    }
    const expectedWidth = width + getLayoutWidth(component) + getPaddingLeft(parent) + getPaddingRight(parent)
    if (width > 0 && expectedWidth > maxWidth) {
      width = horizontalSpace
      horizontalMargin = getPaddingLeft(parent)
      return true
    } else {
      width += horizontalSpace
      horizontalMargin = getMarginRight(component)
      return false
    }
  }
}

function evaluateRowWidth(parent: Component, withExtraCalculation?: (component: Component, horizontalSpace: number) => number) {
  let horizontalMargin = getPaddingLeft(parent)
  return (width: number, component: Component) => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + width
    if (withExtraCalculation) {
      horizontalSpace = withExtraCalculation(component, horizontalSpace)
    }
    if (getPosition(component) === 'absolute') {
      return width
    }
    horizontalMargin = getMarginRight(component)
    return horizontalSpace + getWidth(component)
  }
}

export function arrangeFlowSequence(parent: Component, components: Component[]): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let verticalMargin = getPaddingTop(parent)

  chunkBy(components, testIfComponentsOverflow(parent))
    .filter((row) => row.length > 0)
    .reduce((height: number, row: Component[]) => {
      const tallestComponent = maxBy(row, (col) => getLayoutHeight(col))!
      const maxComponentHeight = getHeight(tallestComponent)
      const verticalSpace = Math.max(verticalMargin, getMarginTop(tallestComponent)) + height
      verticalMargin = getMarginBottom(tallestComponent)
      const rowLast = last(row)!
      const innerWidth = row.reduce(evaluateRowWidth(parent), 0) + Math.max(getMarginRight(rowLast), getPaddingRight(parent))
      row.reduce(evaluateRowWidth(parent, (component, horizontalSpace) => {
        let x = getOriginX(parent) + horizontalSpace
        switch (getJustifyContent(parent)) {
          case 'spaceBetween':
            if (row.length > 1 && !getBreakAfter(rowLast)) {
              horizontalSpace += (getWidth(parent) - innerWidth) / (row.length - 1.0)
            }
            break
          case 'center':
            x += (getWidth(parent) - innerWidth) / 2.0
            break
          case 'right':
            x += (getWidth(parent) - innerWidth)
            break
        }
        let y = getOriginY(parent) + verticalSpace
        switch (getAlignItems(parent)) {
          case 'center':
            y += (maxComponentHeight - getHeight(component)) / 2.0
            break
          case 'bottom':
            y += (maxComponentHeight - getHeight(component))
            break
        }
        patches.push(getPosition(component) === 'absolute'
          ? placeComponent(component, getOriginX(parent), getOriginY(parent), parent)
          : placeComponent(component, x, y, parent))
        return horizontalSpace
      }), 0)
      return verticalSpace + maxComponentHeight
    }, 0)

  return patches
}

export function arrangeVerticalBoxSequence(parent: Component, components: Component[]): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let verticalMargin = getPaddingTop(parent)

  components.reduce((height: number, component: Component) => {
    const horizontalSpace = Math.max(getPaddingLeft(parent), getMarginLeft(component))
    let verticalSpace = Math.max(verticalMargin, getMarginTop(component)) + height
    let x = getOriginX(parent) + horizontalSpace
    switch (getJustifyContent(parent)) {
      case 'center':
        x += (getWidth(parent) - horizontalSpace - horizontalSpace - getWidth(component)) / 2
        break
      case 'right':
        x += getWidth(parent) - horizontalSpace - horizontalSpace - getWidth(component)
        break
    }
    let y = getOriginY(parent) + verticalSpace
    switch (getAlignItems(parent)) {
      case 'spaceBetween':
        if (parent.rawHeight && components.length > 1) {
          verticalSpace += (parent.rawHeight - getContentHeight(parent)) / (components.length - 1)
        }
        break
      case 'center':
        y += parent.rawHeight ? (parent.rawHeight - getContentHeight(parent)) / 2 : 0
        break
      case 'bottom':
        y += parent.rawHeight ? parent.rawHeight - getContentHeight(parent) : 0
        break
    }
    patches.push(getPosition(component) === 'absolute'
      ? placeComponent(component, getOriginX(parent), getOriginY(parent), parent)
      : placeComponent(component, x, y, parent))
    if (getPosition(component) === 'absolute') {
      return height
    }
    verticalMargin = getMarginBottom(component)
    return verticalSpace + getHeight(component)
  }, 0)

  return patches
}

export function arrangeHorizontalBoxSequence(parent: Component, components: Component[]): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let horizontalMargin = getPaddingLeft(parent)

  components.reduce((width: number, component: Component) => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + width
    const verticalSpace = Math.max(getPaddingTop(parent), getMarginTop(parent))
    let x = getOriginX(parent) + horizontalSpace
    switch (getJustifyContent(parent)) {
      case 'spaceBetween':
        if (parent.rawWidth && components.length > 1) {
          horizontalSpace += (parent.rawWidth - getContentWidth(parent)) / (components.length - 1)
        }
        break
      case 'center':
        x += parent.rawWidth ? (parent.rawWidth - getContentWidth(parent)) / 2 : 0
        break
      case 'right':
        x += parent.rawWidth ? parent.rawWidth - getContentWidth(parent) : 0
        break
    }
    let y = getOriginY(parent) + verticalSpace
    switch (getAlignItems(parent)) {
      case 'center':
        y += (getHeight(parent) - Math.max(getPaddingTop(parent), getMarginTop(component)) - Math.max(getPaddingBottom(parent), getMarginBottom(component)) - getHeight(component)) / 2
        break
      case 'bottom':
        y += getHeight(parent) - Math.max(getPaddingTop(parent), getMarginTop(component)) - Math.max(getPaddingBottom(parent), getMarginBottom(component)) - getHeight(component)
        break
    }
    patches.push(getPosition(parent) === 'absolute'
      ? placeComponent(component, getOriginX(parent), getOriginY(parent), parent)
      : placeComponent(component, x, y, parent))
    if (getPosition(parent) === 'absolute') {
      return width
    }
    horizontalMargin = getMarginRight(component)
    return horizontalSpace + getWidth(component)
  }, 0)

  return patches
}
