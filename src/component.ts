import { Style, StyleProperties } from './style'

export type WidthMeasurable = {
  width: number
}

export type HeightMeasurable = {
  height: number
}

export type SizeMeasurable = WidthMeasurable & HeightMeasurable

export class Component {
  public readonly id: string
  public rawX: number
  public rawY: number
  public rawWidth: number
  public rawHeight: number
  public contentWidth: number
  public contentHeight: number
  protected readonly style: Style

  constructor (id: string, style?: StyleProperties) {
    this.id = id
    this.style = new Style(style)
  }

  get x () {
    return this.rawX
  }

  get y () {
    return this.rawY
  }

  get position () {
    return this.style.position
  }

  get top () {
    return this.style.top
  }

  get left () {
    return this.style.left
  }

  get bottom () {
    return this.style.bottom
  }

  get right () {
    return this.style.right
  }

  get layout () {
    return this.style.layout
  }

  get justifyContent () {
    return this.style.justifyContent
  }

  get alignItems () {
    return this.style.alignItems
  }

  get breakAfter () {
    return this.style.breakAfter
  }

  get visible () {
    return this.style.visible
  }

  get horizontalItemArrangement () {
    return this.style.horizontalItemArrangement
  }

  get verticalItemArrangement () {
    return this.style.verticalItemArrangement
  }

  get paddingTop () {
    return this.style.paddingTop
  }

  get paddingRight () {
    return this.style.paddingRight
  }

  get paddingBottom () {
    return this.style.paddingBottom
  }

  get paddingLeft () {
    return this.style.paddingLeft
  }

  get width () {
    return this.rawWidth || this.contentWidth || 0
  }

  get height () {
    return this.rawHeight || this.contentHeight || 0
  }

  get layoutWidth () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.width + this.marginLeft + this.marginRight
  }

  get layoutHeight () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.height + this.marginTop + this.marginBottom
  }

  get marginTop () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.style.marginTop
  }

  get marginRight () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.style.marginRight
  }

  get marginBottom () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.style.marginBottom
  }

  get marginLeft () {
    if (this.position === 'absolute') {
      return 0
    }
    return this.style.marginLeft
  }

  get horizontalMargin () {
    return this.marginLeft + this.marginRight
  }

  public offsetLeft (parent: Component) {
    return Math.max(parent.paddingLeft, this.marginLeft)
  }

  public offsetRight (parent: Component) {
    return Math.max(parent.paddingRight, this.marginRight)
  }

  public horizontalOffset (parent: Component) {
    return this.offsetLeft(parent) + this.offsetLeft(parent)
  }

  public testIfComponent (obj: any): obj is Component {
    return obj instanceof Component
  }

  get verticalMargin () {
    return this.marginTop + this.marginBottom
  }

  public offsetTop (parent: Component) {
    return Math.max(parent.paddingTop, this.marginTop)
  }

  public offsetBottom (parent: Component) {
    return Math.max(parent.paddingBottom, this.marginBottom)
  }

  public verticalOffset (parent: Component) {
    return this.offsetTop(parent) + this.offsetBottom(parent)
  }

  public innerWidth (parent: Component | WidthMeasurable) {
    if (this.testIfComponent(parent)) {
      return parent.width - this.horizontalOffset(parent)
    }
    return parent.width - this.horizontalMargin
  }

  public innerHeight (parent: Component | HeightMeasurable) {
    if (this.testIfComponent(parent)) {
      return parent.height - this.verticalOffset(parent)
    }
    return parent.height - this.verticalMargin
  }

  public relayout (ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
    this.resize(parent)
    this.move(ox, oy, parent)
  }

  public move (toX: number, toY: number, parent: SizeMeasurable) {
    this.moveX(toX, parent)
    this.moveY(toY, parent)
  }

  public resize (parent: Component | SizeMeasurable) {
    if (this.style.width === 'full') {
      this.rawWidth = this.innerWidth(parent)
    } else if (!this.testIfComponent(parent) || parent.verticalItemArrangement === 'real') {
      this.rawWidth = (this.style.width || 0)
    } else if (parent.verticalItemArrangement === 'ratio')  {
      this.rawWidth = (this.style.width || 0) * parent.width
    } else {
      this.rawWidth = 0
    }
    if (this.style.height === 'full') {
      this.rawHeight = this.innerHeight(parent)
    } else if (!this.testIfComponent(parent) || parent.verticalItemArrangement === 'real') {
      this.rawHeight = (this.style.height || 0)
    } else if (parent.verticalItemArrangement === 'ratio')  {
      this.rawHeight = (this.style.height || 0) * parent.height
    } else {
      this.rawHeight = 0
    }
  }

  private moveX (toX: number, parent: SizeMeasurable) {
    if (this.position === 'absolute') {
      if (this.left && typeof this.left === 'number') {
        if (Number.isInteger(this.left)) {
          this.rawX = toX + this.left
        } else {
          this.rawX = toX + (parent.width - this.width) * this.left
        }
      } else if (this.right && typeof this.right === 'number') {
        if (Number.isInteger(this.right)) {
          this.rawX = toX + parent.width - this.width - this.right
        } else {
          this.rawX = toX + (parent.width - this.width) * (1 - this.right)
        }
      } else {
        this.rawX = toX
      }
    } else {
      if (this.left && typeof this.left === 'number') {
        if (Number.isInteger(this.left)) {
          this.rawX = toX + this.left
        } else {
          this.rawX = toX + this.width * this.left
        }
      } else if (this.right && typeof this.right === 'number') {
        if (Number.isInteger(this.right)) {
          this.rawX = toX - this.right
        } else {
          this.rawX = toX - this.width * this.right
        }
      } else {
        this.rawX = toX
      }
    }
  }

  private moveY (toY: number, parent: SizeMeasurable) {
    if (this.position === 'absolute') {
      if (this.top && typeof this.top === 'number') {
        if (Number.isInteger(this.top)) {
          this.rawY = toY + this.top
        } else {
          this.rawY = toY + (parent.height - this.height) * this.top
        }
      } else if (this.bottom && typeof this.bottom === 'number') {
        if (Number.isInteger(this.bottom)) {
          this.rawY = toY + parent.height - this.height - this.bottom
        } else {
          this.rawY = toY + (parent.height - this.height) * (1 - this.bottom)
        }
      } else {
        this.rawY = toY
      }
    } else {
      if (this.top && typeof this.top === 'number') {
        if (Number.isInteger(this.top)) {
          this.rawY = toY + this.top
        } else {
          this.rawY = toY + this.height * this.top
        }
      } else if (this.bottom && typeof this.bottom === 'number') {
        if (Number.isInteger(this.bottom)) {
          this.rawY = toY - this.bottom
        } else {
          this.rawY = toY - this.height * this.bottom
        }
      } else {
        this.rawY = toY
      }
    }
  }
}
