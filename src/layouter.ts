import { Component, SizeMeasurable } from './component'
import { Container } from './container'

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

export interface Layoutable {
  layouter: Layouter
  resize(parent: SizeMeasurable): void
  move(ox: number, oy: number, parent: SizeMeasurable): void
}

export class Layouter {
  public resize(component: Component & Container, parent: SizeMeasurable) {
    switch (component.layout) {
      case 'flow':
        this.resizeComponentsForFlowLayout(component, parent)
        break
      case 'horizontalBox':
        this.resizeComponentsForHorizontalBox(component, parent)
        break
      case 'verticalBox':
        this.resizeComponentsForVerticalBox(component, parent)
        break
      default:
        break
    }
  }

  public move(component: Component & Container, ox: number = 0, oy: number = 0, parent: SizeMeasurable) {
    switch (component.layout) {
      case 'flow':
        this.moveComponentsForFlowLayout(component, ox, oy, parent)
        break
      case 'horizontalBox':
        this.moveComponentsForHorizontalBox(component, ox, oy, parent)
        break
      case 'verticalBox':
        this.moveComponentsForVerticalBox(component, ox, oy, parent)
        break
      default:
        break
    }
  }

  private testIfComponentsOverflow(component: Component) {
    let horizontalMargin = component.paddingLeft
    let width = 0
    const maxWidth = component.contentWidth
    let forceBreak = false
    return (child: Component) => {
      if (child.position === 'absolute') {
        return false
      }
      const horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + child.width
      if (forceBreak) {
        forceBreak = child.breakAfter
        width = horizontalSpace
        horizontalMargin = component.paddingLeft
        return true
      } else {
        forceBreak = child.breakAfter
      }
      const expectedWidth = width + child.layoutWidth + component.paddingLeft + component.paddingRight
      if (width > 0 && expectedWidth > maxWidth) {
        width = horizontalSpace
        horizontalMargin = component.paddingLeft
        return true
      } else {
        width += horizontalSpace
        horizontalMargin = child.marginRight
        return false
      }
    }
  }

  private evaluateRowWidth(component: Component, withExtraCalcuration?: (child: Component, horizontalSpace: number) => number) {
    let horizontalMargin = component.paddingLeft
    return (width: number, child: Component) => {
      let horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width
      if (withExtraCalcuration) {
        horizontalSpace = withExtraCalcuration(child, horizontalSpace)
      }
      if (child.position === 'absolute') {
        return width
      }
      horizontalMargin = child.marginRight
      return horizontalSpace + child.width
    }
  }

  private resizeComponentsForFlowLayout(component: Component & Container, _parent: SizeMeasurable) {
    let verticalMargin = component.paddingTop
    component.contentWidth = component.rawWidth
    component.components.forEach((child) => {
      child.resize(component)
    })
    component.contentHeight = chunkBy(component.components, this.testIfComponentsOverflow(component))
      .filter((row) => row.length > 0)
      .reduce((height: number, row: Component[]) => {
      const child = maxBy(row, (col) => col.layoutHeight)!
      if (child.position === 'absolute') {
        return height
      }
      const verticalSpace = Math.max(verticalMargin, child.marginTop) + height
      verticalMargin = child.marginBottom
      return verticalSpace + child.height
    }, 0) + Math.max(verticalMargin, component.paddingBottom)
  }

  private moveComponentsForFlowLayout(
    component: Component & Container,
    _ox: number = 0,
    _oy: number = 0,
    _parent: SizeMeasurable,
  ) {
    let verticalMargin = component.paddingTop
    return chunkBy(component.components, this.testIfComponentsOverflow(component))
      .filter((row) => row.length > 0)
      .reduce((height: number, row: Component[]) => {
      const tallestComponent = maxBy(row, (col) => col.layoutHeight)!
      const maxComponentHeight = tallestComponent.height
      const verticalSpace = Math.max(verticalMargin, tallestComponent.marginTop) + height
      verticalMargin = tallestComponent.marginBottom
      const innerWidth = row.reduce(this.evaluateRowWidth(component), 0) + Math.max(last(row)!.marginRight, component.paddingRight)
      row.reduce(this.evaluateRowWidth(component, (child, horizontalSpace) => {
        let x = component.x + horizontalSpace
        switch (component.justifyContent) {
          case 'spaceBetween':
            if (row.length > 1 && !last(row)!.breakAfter) {
              horizontalSpace += (component.width - innerWidth) / (row.length - 1.0)
            }
            break
          case 'center':
            x += (component.width - innerWidth) / 2.0
            break
          case 'right':
            x += (component.width - innerWidth)
            break
        }
        let y = component.y + verticalSpace
        switch (component.alignItems) {
          case 'center':
            y += (maxComponentHeight - child.height) / 2.0
            break
          case 'bottom':
            y += (maxComponentHeight - child.height)
            break
        }
        if (child.position === 'absolute') {
          child.move(component.x, component.y, component)
        } else {
          child.move(x, y, component)
        }
        return horizontalSpace
      }), 0)
      return verticalSpace + maxComponentHeight
    }, 0)
  }

