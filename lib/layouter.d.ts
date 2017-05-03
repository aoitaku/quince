/// <reference path="../typings/index.d.ts" />
import { ComponentConstructor, ISizeMeasurable } from './component';
import { ContainerConstructor } from './container';
import './lodash-chunk_by';
export interface ILayouter {
    resize(parent: ISizeMeasurable): void;
    move(ox: number, oy: number, parent: ISizeMeasurable): void;
}
export declare type LayouterConstructor = new (...args: any[]) => ILayouter;
export default function Layouter<T extends ComponentConstructor & ContainerConstructor>(base: T): T & LayouterConstructor;
