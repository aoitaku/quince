import * as _ from 'lodash'

export interface IAssignableProperties {
  position?: 'relative' | 'absolute'
  top?: number
  left?: number
  bottom?: number
  right?: number
  width?: number | 'full'
  height?: number | 'full'
  layout?: 'flow' | 'horizontalBox' | 'verticalBox'
  justifyContent?: 'left' | 'center' | 'spaceBetween' | 'right'
  alignItems?: 'top' | 'center' | 'spaceBetween' | 'bottom'
  breakAfter?: boolean
  visible?: boolean
  horizontalItemArrangement?: 'real' | 'ratio'
  verticalItemArrangement?: 'real' | 'ratio'
}

export interface IStyleProperties extends IAssignableProperties {
  margin?: [number, number, number, number]
  padding?: [number, number, number, number]
}

function isMarginOrPadding (name: any, value: any): value is IStyleProperties['margin' | 'padding'] {
  return name === 'margin' || name === 'padding'
}

export default class Style {

  public position: 'relative' | 'absolute' = 'relative'
  public top?: number = undefined
  public left?: number = undefined
  public bottom?: number = undefined
  public right?: number = undefined
  public width?: number | 'full' = undefined
  public height?: number | 'full' = undefined
  public layout: 'flow' | 'horizontalBox' | 'verticalBox' = 'flow'
  public justifyContent: 'left' | 'center' | 'spaceBetween' | 'right' = 'left'
  public alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom' = 'top'
  public breakAfter: boolean = false
  public visible: boolean = true
  public horizontalItemArrangement: 'real' | 'ratio' = 'real'
  public verticalItemArrangement: 'real' | 'ratio' = 'real'

  private _margin: [number, number, number, number] = [0, 0, 0, 0]
  private _padding: [number, number, number, number] = [0, 0, 0, 0]

  constructor (style?: IStyleProperties) {
    if (!style) {
      return
    }
    _.each(style, (value: IStyleProperties[keyof IStyleProperties], name: keyof IStyleProperties) => {
      if (isMarginOrPadding(name, value)) {
        if (name === 'margin') {
          if (value) {
            this.setMargin(...value)
          }
        } else {
          if (value) {
            this.setPadding(...value)
          }
        }
      } else if (name !== 'margin' && name !== 'padding') {
        this[name] = value
      }
    })
  }

  get margin() {
    return this._margin
  }

  get marginTop () {
    return this._margin[0]
  }

  get marginRight () {
    return this._margin[1]
  }

  get marginBottom () {
    return this._margin[2]
  }

  get marginLeft () {
    return this._margin[3]
  }

  get padding() {
    return this._padding
  }

  get paddingTop () {
    return this._padding[0]
  }

  get paddingRight () {
    return this._padding[1]
  }

  get paddingBottom () {
    return this._padding[2]
  }

  get paddingLeft () {
    return this._padding[3]
  }

  public setMargin (...args: number[]) {
    switch (args.length) {
    case 4:
      this._margin = [args[0], args[1], args[2], args[3]]
      break
    case 3:
      this._margin = [args[0], args[1], args[2], args[1]]
      break
    case 2:
      this._margin = [args[0], args[1], args[0], args[1]]
      break
    case 1:
      this._margin = [args[0], args[0], args[0], args[0]]
      break
    }
  }

  public setPadding (...args: number[]) {
    switch (args.length) {
    case 4:
      this._padding = [args[0], args[1], args[2], args[3]]
      break
    case 3:
      this._padding = [args[0], args[1], args[2], args[1]]
      break
    case 2:
      this._padding = [args[0], args[1], args[0], args[1]]
      break
    case 1:
      this._padding = [args[0], args[0], args[0], args[0]]
      break
    }
  }
}
