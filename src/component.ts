import {
  createStyle,
  getMarginBottom as getStyleMarginBottom,
  getMarginLeft as getStyleMarginLeft,
  getMarginRight as getStyleMarginRight,
  getMarginTop as getStyleMarginTop,
  getPaddingBottom as getStylePaddingBottom,
  getPaddingLeft as getStylePaddingLeft,
  getPaddingRight as getStylePaddingRight,
  getPaddingTop as getStylePaddingTop,
  type Style,
  type StyleProperties,
} from './style'

export type WidthMeasurable = {
  width: number
}

export type HeightMeasurable = {
  height: number
}

export type SizeMeasurable = WidthMeasurable & HeightMeasurable

export type Component = {
  id: string
  rawX: number | undefined
  rawY: number | undefined
  rawWidth: number | undefined
  rawHeight: number | undefined
  contentWidth: number | undefined
  contentHeight: number | undefined
  style: Style
}

export function createComponent(id: string, style?: StyleProperties): Component {
  return {
    id,
    rawX: undefined,
    rawY: undefined,
    rawWidth: undefined,
    rawHeight: undefined,
    contentWidth: undefined,
    contentHeight: undefined,
    style: createStyle(style),
  }
}

export function getX(component: Component) {
  return component.rawX
}

export function getY(component: Component) {
  return component.rawY
}

export function getPosition(component: Component) {
  return component.style.position
}

export function getTop(component: Component) {
  return component.style.top || 0
}

export function getLeft(component: Component) {
  return component.style.left || 0
}

export function getBottom(component: Component) {
  return component.style.bottom || 0
}

export function getRight(component: Component) {
  return component.style.right || 0
}

export function getLayout(component: Component) {
  return component.style.layout
}

export function getJustifyContent(component: Component) {
  return component.style.justifyContent
}

export function getAlignItems(component: Component) {
  return component.style.alignItems
}

export function getBreakAfter(component: Component) {
  return component.style.breakAfter
}

export function getVisible(component: Component) {
  return component.style.visible
}

export function getHorizontalItemArrangement(component: Component) {
  return component.style.horizontalItemArrangement
}

export function getVerticalItemArrangement(component: Component) {
  return component.style.verticalItemArrangement
}

export function getPaddingTop(component: Component) {
  return getStylePaddingTop(component.style)
}

export function getPaddingRight(component: Component) {
  return getStylePaddingRight(component.style)
}

export function getPaddingBottom(component: Component) {
  return getStylePaddingBottom(component.style)
}

export function getPaddingLeft(component: Component) {
  return getStylePaddingLeft(component.style)
}

export function getWidth(component: Component | WidthMeasurable) {
  if(testIfComponent(component)) {
    return component.rawWidth || component.contentWidth || 0
  }
  return component.width
}

export function getHeight(component: Component | HeightMeasurable) {
  if(testIfComponent(component)) {
    return component.rawHeight || component.contentHeight || 0
  }
  return component.height
}

export function getLayoutWidth(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getWidth(component) + getMarginLeft(component) + getMarginRight(component)
}

export function getLayoutHeight(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getHeight(component) + getMarginTop(component) + getMarginBottom(component)
}

export function getMarginTop(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getStyleMarginTop(component.style)
}

export function getMarginRight(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getStyleMarginRight(component.style)
}

export function getMarginBottom(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getStyleMarginBottom(component.style)
}

export function getMarginLeft(component: Component) {
  if (getPosition(component) === 'absolute') {
    return 0
  }
  return getStyleMarginLeft(component.style)
}

export function getHorizontalMargin(component: Component) {
  return getMarginLeft(component) + getMarginRight(component)
}

export function getOffsetLeft(component: Component, parent: Component) {
  return Math.max(getPaddingLeft(parent), getMarginLeft(component))
}

export function getOffsetRight(component: Component, parent: Component) {
  return Math.max(getPaddingRight(parent), getMarginRight(component))
}

export function getHorizontalOffset(component: Component, parent: Component) {
  return getOffsetLeft(component, parent) + getOffsetLeft(component, parent)
}

export function getVerticalMargin(component: Component) {
  return getMarginTop(component) + getMarginBottom(component)
}

export function getOffsetTop(component: Component, parent: Component) {
  return Math.max(getPaddingTop(parent), getMarginTop(component))
}

export function getOffsetBottom(component: Component, parent: Component) {
  return Math.max(getPaddingBottom(parent), getMarginBottom(component))
}

export function getVerticalOffset(component: Component, parent: Component) {
  return getOffsetTop(component, parent) + getOffsetBottom(component, parent)
}

export function getInnerWidth(component: Component, parent: Component | WidthMeasurable) {
  if (testIfComponent(parent)) {
    return getWidth(parent) - getHorizontalOffset(component, parent)
  }
  return getWidth(parent) - getHorizontalMargin(component)
}

