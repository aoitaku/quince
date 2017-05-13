"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var style_1 = require("./style");
var Component = (function () {
    function Component(id, style) {
        this.id = id;
        this.style = new style_1.default(style);
    }
    Object.defineProperty(Component.prototype, "x", {
        get: function () {
            return this.rawX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "y", {
        get: function () {
            return this.rawY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "position", {
        get: function () {
            return this.style.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "top", {
        get: function () {
            return this.style.top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "left", {
        get: function () {
            return this.style.left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "bottom", {
        get: function () {
            return this.style.bottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "right", {
        get: function () {
            return this.style.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "layout", {
        get: function () {
            return this.style.layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "justifyContent", {
        get: function () {
            return this.style.justifyContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "alignItems", {
        get: function () {
            return this.style.alignItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "breakAfter", {
        get: function () {
            return this.style.breakAfter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "visible", {
        get: function () {
            return this.style.visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "horizontalItemArrangement", {
        get: function () {
            return this.style.horizontalItemArrangement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "verticalItemArrangement", {
        get: function () {
            return this.style.verticalItemArrangement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "paddingTop", {
        get: function () {
            return this.style.paddingTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "paddingRight", {
        get: function () {
            return this.style.paddingRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "paddingBottom", {
        get: function () {
            return this.style.paddingBottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "paddingLeft", {
        get: function () {
            return this.style.paddingLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "width", {
        get: function () {
            return this.rawWidth || this.contentWidth || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "height", {
        get: function () {
            return this.rawHeight || this.contentHeight || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "layoutWidth", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.width + this.marginLeft + this.marginRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "layoutHeight", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.height + this.marginTop + this.marginBottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "marginTop", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.style.marginTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "marginRight", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.style.marginRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "marginBottom", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.style.marginBottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "marginLeft", {
        get: function () {
            if (this.position === 'absolute') {
                return 0;
            }
            return this.style.marginLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "horizontalMargin", {
        get: function () {
            return this.marginLeft + this.marginRight;
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.offsetLeft = function (parent) {
        return Math.max(parent.paddingLeft, this.marginLeft);
    };
    Component.prototype.offsetRight = function (parent) {
        return Math.max(parent.paddingRight, this.marginRight);
    };
    Component.prototype.horizontalOffset = function (parent) {
        return this.offsetLeft(parent) + this.offsetLeft(parent);
    };
    Component.prototype.testIfComponent = function (obj) {
        return obj instanceof Component;
    };
    Object.defineProperty(Component.prototype, "verticalMargin", {
        get: function () {
            return this.marginTop + this.marginBottom;
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.offsetTop = function (parent) {
        return Math.max(parent.paddingTop, this.marginTop);
    };
    Component.prototype.offsetBottom = function (parent) {
        return Math.max(parent.paddingBottom, this.marginBottom);
    };
    Component.prototype.verticalOffset = function (parent) {
        return this.offsetTop(parent) + this.offsetBottom(parent);
    };
    Component.prototype.innerWidth = function (parent) {
        if (this.testIfComponent(parent)) {
            return parent.width - this.horizontalOffset(parent);
        }
        return parent.width - this.horizontalMargin;
    };
    Component.prototype.innerHeight = function (parent) {
        if (this.testIfComponent(parent)) {
            return parent.height - this.verticalOffset(parent);
        }
        return parent.height - this.verticalMargin;
    };
    Component.prototype.relayout = function (ox, oy, parent) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        this.resize(parent);
        this.move(ox, oy, parent);
    };
    Component.prototype.move = function (toX, toY, parent) {
        this.moveX(toX, parent);
        this.moveY(toY, parent);
    };
    Component.prototype.resize = function (parent) {
        if (this.style.width === 'full') {
            this.rawWidth = this.innerWidth(parent);
        }
        else if (!this.testIfComponent(parent) || parent.verticalItemArrangement === 'real') {
            this.rawWidth = this.style.width;
        }
        else if (parent.verticalItemArrangement === 'ratio') {
            this.rawWidth = this.style.width * parent.width;
        }
        else {
            this.rawWidth = null;
        }
        if (this.style.height === 'full') {
            this.rawHeight = this.innerHeight(parent);
        }
        else if (!this.testIfComponent(parent) || parent.verticalItemArrangement === 'real') {
            this.rawHeight = this.style.height;
        }
        else if (parent.verticalItemArrangement === 'ratio') {
            this.rawHeight = this.style.height * parent.height;
        }
        else {
            this.rawHeight = null;
        }
    };
    Component.prototype.moveX = function (toX, parent) {
        if (this.position === 'absolute') {
            if (this.left && typeof this.left === 'number') {
                if (Number.isInteger(this.left)) {
                    this.rawX = toX + this.left;
                }
                else {
                    this.rawX = toX + (parent.width - this.width) * this.left;
                }
            }
            else if (this.right && typeof this.right === 'number') {
                if (Number.isInteger(this.right)) {
                    this.rawX = toX + parent.width - this.width - this.right;
                }
                else {
                    this.rawX = toX + (parent.width - this.width) * (1 - this.right);
                }
            }
            else {
                this.rawX = toX;
            }
        }
        else {
            if (this.left && typeof this.left === 'number') {
                if (Number.isInteger(this.left)) {
                    this.rawX = toX + this.left;
                }
                else {
                    this.rawX = toX + this.width * this.left;
                }
            }
            else if (this.right && typeof this.right === 'number') {
                if (Number.isInteger(this.right)) {
                    this.rawX = toX - this.right;
                }
                else {
                    this.rawX = toX - this.width * this.right;
                }
            }
            else {
                this.rawX = toX;
            }
        }
    };
    Component.prototype.moveY = function (toY, parent) {
        if (this.position === 'absolute') {
            if (this.top && typeof this.top === 'number') {
                if (Number.isInteger(this.top)) {
                    this.rawY = toY + this.top;
                }
                else {
                    this.rawY = toY + (parent.height - this.height) * this.top;
                }
            }
            else if (this.bottom && typeof this.bottom === 'number') {
                if (Number.isInteger(this.bottom)) {
                    this.rawY = toY + parent.height - this.height - this.bottom;
                }
                else {
                    this.rawY = toY + (parent.height - this.height) * (1 - this.bottom);
                }
            }
            else {
                this.rawY = toY;
            }
        }
        else {
            if (this.top && typeof this.top === 'number') {
                if (Number.isInteger(this.top)) {
                    this.rawY = toY + this.top;
                }
                else {
                    this.rawY = toY + this.height * this.top;
                }
            }
            else if (this.bottom && typeof this.bottom === 'number') {
                if (Number.isInteger(this.bottom)) {
                    this.rawY = toY - this.bottom;
                }
                else {
                    this.rawY = toY - this.height * this.bottom;
                }
            }
            else {
                this.rawY = toY;
            }
        }
    };
    return Component;
}());
exports.default = Component;
