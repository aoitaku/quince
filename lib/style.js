"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function isMarginOrPadding(name, value) {
    return name === 'margin' || name === 'padding';
}
class Style {
    constructor(style) {
        this.position = 'relative';
        this.top = undefined;
        this.left = undefined;
        this.bottom = undefined;
        this.right = undefined;
        this.width = undefined;
        this.height = undefined;
        this.layout = 'flow';
        this.justifyContent = 'left';
        this.alignItems = 'top';
        this.breakAfter = false;
        this.visible = true;
        this.horizontalItemArrangement = 'real';
        this.verticalItemArrangement = 'real';
        this._margin = [0, 0, 0, 0];
        this._padding = [0, 0, 0, 0];
        if (!style) {
            return;
        }
        _.each(style, (value, name) => {
            if (isMarginOrPadding(name, value)) {
                if (name === 'margin') {
                    if (value) {
                        this.setMargin(...value);
                    }
                }
                else {
                    if (value) {
                        this.setPadding(...value);
                    }
                }
            }
            else if (name !== 'margin' && name !== 'padding') {
                this[name] = value;
            }
        });
    }
    get margin() {
        return this._margin;
    }
    get marginTop() {
        return this._margin[0];
    }
    get marginRight() {
        return this._margin[1];
    }
    get marginBottom() {
        return this._margin[2];
    }
    get marginLeft() {
        return this._margin[3];
    }
    get padding() {
        return this._padding;
    }
    get paddingTop() {
        return this._padding[0];
    }
    get paddingRight() {
        return this._padding[1];
    }
    get paddingBottom() {
        return this._padding[2];
    }
    get paddingLeft() {
        return this._padding[3];
    }
    setMargin(...args) {
        switch (args.length) {
            case 4:
                this._margin = [args[0], args[1], args[2], args[3]];
                break;
            case 3:
                this._margin = [args[0], args[1], args[2], args[1]];
                break;
            case 2:
                this._margin = [args[0], args[1], args[0], args[1]];
                break;
            case 1:
                this._margin = [args[0], args[0], args[0], args[0]];
                break;
        }
    }
    setPadding(...args) {
        switch (args.length) {
            case 4:
                this._padding = [args[0], args[1], args[2], args[3]];
                break;
            case 3:
                this._padding = [args[0], args[1], args[2], args[1]];
                break;
            case 2:
                this._padding = [args[0], args[1], args[0], args[1]];
                break;
            case 1:
                this._padding = [args[0], args[0], args[0], args[0]];
                break;
        }
    }
}
exports.default = Style;
