type PositionProperty = {
    position: 'relative' | 'absolute';
};
type TopProperty = {
    top: number;
};
type LeftProperty = {
    left: number;
};
type BottomProperty = {
    bottom: number;
};
type RightProperty = {
    right: number;
};
type WidthProperty = {
    width: number | 'full';
};
type HeightProperty = {
    height: number | 'full';
};
type LayoutProperty = {
    layout: 'flow' | 'horizontalBox' | 'verticalBox';
};
type JustifyContentProperty = {
    justifyContent: 'left' | 'center' | 'spaceBetween' | 'right';
};
type AlignItemsProperty = {
    alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom';
};
type BreakAfterProperty = {
    breakAfter: boolean;
};
type VisibilityProperty = {
    visible: boolean;
};
type HorizontalItemArrangementProperty = {
    horizontalItemArrangement: 'real' | 'ratio';
};
type VerticalItemArrangementProperty = {
    verticalItemArrangement: 'real' | 'ratio';
};
export type AssignableProperties = Partial<PositionProperty> & Partial<TopProperty> & Partial<LeftProperty> & Partial<BottomProperty> & Partial<RightProperty> & Partial<WidthProperty> & Partial<HeightProperty> & Partial<LayoutProperty> & Partial<JustifyContentProperty> & Partial<AlignItemsProperty> & Partial<BreakAfterProperty> & Partial<VisibilityProperty> & Partial<HorizontalItemArrangementProperty> & Partial<VerticalItemArrangementProperty>;
export type BoxSpacing = [number] | [number, number] | [number, number, number] | [number, number, number, number];
export type BoxSpacingEdges = [number, number, number, number];
type MarginProperty = {
    margin: BoxSpacing;
};
type PaddingProperty = {
    padding: BoxSpacing;
};
export type StyleProperties = AssignableProperties & Partial<MarginProperty> & Partial<PaddingProperty>;
export type Style = {
    position: PositionProperty[keyof PositionProperty];
    top?: TopProperty[keyof TopProperty];
    left?: LeftProperty[keyof LeftProperty];
    bottom?: BottomProperty[keyof BottomProperty];
    right?: RightProperty[keyof RightProperty];
    width?: WidthProperty[keyof WidthProperty];
    height?: HeightProperty[keyof HeightProperty];
    layout: LayoutProperty[keyof LayoutProperty];
    justifyContent: JustifyContentProperty[keyof JustifyContentProperty];
    alignItems: AlignItemsProperty[keyof AlignItemsProperty];
    breakAfter: BreakAfterProperty[keyof BreakAfterProperty];
    visible: VisibilityProperty[keyof VisibilityProperty];
    horizontalItemArrangement: HorizontalItemArrangementProperty[keyof HorizontalItemArrangementProperty];
    verticalItemArrangement: VerticalItemArrangementProperty[keyof VerticalItemArrangementProperty];
    margin: BoxSpacingEdges;
    padding: BoxSpacingEdges;
};
export declare function normalizeBoxSpacing(args: BoxSpacing): BoxSpacingEdges;
export declare function createStyle(properties?: StyleProperties): Style;
export declare function setMargin(style: Style, margin: BoxSpacing): Style;
export declare function setPadding(style: Style, padding: BoxSpacing): Style;
export declare function getMarginTop(style: Style): number;
export declare function getMarginRight(style: Style): number;
export declare function getMarginBottom(style: Style): number;
export declare function getMarginLeft(style: Style): number;
export declare function getPaddingTop(style: Style): number;
export declare function getPaddingRight(style: Style): number;
export declare function getPaddingBottom(style: Style): number;
export declare function getPaddingLeft(style: Style): number;
export {};
