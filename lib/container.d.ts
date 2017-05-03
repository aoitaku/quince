/// <reference path="../typings/index.d.ts" />
import { Constructor, IComponent } from './component';
export interface IContainer extends Iterable<IComponent> {
    components: IComponent[];
    addComponent(component: IComponent): void;
    find(id: string): IComponent;
}
export declare type ContainerConstructor<T> = new (...args: any[]) => T & IContainer;
export default function Container<T extends Constructor<IComponent>>(base: T): ContainerConstructor<IComponent>;
