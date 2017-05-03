import Component, { IComponent } from './component';
import { IContainer } from './container';
import { ILayouter } from './layouter';
export declare type IComponent = IComponent;
export declare type IContainer = IContainer;
export declare type ILayouter = ILayouter;
declare var _default: {
    Component: typeof Component;
    Container: <T extends new (...args: any[]) => IComponent>(base: T) => new (...args: any[]) => IComponent & IContainer;
    Layouter: <T extends new (...args: any[]) => IComponent & IContainer>(base: T) => new (...args: any[]) => IComponent & IContainer & ILayouter;
};
export default _default;
