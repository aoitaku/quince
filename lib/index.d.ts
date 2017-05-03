import Component from './component';
import { IContainer } from './container';
import { ILayouter } from './layouter';
declare var _default: {
    Component: typeof Component;
    Container: <T extends new (...args: any[]) => Component>(base: T) => new (...args: any[]) => Component & IContainer;
    Layouter: <T extends new (...args: any[]) => Component & IContainer>(base: T) => new (...args: any[]) => Component & IContainer & ILayouter;
};
export default _default;
