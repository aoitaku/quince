/// <reference path="../typings/index.d.ts" />
import Component, { ComponentConstructor } from './component';
export interface IContainer extends Iterable<Component> {
    components: Component[];
    addComponent(component: Component): void;
    find(id: string): Component;
}
export declare type ContainerComponentConstructor = new (...args: any[]) => Component & IContainer;
export default function Container<T extends ComponentConstructor>(base: T): ContainerComponentConstructor;
