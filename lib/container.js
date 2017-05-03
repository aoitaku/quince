"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../typings/index.d.ts' />
const lodash_1 = require("lodash");
function Container(base) {
    return class extends base {
        addComponent(component) {
            this.components.push(component);
        }
        find(id) {
            return lodash_1.default.find(this.components, (value, key) => value.id === id);
        }
        get [Symbol.iterator]() {
            return this._each;
        }
        *_each() {
            yield this;
            yield* this.components;
        }
    };
}
exports.default = Container;
