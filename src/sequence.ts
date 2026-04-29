import {
  calculateMoveX,
  calculateMoveY,
  type Component,
  getAlignItems,
  getBreakAfter,
  getHeight,
  getJustifyContent,
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
} from './component'

export type ArrangePatch = {
  id: string
  x: number
  y: number
}

export type MeasurePatch = {
  id: string
  contentWidth?: number
  contentHeight?: number
}

type FlowOverflowContext = {
  contentWidth: number
  paddingLeft: number
  paddingRight: number
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

function placeComponent(component: Component, x: number, y: number, parent: Component): ArrangePatch {
  return {
    id: component.id,
    x: calculateMoveX(component, x, parent),
    y: calculateMoveY(component, y, parent),
  }
}

function createFlowOverflowContext(contentWidth: number, parent: Component): FlowOverflowContext {
  return {
    contentWidth,
    paddingLeft: getPaddingLeft(parent),
    paddingRight: getPaddingRight(parent),
  }
}

function testIfComponentsOverflow(context: FlowOverflowContext) {
  let horizontalMargin = context.paddingLeft
  let width = 0
  const maxWidth = context.contentWidth
  let forceBreak = false
  return (component: Component) => {
    if (getPosition(component) === 'absolute') {
      return false
    }
    const horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + getWidth(component)
    if (forceBreak) {
      forceBreak = getBreakAfter(component)
      width = horizontalSpace
      horizontalMargin = context.paddingLeft
      return true
    } else {
      forceBreak = getBreakAfter(component)
    }
    const expectedWidth = width + getLayoutWidth(component) + context.paddingLeft + context.paddingRight
    if (width > 0 && expectedWidth > maxWidth) {
      width = horizontalSpace
      horizontalMargin = context.paddingLeft
      return true
    } else {
      width += horizontalSpace
      horizontalMargin = getMarginRight(component)
      return false
    }
  }
}

function evaluateRowWidth(
  withExtraCalculation: ((component: Component, horizontalSpace: number) => number) | undefined,
) {
  return ([width, horizontalMargin]: [number, number], component: Component): [number, number] => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + width
    if (withExtraCalculation) {
      horizontalSpace = withExtraCalculation(component, horizontalSpace)
    }
    if (getPosition(component) === 'absolute') {
      return [width, horizontalMargin]
    }
    return [horizontalSpace + getWidth(component), getMarginRight(component)]
  }
}

/**
 * flow レイアウトの子配置パッチを計算する低レベル API。
 *
 * `parent.contentWidth` を超える要素を次行へ折り返しながら、各子要素の最終 x/y を
 * `ArrangePatch[]` として返す。`position: 'absolute'` の子は親原点基準で別途配置する。
 * 自身に副作用は無く、結果を反映するには呼び出し側で {@link applyMove} を行う。
 * 通常は `relayoutContainer` 経由で呼ばれ、独自レイアウトを組み立てる場合のみ直接利用する。
 *
 * @param components 配置対象の子コンポーネント列。
 * @param parent 折り返し基準となる親 (rawWidth と padding を参照する)。
 * @returns `components` と同じ並びの配置パッチ列。
 */
export function arrangeFlowSequence(components: Component[], parent: Component): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let verticalMargin = getPaddingTop(parent)

  chunkBy(components, testIfComponentsOverflow(createFlowOverflowContext(getContentWidth(parent), parent)))
    .filter((row) => row.length > 0)
    .reduce((height: number, row: Component[]) => {
      const tallestComponent = maxBy(row, (col) => getLayoutHeight(col))!
      const maxComponentHeight = getHeight(tallestComponent)
      const verticalSpace = Math.max(verticalMargin, getMarginTop(tallestComponent)) + height
      verticalMargin = getMarginBottom(tallestComponent)
      const rowLast = last(row)!
      const [width] = row.reduce(evaluateRowWidth(undefined), [0, getPaddingLeft(parent)])
      const innerWidth = width + Math.max(getMarginRight(rowLast), getPaddingRight(parent))
      row.reduce(evaluateRowWidth((component, horizontalSpace) => {
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
      }), [0, getPaddingLeft(parent)])
      return verticalSpace + maxComponentHeight
    }, 0)

  return patches
}

