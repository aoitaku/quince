import { IComponent, ISizeMeasurable } from './component';
import { IContainer } from './container';
import './lodash-chunk_by';
export interface ILayouter {
    layouter: Layouter;
    resize(parent: ISizeMeasurable): void;
    move(ox: number, oy: number, parent: ISizeMeasurable): void;
}
export declare class Layouter {
    resize(component: IComponent & IContainer, parent: ISizeMeasurable): void;
    move(component: IComponent & IContainer, ox: number | undefined, oy: number | undefined, parent: ISizeMeasurable): void;
    private testIfComponentsOverflow(component);
    private evaluateRowWidth(component, withExtraCalcuration?);
    private resizeComponentsForFlowLayout(component, parent);
    private moveComponentsForFlowLayout(component, ox, oy, parent);
    private resizeComponentsForVerticalBox(component, parent);
    private moveComponentsForVerticalBox(component, ox, oy, parent);
    private resizeComponentsForHorizontalBox(component, parent);
    private moveComponentsForHorizontalBox(component, ox, oy, parent);
}
