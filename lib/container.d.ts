import { IComponent } from './component';
export interface IContainer {
    components: IComponent[];
    addComponent(component: IComponent): void;
    find(id: string): IComponent | undefined;
}
