import { type Component, type SizeMeasurable } from './component';
import type { Container } from './container';
export type Layoutable = Component & Container;
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
export declare function resizeContainer(component: Layoutable, parent: Component | SizeMeasurable): void;
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
export declare function moveContainer(component: Layoutable, ox: number | undefined, oy: number | undefined, parent: Component | SizeMeasurable): void;
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
export declare function relayoutContainer(component: Layoutable, ox: number | undefined, oy: number | undefined, parent: Component | SizeMeasurable): void;
