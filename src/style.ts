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

export type BoxSpacing = [number] | [number, number] | [number, number, number] | [number, number, number, number]
export type BoxSpacingEdges = [number, number, number, number]
type MarginProperty = { margin: BoxSpacing }
type PaddingProperty = { padding: BoxSpacing }

export type StyleProperties = AssignableProperties
  & Partial<MarginProperty>
  & Partial<PaddingProperty>

export type Style = {
  position: PositionProperty[keyof PositionProperty]
  top?: TopProperty[keyof TopProperty]
  left?: LeftProperty[keyof LeftProperty]
  bottom?: BottomProperty[keyof BottomProperty]
  right?: RightProperty[keyof RightProperty]
  width?: WidthProperty[keyof WidthProperty]
  height?: HeightProperty[keyof HeightProperty]
  layout: LayoutProperty[keyof LayoutProperty]
  justifyContent: JustifyContentProperty[keyof JustifyContentProperty]
  alignItems: AlignItemsProperty[keyof AlignItemsProperty]
  breakAfter: BreakAfterProperty[keyof BreakAfterProperty]
  visible: VisibilityProperty[keyof VisibilityProperty]
  horizontalItemArrangement: HorizontalItemArrangementProperty[keyof HorizontalItemArrangementProperty]
  verticalItemArrangement: VerticalItemArrangementProperty[keyof VerticalItemArrangementProperty]
  margin: BoxSpacingEdges
  padding: BoxSpacingEdges
}

export function normalizeBoxSpacing(args: BoxSpacing): BoxSpacingEdges {
  switch (args.length) {
    case 4:
      return [args[0], args[1], args[2], args[3]]
    case 3:
      return [args[0], args[1], args[2], args[1]]
    case 2:
      return [args[0], args[1], args[0], args[1]]
    case 1:
      return [args[0], args[0], args[0], args[0]]
  }
}

export function createStyle(properties?: StyleProperties): Style {
  let style: Style = {
    position: 'relative',
    top: undefined,
    left: undefined,
    bottom: undefined,
    right: undefined,
    width: undefined,
    height: undefined,
    layout: 'flow',
    justifyContent: 'left',
    alignItems: 'top',
    breakAfter: false,
    visible: true,
    horizontalItemArrangement: 'real',
    verticalItemArrangement: 'real',
    margin: [0, 0, 0, 0],
    padding: [0, 0, 0, 0],
  }

  if (!properties) {
    return style
  }

  const { margin, padding, ...assignableProperties } = properties
  style = {
    ...style,
    ...assignableProperties,
  }
  if (margin) {
    style = setMargin(style, margin)
  }
  if (padding) {
    style = setPadding(style, padding)
  }
  return style
}

export function setMargin(style: Style, margin: BoxSpacing): Style {
  return {
    ...style,
    margin: normalizeBoxSpacing(margin),
  }
}

export function setPadding(style: Style, padding: BoxSpacing): Style {
  return {
    ...style,
    padding: normalizeBoxSpacing(padding),
  }
}

export function getMarginTop(style: Style) {
  return style.margin[0]
}

export function getMarginRight(style: Style) {
  return style.margin[1]
}

export function getMarginBottom(style: Style) {
  return style.margin[2]
}

export function getMarginLeft(style: Style) {
  return style.margin[3]
}

export function getPaddingTop(style: Style) {
  return style.padding[0]
}

export function getPaddingRight(style: Style) {
  return style.padding[1]
}

export function getPaddingBottom(style: Style) {
  return style.padding[2]
}

export function getPaddingLeft(style: Style) {
  return style.padding[3]
}
