/// <reference path="../typings/index.d.ts" />
import Component, { ISizeMeasurable } from './component';
import { ContainerComponentConstructor, IContainer } from './container';
import './lodash-chunk_by';
export interface ILayouter {
    resizeComponents(parent: ISizeMeasurable): void;
    moveComponents(ox: number, oy: number, parent: ISizeMeasurable): void;
}
export declare type LayouterContainerComponentConstructor = new (...args: any[]) => Component & IContainer & ILayouter;
export default function Layouter<T extends ContainerComponentConstructor>(base: T): LayouterContainerComponentConstructor;
