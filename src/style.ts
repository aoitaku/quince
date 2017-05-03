/// <reference path='../typings/index.d.ts' />
import * as _ from 'lodash'

export default class Style {

  public position: 'relative' | 'absolute' = 'relative'
  public top: number | null = null
  public left: number | null = null
  public bottom: number | null = null
  public right: number | null = null
  public width: number | 'full' | null = null
  public height: number | 'full' | null = null
  public layout: 'flow' | 'horizontalBox' | 'verticalBox' | null = null
  public justifyContent: 'left' | 'center' | 'spaceBetween' | 'right' | null = null
  public alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom' | null = null
  public breakAfter: boolean = false
  public visible: boolean = true
  public horizontalItemArrangement: 'real' | 'ratio' = 'real'
  public verticalItemArrangement: 'real' | 'ratio' = 'real'

  private _margin: [number, number, number, number] = [0, 0, 0, 0]
  private _padding: [number, number, number, number] = [0, 0, 0, 0]

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

  public setMargin (margin: number, rightOrHorizontal?: number, bottom?: number, left?: number) {
    if (left) {
      this._margin = [margin, rightOrHorizontal, bottom, left]
    } else if (bottom) {
      this._margin = [margin, rightOrHorizontal, bottom, rightOrHorizontal]
    } else if (rightOrHorizontal) {
      this._margin = [margin, rightOrHorizontal, margin, rightOrHorizontal]
    } else {
      this._margin = [margin, margin, margin, margin]
    }
  }

  public setPadding (padding: number, rightOrHorizontal?: number, bottom?: number, left?: number) {
    if (left) {
      this._padding = [padding, rightOrHorizontal, bottom, left]
    } else if (bottom) {
      this._padding = [padding, rightOrHorizontal, bottom, rightOrHorizontal]
    } else if (rightOrHorizontal) {
      this._padding = [padding, rightOrHorizontal, padding, rightOrHorizontal]
    } else {
      this._padding = [padding, padding, padding, padding]
    }
  }
}
