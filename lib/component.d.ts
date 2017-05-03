import Style from './style';
export interface IWidthMeasurable {
    width: number;
}
export interface IHeightMeasurable {
    height: number;
}
export declare type ISizeMeasurable = IWidthMeasurable & IHeightMeasurable;
export declare type ComponentConstructor = new (...args: any[]) => Component;
export default class Component {
    readonly id: string;
    protected readonly style: Style;
    protected rawX: number;
    protected rawY: number;
    protected rawWidth: number;
    protected rawHeight: number;
    protected contentWidth: number;
    protected contentHeight: number;
    constructor(id: string);
    readonly x: number;
    readonly y: number;
    readonly position: "relative" | "absolute";
    readonly top: number;
    readonly left: number;
    readonly bottom: number;
    readonly right: number;
    readonly layout: "flow" | "horizontalBox" | "verticalBox";
    readonly justifyContent: "center" | "left" | "spaceBetween" | "right";
    readonly alignItems: "center" | "spaceBetween" | "top" | "bottom";
    readonly breakAfter: boolean;
    readonly visible: boolean;
    readonly paddingTop: number;
    readonly paddingRight: number;
    readonly paddingBottom: number;
    readonly paddingLeft: number;
    readonly width: number;
    readonly height: number;
    readonly layoutWidth: number;
    readonly layoutHeight: number;
    readonly marginTop: number;
    readonly marginRight: number;
    readonly marginBottom: number;
    readonly marginLeft: number;
    readonly horizontalMargin: number;
    offsetLeft(parent: Component): number;
    offsetRight(parent: Component): number;
    horizontalOffset(parent: Component): number;
    testIfComponent(obj: any): obj is Component;
    readonly verticalMargin: number;
    offsetTop(parent: Component): number;
    offsetBottom(parent: Component): number;
    verticalOffset(parent: Component): number;
    innerWidth(parent: Component | IWidthMeasurable): number;
    innerHeight(parent: Component | IHeightMeasurable): number;
    relayout(ox: number, oy: number, parent: ISizeMeasurable): void;
    move(toX: number, toY: number, parent: ISizeMeasurable): void;
    moveX(toX: number, parent: ISizeMeasurable): void;
    moveY(toY: number, parent: ISizeMeasurable): void;
    resize(parent: ISizeMeasurable): void;
}
