import * as _ from 'lodash'
import Component, { ComponentConstructor, IComponent } from './component'

export interface IContainer {
  components: IComponent[]
  addComponent (component: IComponent): void
  find (id: string): IComponent | undefined
}

export type ContainerConstructor = new (...args: any[]) => IContainer

export default function Container<T extends ComponentConstructor> (base: T): T & ContainerConstructor {
  return class extends base implements IContainer {
    public components: IComponent[]

    public addComponent (component: IComponent) {
      this.components.push(component)
    }

    public find (id: string) {
      return _.find(this.components, (value, key) => value.id === id)
    }
  }
}
