"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function Container(base) {
    return class extends base {
        addComponent(component) {
            this.components.push(component);
        }
        find(id) {
            return _.find(this.components, (value, key) => value.id === id);
        }
    };
}
exports.default = Container;
