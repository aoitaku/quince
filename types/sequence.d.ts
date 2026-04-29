import { type Component } from './component';
export type ArrangePatch = {
    id: string;
    x: number;
    y: number;
};
export type MeasurePatch = {
    id: string;
    contentWidth?: number;
    contentHeight?: number;
};
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
export declare function arrangeFlowSequence(components: Component[], parent: Component): ArrangePatch[];
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
export declare function measureFlowSequence(components: Component[], parent: Component): MeasurePatch;
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
export declare function arrangeVerticalBoxSequence(components: Component[], parent: Component): ArrangePatch[];
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
export declare function measureVerticalBoxSequence(components: Component[], parent: Component): MeasurePatch;
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
export declare function arrangeHorizontalBoxSequence(components: Component[], parent: Component): ArrangePatch[];
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
export declare function measureHorizontalBoxSequence(components: Component[], parent: Component): MeasurePatch;
