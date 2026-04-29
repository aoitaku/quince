import { type Style, type StyleProperties } from './style';
export type WidthMeasurable = {
    width: number;
};
export type HeightMeasurable = {
    height: number;
};
export type SizeMeasurable = WidthMeasurable & HeightMeasurable;
export type Component = {
    id: string;
    rawX: number | undefined;
    rawY: number | undefined;
    rawWidth: number | undefined;
    rawHeight: number | undefined;
    contentWidth: number | undefined;
    contentHeight: number | undefined;
    style: Style;
};
export type MovePatch = {
    x: number;
    y: number;
};
export type ResizePatch = {
    width: number;
    height: number;
};
export declare function createComponent(id: string, style?: StyleProperties): Component;
export declare function getX(component: Component): number | undefined;
export declare function getY(component: Component): number | undefined;
export declare function getPosition(component: Component): "relative" | "absolute";
export declare function getTop(component: Component): number;
export declare function getLeft(component: Component): number;
export declare function getBottom(component: Component): number;
export declare function getRight(component: Component): number;
export declare function getLayout(component: Component): "flow" | "horizontalBox" | "verticalBox";
export declare function getJustifyContent(component: Component): "left" | "center" | "spaceBetween" | "right";
export declare function getAlignItems(component: Component): "center" | "spaceBetween" | "top" | "bottom";
export declare function getBreakAfter(component: Component): boolean;
export declare function getVisible(component: Component): boolean;
export declare function getHorizontalItemArrangement(component: Component): "real" | "ratio";
export declare function getVerticalItemArrangement(component: Component): "real" | "ratio";
export declare function getPaddingTop(component: Component): number;
export declare function getPaddingRight(component: Component): number;
export declare function getPaddingBottom(component: Component): number;
export declare function getPaddingLeft(component: Component): number;
export declare function getWidth(component: Component | WidthMeasurable): number;
export declare function getHeight(component: Component | HeightMeasurable): number;
export declare function getLayoutWidth(component: Component): number;
export declare function getLayoutHeight(component: Component): number;
export declare function getMarginTop(component: Component): number;
export declare function getMarginRight(component: Component): number;
export declare function getMarginBottom(component: Component): number;
export declare function getMarginLeft(component: Component): number;
export declare function getHorizontalMargin(component: Component): number;
export declare function getOffsetLeft(component: Component, parent: Component): number;
export declare function getOffsetRight(component: Component, parent: Component): number;
export declare function getHorizontalOffset(component: Component, parent: Component): number;
export declare function getVerticalMargin(component: Component): number;
export declare function getOffsetTop(component: Component, parent: Component): number;
export declare function getOffsetBottom(component: Component, parent: Component): number;
export declare function getVerticalOffset(component: Component, parent: Component): number;
export declare function getInnerWidth(component: Component, parent: Component | WidthMeasurable): number;
export declare function getInnerHeight(component: Component, parent: Component | HeightMeasurable): number;
export declare function testIfComponent(obj: Component | WidthMeasurable | HeightMeasurable | SizeMeasurable): obj is Component;
/**
 * 子を持たない単一 Component の resize + move を一括実行する。
 *
 * 内部では {@link resize} の結果を {@link applyResize}、{@link move} の結果を
 * {@link applyMove} に渡し、自身の rawWidth/rawHeight/rawX/rawY を確定する。
 * Container を含むツリーには `relayoutContainer` を使う。
 *
 * @param component 再レイアウト対象。
 * @param ox 親原点に対する追加 X オフセット (既定 0)。
 * @param oy 親原点に対する追加 Y オフセット (既定 0)。
 * @param parent サイズ・位置算出の基準となる親または `SizeMeasurable`。
 */
export declare function relayout(component: Component, ox: number | undefined, oy: number | undefined, parent: Component | SizeMeasurable): void;
export declare function move(component: Component, toX: number, toY: number, parent: Component | SizeMeasurable): MovePatch;
export declare function resize(component: Component, parent: Component | SizeMeasurable): ResizePatch;
export declare function applyMove(component: Component, patch: MovePatch): void;
export declare function applyResize(component: Component, patch: ResizePatch): void;
export declare function calculateResizeWidth(component: Component, parent: Component | SizeMeasurable): number;
export declare function calculateResizeHeight(component: Component, parent: Component | SizeMeasurable): number;
export declare function calculateMoveX(component: Component, toX: number, parent: Component | SizeMeasurable): number;
export declare function calculateMoveY(component: Component, toY: number, parent: Component | SizeMeasurable): number;
