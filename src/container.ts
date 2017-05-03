/// <reference path='../typings/index.d.ts' />
import _ from 'lodash'
import Component, { Constructor, IComponent } from './component'

export interface IContainer extends Iterable<IComponent> {
  components: IComponent[]
  addComponent (component: IComponent): void
  find (id: string): IComponent
}

export type ContainerConstructor<T> = new (...args: any[]) => T & IContainer

export default function Container<T extends Constructor<IComponent>> (base: T): ContainerConstructor<IComponent> {
  return class extends base implements IContainer {
    public components: IComponent[]

    public addComponent (component: IComponent) {
      this.components.push(component)
    }

    public find (id: string) {
      return _.find(this.components, (value, key) => value.id === id)
    }

    get [Symbol.iterator] () {
      return this._each
    }

    private *_each () {
      yield this
      yield* this.components
    }
  }
}
