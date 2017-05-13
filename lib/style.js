"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function isMarginOrPadding(name, value) {
    return name === 'margin' || name === 'padding';
}
var Style = (function () {
    function Style(style) {
        var _this = this;
        this.position = 'relative';
        this.top = null;
        this.left = null;
        this.bottom = null;
        this.right = null;
        this.width = null;
        this.height = null;
        this.layout = 'flow';
        this.justifyContent = 'left';
        this.alignItems = 'top';
        this.breakAfter = false;
        this.visible = true;
        this.horizontalItemArrangement = 'real';
        this.verticalItemArrangement = 'real';
        this._margin = [0, 0, 0, 0];
        this._padding = [0, 0, 0, 0];
        _.each(style, function (value, name) {
            if (isMarginOrPadding(name, value)) {
                if (name === 'margin') {
                    _this.setMargin.apply(_this, value);
                }
                else {
                    _this.setPadding.apply(_this, value);
                }
            }
            else if (name !== 'margin' && name !== 'padding') {
                _this[name] = value;
            }
        });
    }
    Object.defineProperty(Style.prototype, "margin", {
        get: function () {
            return this._margin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginTop", {
        get: function () {
            return this._margin[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginRight", {
        get: function () {
            return this._margin[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginBottom", {
        get: function () {
            return this._margin[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "marginLeft", {
        get: function () {
            return this._margin[3];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingTop", {
        get: function () {
            return this._padding[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingRight", {
        get: function () {
            return this._padding[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingBottom", {
        get: function () {
            return this._padding[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Style.prototype, "paddingLeft", {
        get: function () {
            return this._padding[3];
        },
        enumerable: true,
        configurable: true
    });
    Style.prototype.setMargin = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
    };
    Style.prototype.setPadding = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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
    };
    return Style;
}());
exports.default = Style;
