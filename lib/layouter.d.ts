/// <reference path="../typings/index.d.ts" />
import { IComponent, ISizeMeasurable } from './component';
import { ContainerConstructor, IContainer } from './container';
import './lodash-chunk_by';
export interface ILayouter {
    resizeComponents(parent: ISizeMeasurable): void;
    moveComponents(ox: number, oy: number, parent: ISizeMeasurable): void;
}
export declare type IContainerComponent = IComponent & IContainer;
export declare type LayouterConstructor<T> = new (...args: any[]) => T & ILayouter;
export default function Layouter<T extends ContainerConstructor<IContainerComponent>>(base: T): LayouterConstructor<IContainerComponent>;
