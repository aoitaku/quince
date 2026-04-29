import {
  type Component,
  type SizeMeasurable,
  applyMove,
  applyResize,
  getLayout,
  move,
  resize,
} from './component'
import type { Container } from './container'
import {
  arrangeFlowSequence,
  arrangeHorizontalBoxSequence,
  arrangeVerticalBoxSequence,
  type ArrangePatch,
  measureFlowSequence,
  measureHorizontalBoxSequence,
  measureVerticalBoxSequence,
  type MeasurePatch,
} from './sequence'

export type Layoutable = Component & Container

function hasComponents(component: Component): component is Layoutable {
  return 'components' in component && Array.isArray(component.components)
}

function resizeLayoutChild(child: Component, parent: Component) {
  applyResize(child, resize(child, parent))
  if (hasComponents(child)) {
    resizeContainer(child, parent)
  }
}

function applyArrangePatches(component: Layoutable, patches: ArrangePatch[]) {
  component.components.forEach((child, index) => {
    const patch = patches[index]
    applyMove(child, patch)
    if (hasComponents(child)) {
      moveContainer(child, patch.x, patch.y, component)
    }
  })
}

function applyMeasurePatch(component: Layoutable, patch: MeasurePatch) {
  if (patch.contentWidth !== undefined) {
    component.contentWidth = patch.contentWidth
  }
  if (patch.contentHeight !== undefined) {
    component.contentHeight = patch.contentHeight
  }
}

/**
 * Container を含むツリーの子要素を再 resize する。
 *
 * `component` 自身のサイズは更新せず、`component.components` の各子要素について
 * resize を行い、レイアウトに応じた contentWidth/contentHeight を `component` に書き戻す。
 * 通常は {@link relayoutContainer} 経由で呼ばれる。
 *
 * @param component サイズを再計算する対象の Layoutable。
 * @param parent サイズ算出の基準となる親。`width:'full'` などの解決に使う。
 */
export function resizeContainer(component: Layoutable, parent: Component | SizeMeasurable) {
  switch (getLayout(component)) {
    case 'flow':
      resizeComponentsForFlowLayout(component, parent)
      break
    case 'horizontalBox':
      resizeComponentsForHorizontalBox(component, parent)
      break
    case 'verticalBox':
      resizeComponentsForVerticalBox(component, parent)
      break
    default:
      break
  }
}

/**
 * Container を含むツリーの子要素を再配置する。
 *
 * `component` 自身の位置は更新せず、レイアウト種別 (flow/horizontalBox/verticalBox) に応じた
 * sequence を使って各子要素の rawX/rawY を更新する。サイズが既に確定している前提なので、
 * 通常は先に {@link resizeContainer} を呼んだ後、または {@link relayoutContainer} 経由で呼ぶ。
 *
 * @param component 子要素を再配置する対象の Layoutable。
 * @param ox 親原点に対する追加 X オフセット (既定 0)。
 * @param oy 親原点に対する追加 Y オフセット (既定 0)。
 * @param parent 配置の基準となる親。
 */
export function moveContainer(component: Layoutable, ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
  switch (getLayout(component)) {
    case 'flow':
      moveComponentsForFlowLayout(component, ox, oy, parent)
      break
    case 'horizontalBox':
      moveComponentsForHorizontalBox(component, ox, oy, parent)
      break
    case 'verticalBox':
      moveComponentsForVerticalBox(component, ox, oy, parent)
      break
    default:
      break
  }
}

/**
 * Container を含むツリー全体を一括で再レイアウトする利用者向けの入口 API。
 *
 * 内部では resize → {@link resizeContainer} → move → {@link moveContainer} の順で実行し、
 * 自身のサイズと位置、および全子要素のサイズと位置をまとめて確定する。
 * 子を持たない単一 Component に対しては {@link relayout} を使う。
 *
 * @param component 再レイアウト対象のツリー根。
 * @param ox 親原点に対する追加 X オフセット (既定 0)。
 * @param oy 親原点に対する追加 Y オフセット (既定 0)。
 * @param parent サイズ・位置算出の基準となる親または `SizeMeasurable`。
 */
export function relayoutContainer(component: Layoutable, ox: number = 0, oy: number = 0, parent: Component | SizeMeasurable) {
  applyResize(component, resize(component, parent))
  resizeContainer(component, parent)
  applyMove(component, move(component, ox, oy, parent))
  moveContainer(component, ox, oy, parent)
}

function resizeComponentsForFlowLayout(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureFlowSequence(component.components, component))
}

function moveComponentsForFlowLayout(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeFlowSequence(component.components, component))
}

function resizeComponentsForVerticalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureVerticalBoxSequence(component.components, component))
}

function moveComponentsForVerticalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeVerticalBoxSequence(component.components, component))
}

function resizeComponentsForHorizontalBox(component: Layoutable, _parent: Component | SizeMeasurable) {
  component.components.forEach((child) => {
    resizeLayoutChild(child, component)
  })
  applyMeasurePatch(component, measureHorizontalBoxSequence(component.components, component))
}

function moveComponentsForHorizontalBox(
  component: Layoutable,
  _ox: number = 0,
  _oy: number = 0,
  _parent: Component | SizeMeasurable,
) {
  applyArrangePatches(component, arrangeHorizontalBoxSequence(component.components, component))
}
