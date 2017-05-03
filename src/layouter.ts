/// <reference path='../typings/index.d.ts' />
import _ from 'lodash'
import Component, { IComponent, ISizeMeasurable } from './component'
import { ContainerConstructor, IContainer } from './container'
import './lodash-chunk_by'

export interface ILayouter {
  resizeComponents (parent: ISizeMeasurable): void
  moveComponents (ox: number, oy: number, parent: ISizeMeasurable): void
}

export type IContainerComponent = IComponent & IContainer

export type LayouterConstructor<T> = new (...args: any[]) => T & ILayouter

export default function Layouter<T extends ContainerConstructor<IContainerComponent>> (base: T): LayouterConstructor<IContainerComponent> {
  return class extends base {
    public resizeComponents (parent: ISizeMeasurable) {
      switch (this.layout) {
      case 'flow':
        this.resizeComponentsForFlowLayout(parent)
        break
      case 'horizontalBox':
        this.resizeComponentsForHorizontalBox(parent)
        break
      case 'verticalBox':
        this.resizeComponentsForVerticalBox(parent)
        break
      default:
        break
      }
    }

    public moveComponents (ox: number = 0, oy: number = 0, parent: ISizeMeasurable) {
      switch (this.layout) {
      case 'flow':
        this.moveComponentsForFlowLayout(ox, oy, parent)
        break
      case 'horizontalBox':
        this.moveComponentsForHorizontalBox(ox, oy, parent)
        break
      case 'verticalBox':
        this.moveComponentsForVerticalBox(ox, oy, parent)
        break
      default:
        break
      }
    }

    private get testIfComponentsOverflow () {
      let horizontalMargin = this.paddingLeft
      let width = 0
      const maxWidth = this.contentWidth
      let forceBreak = false
      return (component: Component) => {
        if (component.position === 'absolute') {
          return false
        }
        const horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + component.width
        if (forceBreak) {
          forceBreak = component.breakAfter
          width = horizontalSpace
          horizontalMargin = this.paddingLeft
          return true
        } else {
          forceBreak = component.breakAfter
        }
        const expectedWidth = width + component.layoutWidth + this.paddingLeft + this.paddingRight
        if (width > 0 && expectedWidth > maxWidth) {
          width = horizontalSpace
          horizontalMargin = this.paddingLeft
          return true
        } else {
          width += horizontalSpace
          horizontalMargin = component.marginRight
          return false
        }
      }
    }

    private evaluateRowWidth (withExtraCalcuration?: (component: Component, horizontalSpace: number) => number) {
      let horizontalMargin = this.paddingLeft
      return (width: number, component: Component) => {
        let horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width
        if (withExtraCalcuration) {
          horizontalSpace = withExtraCalcuration(component, horizontalSpace)
        }
        if (component.position === 'absolute') {
          return width
        }
        horizontalMargin = component.marginRight
        return horizontalSpace + component.width
      }
    }

    private resizeComponentsForFlowLayout (parent: ISizeMeasurable) {
      let verticalMargin = this.paddingTop
      this.contentWidth = this.rawWidth
      this.contentHeight = _.reduce(_.chunkBy(_.forEach(this.components, (component) => {
        component.resize(this)
      }), this.testIfComponentsOverflow), (height: number, row: Component[]) => {
        const component = _.maxBy(row, (col) => col.layoutHeight)
        if (component.position === 'absolute') {
          return height
        }
        const verticalSpace = Math.max(verticalMargin, component.marginTop) + height
        verticalMargin = component.marginBottom
        return verticalSpace + component.height
      }, 0) + Math.max(verticalMargin, this.paddingBottom)
    }

    private moveComponentsForFlowLayout (ox: number = 0, oy: number = 0, parent: ISizeMeasurable) {
      let verticalMargin = this.paddingTop
      return _.reduce(_.chunkBy(this.components, this.testIfComponentsOverflow), (height: number, row: Component[]) => {
        const tallestComponent = _.maxBy(row, (col) => col.layoutHeight)
        const maxComponentHeight = tallestComponent.height
        const verticalSpace = Math.max(verticalMargin, tallestComponent.marginTop) + height
        verticalMargin = tallestComponent.marginBottom
        const innerWidth = _.reduce(row, this.evaluateRowWidth(), 0) + Math.max(_.last(row).marginRight, this.paddingRight)
        _.reduce(row, this.evaluateRowWidth((component, horizontalSpace) => {
          let x = this.x + horizontalSpace
          switch (this.justifyContent) {
          case 'spaceBetween':
            if (row.length > 1 && !_.last(row).breakAfter) {
              horizontalSpace += (this.width - innerWidth) / (row.length - 1.0)
              x += horizontalSpace
            }
          case 'center':
            x += (this.width - innerWidth) / 2.0
          case 'right':
            x += (this.width - innerWidth)
          }
          let y = this.y + verticalSpace
          switch (this.alignItems) {
          case 'center':
            y += (maxComponentHeight - component.height) / 2.0
          case 'bottom':
            y += (maxComponentHeight - component.height)
          }
          if (component.position === 'absolute') {
            component.move(this.x, this.y, this)
          } else {
            component.move(x, y, this)
          }
          return horizontalSpace
        }), 0)
        return verticalSpace + maxComponentHeight
      }, 0)
    }

    private resizeComponentsForVerticalBox (parent: ISizeMeasurable) {
      let verticalMargin = this.paddingTop
      this.contentHeight = _.reduce(this.components, (height: number, component: Component) => {
        const verticalSpace = Math.max(verticalMargin, component.marginTop) + height
        verticalMargin = component.marginBottom
        return verticalSpace + component.height
      }, 0) + Math.max(verticalMargin, this.paddingBottom)
      const widestComponent = _.maxBy(this.components, (component) => component.layoutWidth)
      if (widestComponent) {
        this.contentWidth = widestComponent.width +
          Math.max(widestComponent.marginLeft, this.paddingLeft) +
          Math.max(widestComponent.marginRight, this.paddingRight)
      }
    }

    private moveComponentsForVerticalBox (ox: number = 0, oy: number = 0, parent: ISizeMeasurable) {
      let verticalMargin = this.paddingTop
      _.reduce(this.components, (height: number, component: Component) => {
        const horizontalSpace = Math.max(this.paddingLeft, component.marginLeft)
        let verticalSpace = Math.max(verticalMargin, component.marginTop) + height
        let x = this.x + horizontalSpace
        switch (this.justifyContent) {
        case 'center':
          x += (component.innerWidth(this) - component.width) / 2
          break
        case 'right':
          x += (component.innerWidth(this) - component.width)
          break
        }
        let y = this.y + verticalSpace
        switch (this.alignItems) {
        case 'spaceBetween':
          if (this.rawHeight && this.components.length > 1) {
            verticalSpace += (this.rawHeight - this.contentHeight) / (this.components.length - 1)
          }
          break
        case 'center':
          y += (this.rawHeight ? (this.rawHeight - this.contentHeight) / 2 : 0)
          break
        case 'bottom':
          y += (this.rawHeight ? this.rawHeight - this.contentHeight : 0)
          break
        }
        if (component.position === 'absolute') {
          component.move(this.x, this.y, this)
        } else {
          component.move(x, y, this)
        }
        if (component.position === 'absolute') {
          return height
        }
        verticalMargin = component.marginBottom
        return verticalSpace + component.height
      }, 0)
    }

    private resizeComponentsForHorizontalBox (parent: ISizeMeasurable) {
      let horizontalMargin = this.paddingLeft
      this.contentWidth = _.reduce(this.components, (width: number, component: Component) => {
        component.resize(this)
        if (component.position === 'absolute') {
          return width
        }
        const horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width
        horizontalMargin = component.marginRight
        return horizontalSpace + component.width
      }, 0) + Math.max(horizontalMargin, this.paddingRight)
      const tallestComponent = _.maxBy(this.components, (component: Component) => component.layoutHeight)
      if (tallestComponent) {
        this.contentHeight = tallestComponent.height +
          Math.max(tallestComponent.marginTop, this.paddingTop) +
          Math.max(tallestComponent.marginBottom, this.paddingBottom)
      }
    }

    private moveComponentsForHorizontalBox (ox: number = 0, oy: number = 0, parent: ISizeMeasurable) {
      let horizontalMargin = this.paddingLeft
      _.reduce(this.components, (width: number, component: Component) => {
        let horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width
        const verticalSpace = Math.max(this.paddingTop, component.marginTop)
        let x = this.x + horizontalSpace
        switch (this.justifyContent) {
        case 'spaceBetween':
          if (this.rawWidth && this.components.length > 1) {
            horizontalSpace += (this.rawWidth - this.contentWidth) / (this.components.length - 1)
          }
        case 'center':
          x += (this.rawWidth ? (this.rawWidth - this.contentWidth) / 2 : 0)
          break
        case 'right':
          x += (this.rawWidth ? this.rawWidth - this.contentWidth : 0)
          break
        }
        let y = this.y + verticalSpace
        switch (this.alignItems) {
        case 'center':
          y = (component.innerHeight(this) - component.height) / 2
        case 'bottom':
          y = component.innerHeight(this) - component.height
        }
        if (component.position === 'absolute') {
          component.move(this.x, this.y, this)
        } else {
          component.move(x, y, this)
        }
        if (component.position === 'absolute') {
          return width
        }
        horizontalMargin = component.marginRight
        return horizontalSpace + component.width
      }, 0)
    }
  }
}
