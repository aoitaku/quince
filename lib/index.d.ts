import Component, { IComponent } from './component';
import { IContainer } from './container';
import { ILayouter } from './layouter';
declare var _default: {
    Component: typeof Component;
    Container: <T extends new (...args: any[]) => IComponent>(base: T) => T & (new (...args: any[]) => IContainer);
    Layouter: <T extends (new (...args: any[]) => IComponent) & (new (...args: any[]) => IContainer)>(base: T) => T & (new (...args: any[]) => ILayouter);
};
export default _default;
export { IComponent } from './component';
export { IContainer } from './container';
export { ILayouter } from './layouter';
