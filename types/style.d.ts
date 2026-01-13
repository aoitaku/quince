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
type MarginProperty = {
    margin: [number] | [number, number] | [number, number, number] | [number, number, number, number];
};
type PaddingProperty = {
    padding: [number] | [number, number] | [number, number, number] | [number, number, number, number];
};
export type StyleProperties = AssignableProperties & Partial<MarginProperty> & Partial<PaddingProperty>;
export declare class Style {
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
    private _margin;
    private _padding;
    constructor(style?: StyleProperties);
    get margin(): [number, number, number, number];
    get marginTop(): number;
    get marginRight(): number;
    get marginBottom(): number;
    get marginLeft(): number;
    get padding(): [number, number, number, number];
    get paddingTop(): number;
    get paddingRight(): number;
    get paddingBottom(): number;
    get paddingLeft(): number;
    setMargin(args: MarginProperty[keyof MarginProperty]): void;
    setPadding(args: PaddingProperty[keyof PaddingProperty]): void;
}
export {};
