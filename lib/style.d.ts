export interface IAssignableProperties {
    position?: 'relative' | 'absolute';
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number | 'full';
    height?: number | 'full';
    layout?: 'flow' | 'horizontalBox' | 'verticalBox';
    justifyContent?: 'left' | 'center' | 'spaceBetween' | 'right';
    alignItems?: 'top' | 'center' | 'spaceBetween' | 'bottom';
    breakAfter?: boolean;
    visible?: boolean;
    horizontalItemArrangement?: 'real' | 'ratio';
    verticalItemArrangement?: 'real' | 'ratio';
}
export interface IStyleProperties extends IAssignableProperties {
    margin?: [number, number, number, number];
    padding?: [number, number, number, number];
}
export default class Style {
    position: 'relative' | 'absolute';
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number | 'full';
    height?: number | 'full';
    layout: 'flow' | 'horizontalBox' | 'verticalBox';
    justifyContent: 'left' | 'center' | 'spaceBetween' | 'right';
    alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom';
    breakAfter: boolean;
    visible: boolean;
    horizontalItemArrangement: 'real' | 'ratio';
    verticalItemArrangement: 'real' | 'ratio';
    private _margin;
    private _padding;
    constructor(style?: IStyleProperties);
    readonly margin: [number, number, number, number];
    readonly marginTop: number;
    readonly marginRight: number;
    readonly marginBottom: number;
    readonly marginLeft: number;
    readonly padding: [number, number, number, number];
    readonly paddingTop: number;
    readonly paddingRight: number;
    readonly paddingBottom: number;
    readonly paddingLeft: number;
    setMargin(...args: number[]): void;
    setPadding(...args: number[]): void;
}
