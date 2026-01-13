import { Component, SizeMeasurable } from './component';
import { Container } from './container';
export interface Layoutable {
    layouter: Layouter;
    resize(parent: SizeMeasurable): void;
    move(ox: number, oy: number, parent: SizeMeasurable): void;
}
export declare class Layouter {
    resize(component: Component & Container, parent: SizeMeasurable): void;
    move(component: Component & Container, ox: number | undefined, oy: number | undefined, parent: SizeMeasurable): void;
    private testIfComponentsOverflow;
    private evaluateRowWidth;
    private resizeComponentsForFlowLayout;
    private moveComponentsForFlowLayout;
    private resizeComponentsForVerticalBox;
    private moveComponentsForVerticalBox;
    private resizeComponentsForHorizontalBox;
    private moveComponentsForHorizontalBox;
}
