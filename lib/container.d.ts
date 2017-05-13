import { ComponentConstructor, IComponent } from './component';
export interface IContainer extends Iterable<IComponent> {
    components: IComponent[];
    addComponent(component: IComponent): void;
    find(id: string): IComponent;
}
export declare type ContainerConstructor = new (...args: any[]) => IContainer;
export default function Container<T extends ComponentConstructor>(base: T): T & ContainerConstructor;
