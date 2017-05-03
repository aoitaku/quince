/// <reference path="../typings/index.d.ts" />
import { IComponent, ISizeMeasurable } from './component';
import { ContainerConstructor, IContainer } from './container';
import './lodash-chunk_by';
export interface ILayouter {
    resizeComponents(parent: ISizeMeasurable): void;
    moveComponents(ox: number, oy: number, parent: ISizeMeasurable): void;
}
export declare type LayouterConstructor = new (...args: any[]) => IComponent & IContainer & ILayouter;
export default function Layouter<T extends ContainerConstructor>(base: T): LayouterConstructor;