  private resizeComponentsForVerticalBox(component: Component & Container, _parent: SizeMeasurable) {
    let verticalMargin = component.paddingTop
    component.contentHeight = component.components.reduce((height: number, child: Component) => {
      const verticalSpace = Math.max(verticalMargin, child.marginTop) + height
      child.resize(component)
      if (child.position === 'absolute') {
        return height
      }
      verticalMargin = child.marginBottom
      return verticalSpace + child.height
    }, 0) + Math.max(verticalMargin, component.paddingBottom)
    const widestComponent = maxBy(component.components, (child) => child.layoutWidth)
    if (widestComponent) {
      component.contentWidth = widestComponent.width +
        Math.max(widestComponent.marginLeft, component.paddingLeft) +
        Math.max(widestComponent.marginRight, component.paddingRight)
    }
  }

  private moveComponentsForVerticalBox(
    component: Component & Container,
    _ox: number = 0,
    _oy: number = 0,
    _parent: SizeMeasurable,
  ) {
    let verticalMargin = component.paddingTop
    component.components.reduce((height: number, child: Component) => {
      const horizontalSpace = Math.max(component.paddingLeft, child.marginLeft)
      let verticalSpace = Math.max(verticalMargin, child.marginTop) + height
      let x = component.x + horizontalSpace
      switch (component.justifyContent) {
        case 'center':
          x += (child.innerWidth(component) - child.width) / 2
          break
        case 'right':
          x += (child.innerWidth(component) - child.width)
          break
      }
      let y = component.y + verticalSpace
      switch (component.alignItems) {
        case 'spaceBetween':
          if (component.rawHeight && component.components.length > 1) {
            verticalSpace += (component.rawHeight - component.contentHeight) / (component.components.length - 1)
          }
          break
        case 'center':
          y += (component.rawHeight ? (component.rawHeight - component.contentHeight) / 2 : 0)
          break
        case 'bottom':
          y += (component.rawHeight ? component.rawHeight - component.contentHeight : 0)
          break
      }
      if (child.position === 'absolute') {
        child.move(component.x, component.y, component)
      } else {
        child.move(x, y, component)
      }
      if (child.position === 'absolute') {
        return height
      }
      verticalMargin = child.marginBottom
      return verticalSpace + child.height
    }, 0)
  }

  private resizeComponentsForHorizontalBox(component: Component & Container, _parent: SizeMeasurable) {
    let horizontalMargin = component.paddingLeft
    component.contentWidth = component.components.reduce((width: number, child: Component) => {
      child.resize(component)
      if (child.position === 'absolute') {
        return width
      }
      const horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width
      horizontalMargin = child.marginRight
      return horizontalSpace + child.width
    }, 0) + Math.max(horizontalMargin, component.paddingRight)
    const tallestComponent = maxBy(component.components, (child: Component) => child.layoutHeight)
    if (tallestComponent) {
      component.contentHeight = tallestComponent.height +
        Math.max(tallestComponent.marginTop, component.paddingTop) +
        Math.max(tallestComponent.marginBottom, component.paddingBottom)
    }
  }

  private moveComponentsForHorizontalBox(
    component: Component & Container,
    _ox: number = 0,
    _oy: number = 0,
    _parent: SizeMeasurable,
  ) {
    let horizontalMargin = component.paddingLeft
    component.components.reduce((width: number, child: Component) => {
      let horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width
      const verticalSpace = Math.max(component.paddingTop, component.marginTop)
      let x = component.x + horizontalSpace
      switch (component.justifyContent) {
        case 'spaceBetween':
          if (component.rawWidth && component.components.length > 1) {
            horizontalSpace += (component.rawWidth - component.contentWidth) / (component.components.length - 1)
          }
          break
        case 'center':
          x += (component.rawWidth ? (component.rawWidth - component.contentWidth) / 2 : 0)
          break
        case 'right':
          x += (component.rawWidth ? component.rawWidth - component.contentWidth : 0)
          break
      }
      let y = component.y + verticalSpace
      switch (component.alignItems) {
        case 'center':
          y += (child.innerHeight(component) - child.height) / 2
          break
        case 'bottom':
          y += child.innerHeight(component) - child.height
          break
      }
      if (component.position === 'absolute') {
        child.move(component.x, component.y, component)
      } else {
        child.move(x, y, component)
      }
      if (component.position === 'absolute') {
        return width
      }
      horizontalMargin = child.marginRight
      return horizontalSpace + child.width
    }, 0)
  }
}
