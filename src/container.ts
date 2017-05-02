/// <reference path='../typings/index.d.ts' />
import _ from 'lodash'
import Component, { ComponentConstructor } from './component'

export interface IContainer extends Iterable<Component> {
  components: Component[]
  addComponent (component: Component): void
  find (id: string): Component
}

export type ContainerComponentConstructor = new (...args: any[]) => Component & IContainer

export default function Container<T extends ComponentConstructor> (base: T): ContainerComponentConstructor {
  return class extends base implements IContainer {
    public components: Component[]

    public addComponent (component: Component) {
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
