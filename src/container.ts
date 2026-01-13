import { Component } from './component'

export interface Container {
  components: Component[]
  addComponent (component: Component): void
  find (id: string): Component | undefined
}