export function getInnerHeight(component: Component, parent: Component | HeightMeasurable) {
  if (testIfComponent(parent)) {
    return getHeight(parent) - getVerticalOffset(component, parent)
  }
  return getHeight(parent) - getVerticalMargin(component)
}

export function testIfComponent(obj: unknown): obj is Component {
  return typeof obj === 'object'
    && obj != null
    && Object.hasOwn(obj, 'id')
    && Object.hasOwn(obj, 'rawX')
    && Object.hasOwn(obj, 'rawY')
    && Object.hasOwn(obj, 'rawWidth')
    && Object.hasOwn(obj, 'rawHeight')
    && Object.hasOwn(obj, 'contentWidth')
    && Object.hasOwn(obj, 'contentHeight')
    && Object.hasOwn(obj, 'style')
}

export function relayout(component: Component, ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
  resize(component, parent)
  move(component, ox, oy, parent)
}

export function move(component: Component, toX: number, toY: number, parent: Component | SizeMeasurable) {
  moveX(component, toX, parent)
  moveY(component, toY, parent)
}

export function resize(component: Component, parent: Component | SizeMeasurable) {
  if (component.style.width === 'full') {
    component.rawWidth = getInnerWidth(component, parent)
  } else if (!testIfComponent(parent) || getHorizontalItemArrangement(parent) === 'real') {
    component.rawWidth = (component.style.width || 0)
  } else if (getHorizontalItemArrangement(parent) === 'ratio') {
    component.rawWidth = (component.style.width || 0) * getWidth(parent)
  } else {
    component.rawWidth = 0
  }
  if (component.style.height === 'full') {
    component.rawHeight = getInnerHeight(component, parent)
  } else if (!testIfComponent(parent) || getVerticalItemArrangement(parent) === 'real') {
    component.rawHeight = (component.style.height || 0)
  } else if (getVerticalItemArrangement(parent) === 'ratio') {
    component.rawHeight = (component.style.height || 0) * getHeight(parent)
  } else {
    component.rawHeight = 0
  }
}

export function moveX(component: Component, toX: number, parent: Component | SizeMeasurable) {
  if (getPosition(component) === 'absolute') {
    if (getLeft(component) && typeof getLeft(component) === 'number') {
      if (Number.isInteger(getLeft(component))) {
        component.rawX = toX + getLeft(component)
      } else {
        component.rawX = toX + (getWidth(parent) - getWidth(component)) * getLeft(component)
      }
    } else if (getRight(component) && typeof getRight(component) === 'number') {
      if (Number.isInteger(getRight(component))) {
        component.rawX = toX + getWidth(parent) - getWidth(component) - getRight(component)
      } else {
        component.rawX = toX + (getWidth(parent) - getWidth(component)) * (1 - getRight(component))
      }
    } else {
      component.rawX = toX
    }
  } else {
    if (getLeft(component) && typeof getLeft(component) === 'number') {
      if (Number.isInteger(getLeft(component))) {
        component.rawX = toX + getLeft(component)
      } else {
        component.rawX = toX + getWidth(component) * getLeft(component)
      }
    } else if (getRight(component) && typeof getRight(component) === 'number') {
      if (Number.isInteger(getRight(component))) {
        component.rawX = toX - getRight(component)
      } else {
        component.rawX = toX - getWidth(component) * getRight(component)
      }
    } else {
      component.rawX = toX
    }
  }
}

export function moveY(component: Component, toY: number, parent: Component | SizeMeasurable) {
  if (getPosition(component) === 'absolute') {
    if (getTop(component) && typeof getTop(component) === 'number') {
      if (Number.isInteger(getTop(component))) {
        component.rawY = toY + getTop(component)
      } else {
        component.rawY = toY + (getHeight(parent) - getHeight(component)) * getTop(component)
      }
    } else if (getBottom(component) && typeof getBottom(component) === 'number') {
      if (Number.isInteger(getBottom(component))) {
        component.rawY = toY + getHeight(parent) - getHeight(component) - getBottom(component)
      } else {
        component.rawY = toY + (getHeight(parent) - getHeight(component)) * (1 - getBottom(component))
      }
    } else {
      component.rawY = toY
    }
  } else {
    if (getTop(component) && typeof getTop(component) === 'number') {
      if (Number.isInteger(getTop(component))) {
        component.rawY = toY + getTop(component)
      } else {
        component.rawY = toY + getHeight(component) * getTop(component)
      }
    } else if (getBottom(component) && typeof getBottom(component) === 'number') {
      if (Number.isInteger(getBottom(component))) {
        component.rawY = toY - getBottom(component)
      } else {
        component.rawY = toY - getHeight(component) * getBottom(component)
      }
    } else {
      component.rawY = toY
    }
  }
}
