"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Style {
    constructor() {
        this.position = 'relative';
        this.top = null;
        this.left = null;
        this.bottom = null;
        this.right = null;
        this.width = null;
        this.height = null;
        this.layout = null;
        this.justifyContent = null;
        this.alignItems = null;
        this.breakAfter = false;
        this.visible = true;
        this.horizontalItemArrangement = 'real';
        this.verticalItemArrangement = 'real';
        this._margin = [0, 0, 0, 0];
        this._padding = [0, 0, 0, 0];
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
    setMargin(margin, rightOrHorizontal, bottom, left) {
        if (left) {
            this._margin = [margin, rightOrHorizontal, bottom, left];
        }
        else if (bottom) {
            this._margin = [margin, rightOrHorizontal, bottom, rightOrHorizontal];
        }
        else if (rightOrHorizontal) {
            this._margin = [margin, rightOrHorizontal, margin, rightOrHorizontal];
        }
        else {
            this._margin = [margin, margin, margin, margin];
        }
    }
    setPadding(padding, rightOrHorizontal, bottom, left) {
        if (left) {
            this._padding = [padding, rightOrHorizontal, bottom, left];
        }
        else if (bottom) {
            this._padding = [padding, rightOrHorizontal, bottom, rightOrHorizontal];
        }
        else if (rightOrHorizontal) {
            this._padding = [padding, rightOrHorizontal, padding, rightOrHorizontal];
        }
        else {
            this._padding = [padding, padding, padding, padding];
        }
    }
}
exports.default = Style;