/**
 * flow レイアウトの contentWidth/contentHeight を計算する低レベル API。
 *
 * flow では横幅は親の制約として与えられるため、`contentWidth` は `parent.rawWidth` をそのまま
 * 採用し、`contentHeight` は折り返し後の各行高の累積として算出する。
 * 結果を反映するには呼び出し側で `parent.contentWidth/contentHeight` に書き戻す。
 * 通常は `relayoutContainer` 経由で呼ばれる。
 *
 * @param components 計測対象の子コンポーネント列。
 * @param parent 計測の基準となる親 (rawWidth と padding を参照する)。
 * @returns `parent.id` 宛ての content サイズパッチ。
 */
export function measureFlowSequence(components: Component[], parent: Component): MeasurePatch {
  let verticalMargin = getPaddingTop(parent)
  const contentWidth = parent.rawWidth || 0
  const contentHeight = chunkBy(components, testIfComponentsOverflow(createFlowOverflowContext(contentWidth, parent)))
    .filter((row) => row.length > 0)
    .reduce((height: number, row: Component[]) => {
      const component = maxBy(row, (col) => getLayoutHeight(col))!
      if (getPosition(component) === 'absolute') {
        return height
      }
      const verticalSpace = Math.max(verticalMargin, getMarginTop(component)) + height
      verticalMargin = getMarginBottom(component)
      return verticalSpace + getHeight(component)
    }, 0) + Math.max(verticalMargin, getPaddingBottom(parent))

  return {
    id: parent.id,
    contentWidth,
    contentHeight,
  }
}

/**
 * verticalBox レイアウトの子配置パッチを計算する低レベル API。
 *
 * 子要素を縦方向に積み上げ、`justifyContent` (左右整列) と `alignItems` (上下分配) を
 * 適用した最終 x/y を `ArrangePatch[]` として返す。`position: 'absolute'` の子は
 * 親原点基準で別途配置し、カーソルを進めない。
 * 通常は `relayoutContainer` 経由で呼ばれる。
 *
 * @param components 配置対象の子コンポーネント列。
 * @param parent 配置の基準となる親 (padding と整列スタイルを参照する)。
 * @returns `components` と同じ並びの配置パッチ列。
 */
