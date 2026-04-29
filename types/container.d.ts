import type { Component } from './component';
export type Container = {
    components: Component[];
};
export declare function createContainer(components?: Component[]): Container;
export declare function addComponent(container: Container, component: Component): void;
export declare function findComponent(container: Container, id: string): Component | undefined;
