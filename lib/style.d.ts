/// <reference path="../typings/index.d.ts" />
export default class Style {
    position: 'relative' | 'absolute';
    top: number | null;
    left: number | null;
    bottom: number | null;
    right: number | null;
    width: number | 'full' | null;
    height: number | 'full' | null;
    layout: 'flow' | 'horizontalBox' | 'verticalBox' | null;
    justifyContent: 'left' | 'center' | 'spaceBetween' | 'right' | null;
    alignItems: 'top' | 'center' | 'spaceBetween' | 'bottom' | null;
    breakAfter: boolean;
    visible: boolean;
    private _margin;
    private _padding;
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
    setMargin(margin: number, rightOrHorizontal?: number, bottom?: number, left?: number): void;
    setPadding(padding: number, rightOrHorizontal?: number, bottom?: number, left?: number): void;
}
