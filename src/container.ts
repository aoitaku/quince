import type { Component } from './component'

export type Container = {
  components: Component[]
}

export function createContainer(components: Component[] = []): Container {
  return {
    components,
  }
}

export function addComponent(container: Container, component: Component) {
  container.components.push(component)
}

export function findComponent(container: Container, id: string) {
  return container.components.find((component) => component.id === id)
}
