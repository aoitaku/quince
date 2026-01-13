type PositionProperty = { position: 'relative' | 'absolute' }
type TopProperty = { top: number }
type LeftProperty = { left: number }
type BottomProperty = { bottom: number }
type RightProperty = { right: number }
type WidthProperty = { width: number | 'full' }
type HeightProperty = { height: number | 'full' }
type LayoutProperty = { layout: 'flow' | 'horizontalBox' | 'verticalBox' }
type JustifyContentProperty = { justifyContent: 'left' | 'center' | 'spaceBetween' | 'right' }
type AlignItemsProperty = { alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom' }
type BreakAfterProperty = { breakAfter: boolean }
type VisibilityProperty = { visible: boolean }
type HorizontalItemArrangementProperty = { horizontalItemArrangement: 'real' | 'ratio' }
type VerticalItemArrangementProperty = { verticalItemArrangement: 'real' | 'ratio' }

type PositionPropertyEntry = [keyof PositionProperty, PositionProperty[keyof PositionProperty]]
type TopPropertyEntry = [keyof TopProperty, TopProperty[keyof TopProperty]]
type LeftPropertyEntry = [keyof LeftProperty, LeftProperty[keyof LeftProperty]]
type BottomPropertyEntry = [keyof BottomProperty, BottomProperty[keyof BottomProperty]]
type RightPropertyEntry = [keyof RightProperty, RightProperty[keyof RightProperty]]
type WidthPropertyEntry = [keyof WidthProperty, WidthProperty[keyof WidthProperty]]
type HeightPropertyEntry = [keyof HeightProperty, HeightProperty[keyof HeightProperty]]
type LayoutPropertyEntry = [keyof LayoutProperty, LayoutProperty[keyof LayoutProperty]]
type JustifyContentPropertyEntry = [keyof JustifyContentProperty, JustifyContentProperty[keyof JustifyContentProperty]]
type AlignItemsPropertyEntry = [keyof AlignItemsProperty, AlignItemsProperty[keyof AlignItemsProperty]]
type BreakAfterPropertyEntry = [keyof BreakAfterProperty, BreakAfterProperty[keyof BreakAfterProperty]]
type VisibilityPropertyEntry = [keyof VisibilityProperty, VisibilityProperty[keyof VisibilityProperty]]
type HorizontalItemArrangementPropertyEntry = [keyof HorizontalItemArrangementProperty, HorizontalItemArrangementProperty[keyof HorizontalItemArrangementProperty]]
type VerticalItemArrangementPropertyEntry = [keyof VerticalItemArrangementProperty, VerticalItemArrangementProperty[keyof VerticalItemArrangementProperty]]
type AssignablePropertyEntries =
  PositionPropertyEntry
  | TopPropertyEntry
  | LeftPropertyEntry
  | BottomPropertyEntry
  | RightPropertyEntry
  | WidthPropertyEntry
  | HeightPropertyEntry
  | LayoutPropertyEntry
  | JustifyContentPropertyEntry
  | AlignItemsPropertyEntry
  | BreakAfterPropertyEntry
  | VisibilityPropertyEntry
  | HorizontalItemArrangementPropertyEntry
  | VerticalItemArrangementPropertyEntry
export type AssignableProperties = Partial<PositionProperty>
  & Partial<TopProperty>
  & Partial<LeftProperty>
  & Partial<BottomProperty>
  & Partial<RightProperty>
  & Partial<WidthProperty>
  & Partial<HeightProperty>
  & Partial<LayoutProperty>
  & Partial<JustifyContentProperty>
  & Partial<AlignItemsProperty>
  & Partial<BreakAfterProperty>
  & Partial<VisibilityProperty>
  & Partial<HorizontalItemArrangementProperty>
  & Partial<VerticalItemArrangementProperty>

type MarginProperty = { margin: [number] | [number, number] | [number, number, number] | [number, number, number, number] }
type PaddingProperty = { padding: [number] | [number, number] | [number, number, number] | [number, number, number, number] }
export type StyleProperties = AssignableProperties
  & Partial<MarginProperty>
  & Partial<PaddingProperty>
type MarginPropertyEntry = [keyof MarginProperty, MarginProperty[keyof MarginProperty]]
type PaddingPropertyEntry = [keyof PaddingProperty, PaddingProperty[keyof PaddingProperty]]
type StylePropertyEntries = AssignablePropertyEntries | MarginPropertyEntry | PaddingPropertyEntry

function isMarginOrPadding(name: keyof StyleProperties, value: unknown): value is StyleProperties['margin' | 'padding'] {
  return name === 'margin' || name === 'padding'
}

export class Style {
  public position: PositionProperty[keyof PositionProperty] = 'relative'
  public top?: TopProperty[keyof TopProperty] = undefined
  public left?: LeftProperty[keyof LeftProperty] = undefined
  public bottom?: BottomProperty[keyof BottomProperty] = undefined
  public right?: RightProperty[keyof RightProperty] = undefined
  public width?: WidthProperty[keyof WidthProperty] = undefined
  public height?: HeightProperty[keyof HeightProperty] = undefined
  public layout: LayoutProperty[keyof LayoutProperty] = 'flow'
  public justifyContent: JustifyContentProperty[keyof JustifyContentProperty] = 'left'
  public alignItems: AlignItemsProperty[keyof AlignItemsProperty] = 'top'
  public breakAfter: BreakAfterProperty[keyof BreakAfterProperty] = false
  public visible: VisibilityProperty[keyof VisibilityProperty] = true
  public horizontalItemArrangement: HorizontalItemArrangementProperty[keyof HorizontalItemArrangementProperty] = 'real'
  public verticalItemArrangement: VerticalItemArrangementProperty[keyof VerticalItemArrangementProperty] = 'real'

  private _margin: [number, number, number, number] = [0, 0, 0, 0]
  private _padding: [number, number, number, number] = [0, 0, 0, 0]

  constructor(style?: StyleProperties) {
    if (!style) {
      return
    }
    Object.entries(style).forEach((entry: StylePropertyEntries) => {
      const [name, value] = entry
      if (isMarginOrPadding(name, value)) {
        if (name === 'margin') {
          if (value) {
            this.setMargin(value)
          }
        } else {
          if (value) {
            this.setPadding(value)
          }
        }
      } else if (name !== 'margin' && name !== 'padding') {
        Object.assign(this, { [name]: value })
      }
    })
  }

  get margin() {
    return this._margin
  }

  get marginTop() {
    return this._margin[0]
  }

  get marginRight() {
    return this._margin[1]
  }

  get marginBottom() {
    return this._margin[2]
  }

  get marginLeft() {
    return this._margin[3]
  }

  get padding() {
    return this._padding
  }

  get paddingTop() {
    return this._padding[0]
  }

  get paddingRight() {
    return this._padding[1]
  }

  get paddingBottom() {
    return this._padding[2]
  }

  get paddingLeft() {
    return this._padding[3]
  }

  public setMargin(args: MarginProperty[keyof MarginProperty]) {
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

  public setPadding(args: PaddingProperty[keyof PaddingProperty]) {
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
