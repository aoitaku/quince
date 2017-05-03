/// <reference path='../typings/index.d.ts' />
import * as _ from 'lodash'
declare module 'lodash' {
  // tslint:disable-next-line:interface-name
  interface LoDashStatic {
    chunkBy <T> (array: T[], predicate: (element: T) => boolean): T[][]
  }
}
_.mixin({
  chunkBy <T> (array: T[], predicate: (element: T) => boolean): T[][] {
    return array.reduce((prev: T[][], current, index) => {
      if (prev.length === 0 || predicate(current)) {
        prev.push([current])
      } else {
        prev[prev.length - 1].push(current)
      }
      return prev
    }, [[]])
  },
}, { chain: false })