export function arrangeVerticalBoxSequence(components: Component[], parent: Component): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let verticalMargin = getPaddingTop(parent)

  components.reduce((height: number, component: Component) => {
    const leftSpace = Math.max(getPaddingLeft(parent), getMarginLeft(component))
    const rightSpace = Math.max(getPaddingRight(parent), getMarginRight(component))
    let verticalSpace = Math.max(verticalMargin, getMarginTop(component)) + height
    let x = getOriginX(parent) + leftSpace
    switch (getJustifyContent(parent)) {
      case 'center':
        x += (getWidth(parent) - leftSpace - rightSpace - getWidth(component)) / 2
        break
      case 'right':
        x += getWidth(parent) - leftSpace - rightSpace - getWidth(component)
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

/**
 * verticalBox レイアウトの contentWidth/contentHeight を計算する低レベル API。
 *
 * `contentHeight` は子要素の高さと縦マージン/パディングの累積、
 * `contentWidth` は最も広い子要素の幅 + 左右オフセット (margin と padding の大きい方)
 * から算出する。`position: 'absolute'` の子は累積から除外する。
 * 通常は `relayoutContainer` 経由で呼ばれる。
 *
 * @param components 計測対象の子コンポーネント列。
 * @param parent 計測の基準となる親 (padding を参照する)。
 * @returns `parent.id` 宛ての content サイズパッチ。
 */
export function measureVerticalBoxSequence(components: Component[], parent: Component): MeasurePatch {
  let verticalMargin = getPaddingTop(parent)
  const contentHeight = components.reduce((height: number, component: Component) => {
    const verticalSpace = Math.max(verticalMargin, getMarginTop(component)) + height
    if (getPosition(component) === 'absolute') {
      return height
    }
    verticalMargin = getMarginBottom(component)
    return verticalSpace + getHeight(component)
  }, 0) + Math.max(verticalMargin, getPaddingBottom(parent))
  const widestComponent = maxBy(components, (component) => getLayoutWidth(component))

  return {
    id: parent.id,
    contentHeight,
    ...(widestComponent
      ? {
          contentWidth: getWidth(widestComponent) +
            Math.max(getMarginLeft(widestComponent), getPaddingLeft(parent)) +
            Math.max(getMarginRight(widestComponent), getPaddingRight(parent)),
        }
      : {}),
  }
}

/**
 * horizontalBox レイアウトの子配置パッチを計算する低レベル API。
 *
 * 子要素を横方向に並べ、`justifyContent` (左右分配) と `alignItems` (上下整列) を
 * 適用した最終 x/y を `ArrangePatch[]` として返す。`position: 'absolute'` の子は
 * 親原点基準で別途配置し、カーソルを進めない。
 * 通常は `relayoutContainer` 経由で呼ばれる。
 *
 * @param components 配置対象の子コンポーネント列。
 * @param parent 配置の基準となる親 (padding と整列スタイルを参照する)。
 * @returns `components` と同じ並びの配置パッチ列。
 */
export function arrangeHorizontalBoxSequence(components: Component[], parent: Component): ArrangePatch[] {
  const patches: ArrangePatch[] = []
  let horizontalMargin = getPaddingLeft(parent)

  components.reduce((width: number, component: Component) => {
    let horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + width
    const verticalSpace = Math.max(getPaddingTop(parent), getMarginTop(component))
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
    patches.push(getPosition(component) === 'absolute'
      ? placeComponent(component, getOriginX(parent), getOriginY(parent), parent)
      : placeComponent(component, x, y, parent))
    if (getPosition(component) === 'absolute') {
      return width
    }
    horizontalMargin = getMarginRight(component)
    return horizontalSpace + getWidth(component)
  }, 0)

  return patches
}

/**
 * horizontalBox レイアウトの contentWidth/contentHeight を計算する低レベル API。
 *
 * `contentWidth` は子要素の幅と横マージン/パディングの累積、
 * `contentHeight` は最も高い子要素の高さ + 上下オフセット (margin と padding の大きい方)
 * から算出する。`position: 'absolute'` の子は累積から除外する。
 * 通常は `relayoutContainer` 経由で呼ばれる。
 *
 * @param components 計測対象の子コンポーネント列。
 * @param parent 計測の基準となる親 (padding を参照する)。
 * @returns `parent.id` 宛ての content サイズパッチ。
 */
export function measureHorizontalBoxSequence(components: Component[], parent: Component): MeasurePatch {
  let horizontalMargin = getPaddingLeft(parent)
  const contentWidth = components.reduce((width: number, component: Component) => {
    if (getPosition(component) === 'absolute') {
      return width
    }
    const horizontalSpace = Math.max(horizontalMargin, getMarginLeft(component)) + width
    horizontalMargin = getMarginRight(component)
    return horizontalSpace + getWidth(component)
  }, 0) + Math.max(horizontalMargin, getPaddingRight(parent))
  const tallestComponent = maxBy(components, (component: Component) => getLayoutHeight(component))

  return {
    id: parent.id,
    contentWidth,
    ...(tallestComponent
      ? {
          contentHeight: getHeight(tallestComponent) +
            Math.max(getMarginTop(tallestComponent), getPaddingTop(parent)) +
            Math.max(getMarginBottom(tallestComponent), getPaddingBottom(parent)),
        }
      : {}),
  }
}
