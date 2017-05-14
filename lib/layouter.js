"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
require("./lodash-chunk_by");
function Layouter(base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.resize = function (parent) {
            _super.prototype.resize.call(this, parent);
            switch (this.layout) {
                case 'flow':
                    this.resizeComponentsForFlowLayout(parent);
                    break;
                case 'horizontalBox':
                    this.resizeComponentsForHorizontalBox(parent);
                    break;
                case 'verticalBox':
                    this.resizeComponentsForVerticalBox(parent);
                    break;
                default:
                    break;
            }
        };
        class_1.prototype.move = function (ox, oy, parent) {
            if (ox === void 0) { ox = 0; }
            if (oy === void 0) { oy = 0; }
            _super.prototype.move.call(this, ox, oy, parent);
            switch (this.layout) {
                case 'flow':
                    this.moveComponentsForFlowLayout(ox, oy, parent);
                    break;
                case 'horizontalBox':
                    this.moveComponentsForHorizontalBox(ox, oy, parent);
                    break;
                case 'verticalBox':
                    this.moveComponentsForVerticalBox(ox, oy, parent);
                    break;
                default:
                    break;
            }
        };
        Object.defineProperty(class_1.prototype, "testIfComponentsOverflow", {
            get: function () {
                var _this = this;
                var horizontalMargin = this.paddingLeft;
                var width = 0;
                var maxWidth = this.contentWidth;
                var forceBreak = false;
                return function (component) {
                    if (component.position === 'absolute') {
                        return false;
                    }
                    var horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + component.width;
                    if (forceBreak) {
                        forceBreak = component.breakAfter;
                        width = horizontalSpace;
                        horizontalMargin = _this.paddingLeft;
                        return true;
                    }
                    else {
                        forceBreak = component.breakAfter;
                    }
                    var expectedWidth = width + component.layoutWidth + _this.paddingLeft + _this.paddingRight;
                    if (width > 0 && expectedWidth > maxWidth) {
                        width = horizontalSpace;
                        horizontalMargin = _this.paddingLeft;
                        return true;
                    }
                    else {
                        width += horizontalSpace;
                        horizontalMargin = component.marginRight;
                        return false;
                    }
                };
            },
            enumerable: true,
            configurable: true
        });
        class_1.prototype.evaluateRowWidth = function (withExtraCalcuration) {
            var horizontalMargin = this.paddingLeft;
            return function (width, component) {
                var horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                if (withExtraCalcuration) {
                    horizontalSpace = withExtraCalcuration(component, horizontalSpace);
                }
                if (component.position === 'absolute') {
                    return width;
                }
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            };
        };
        class_1.prototype.resizeComponentsForFlowLayout = function (parent) {
            var _this = this;
            var verticalMargin = this.paddingTop;
            this.contentWidth = this.rawWidth;
            this.contentHeight = _.reduce(_.chunkBy(_.forEach(this.components, function (component) {
                component.resize(_this);
            }), this.testIfComponentsOverflow), function (height, row) {
                var component = _.maxBy(row, function (col) { return col.layoutHeight; });
                if (component.position === 'absolute') {
                    return height;
                }
                var verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0) + Math.max(verticalMargin, this.paddingBottom);
        };
        class_1.prototype.moveComponentsForFlowLayout = function (ox, oy, parent) {
            var _this = this;
            if (ox === void 0) { ox = 0; }
            if (oy === void 0) { oy = 0; }
            var verticalMargin = this.paddingTop;
            return _.reduce(_.chunkBy(this.components, this.testIfComponentsOverflow), function (height, row) {
                var tallestComponent = _.maxBy(row, function (col) { return col.layoutHeight; });
                var maxComponentHeight = tallestComponent.height;
                var verticalSpace = Math.max(verticalMargin, tallestComponent.marginTop) + height;
                verticalMargin = tallestComponent.marginBottom;
                var innerWidth = _.reduce(row, _this.evaluateRowWidth(), 0) + Math.max(_.last(row).marginRight, _this.paddingRight);
                _.reduce(row, _this.evaluateRowWidth(function (component, horizontalSpace) {
                    var x = _this.x + horizontalSpace;
                    switch (_this.justifyContent) {
                        case 'spaceBetween':
                            if (row.length > 1 && !_.last(row).breakAfter) {
                                horizontalSpace += (_this.width - innerWidth) / (row.length - 1.0);
                            }
                            break;
                        case 'center':
                            x += (_this.width - innerWidth) / 2.0;
                            break;
                        case 'right':
                            x += (_this.width - innerWidth);
                            break;
                    }
                    var y = _this.y + verticalSpace;
                    switch (_this.alignItems) {
                        case 'center':
                            y += (maxComponentHeight - component.height) / 2.0;
                            break;
                        case 'bottom':
                            y += (maxComponentHeight - component.height);
                            break;
                    }
                    if (component.position === 'absolute') {
                        component.move(_this.x, _this.y, _this);
                    }
                    else {
                        component.move(x, y, _this);
                    }
                    return horizontalSpace;
                }), 0);
                return verticalSpace + maxComponentHeight;
            }, 0);
        };
        class_1.prototype.resizeComponentsForVerticalBox = function (parent) {
            var _this = this;
            var verticalMargin = this.paddingTop;
            this.contentHeight = _.reduce(this.components, function (height, component) {
                var verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                component.resize(_this);
                if (component.position === 'absolute') {
                    return height;
                }
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0) + Math.max(verticalMargin, this.paddingBottom);
            var widestComponent = _.maxBy(this.components, function (component) { return component.layoutWidth; });
            if (widestComponent) {
                this.contentWidth = widestComponent.width +
                    Math.max(widestComponent.marginLeft, this.paddingLeft) +
                    Math.max(widestComponent.marginRight, this.paddingRight);
            }
        };
        class_1.prototype.moveComponentsForVerticalBox = function (ox, oy, parent) {
            var _this = this;
            if (ox === void 0) { ox = 0; }
            if (oy === void 0) { oy = 0; }
            var verticalMargin = this.paddingTop;
            _.reduce(this.components, function (height, component) {
                var horizontalSpace = Math.max(_this.paddingLeft, component.marginLeft);
                var verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                var x = _this.x + horizontalSpace;
                switch (_this.justifyContent) {
                    case 'center':
                        x += (component.innerWidth(_this) - component.width) / 2;
                        break;
                    case 'right':
                        x += (component.innerWidth(_this) - component.width);
                        break;
                }
                var y = _this.y + verticalSpace;
                switch (_this.alignItems) {
                    case 'spaceBetween':
                        if (_this.rawHeight && _this.components.length > 1) {
                            verticalSpace += (_this.rawHeight - _this.contentHeight) / (_this.components.length - 1);
                        }
                        break;
                    case 'center':
                        y += (_this.rawHeight ? (_this.rawHeight - _this.contentHeight) / 2 : 0);
                        break;
                    case 'bottom':
                        y += (_this.rawHeight ? _this.rawHeight - _this.contentHeight : 0);
                        break;
                }
                if (component.position === 'absolute') {
                    component.move(_this.x, _this.y, _this);
                }
                else {
                    component.move(x, y, _this);
                }
                if (component.position === 'absolute') {
                    return height;
                }
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0);
        };
        class_1.prototype.resizeComponentsForHorizontalBox = function (parent) {
            var _this = this;
            var horizontalMargin = this.paddingLeft;
            this.contentWidth = _.reduce(this.components, function (width, component) {
                component.resize(_this);
                if (component.position === 'absolute') {
                    return width;
                }
                var horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            }, 0) + Math.max(horizontalMargin, this.paddingRight);
            var tallestComponent = _.maxBy(this.components, function (component) { return component.layoutHeight; });
            if (tallestComponent) {
                this.contentHeight = tallestComponent.height +
                    Math.max(tallestComponent.marginTop, this.paddingTop) +
                    Math.max(tallestComponent.marginBottom, this.paddingBottom);
            }
        };
        class_1.prototype.moveComponentsForHorizontalBox = function (ox, oy, parent) {
            var _this = this;
            if (ox === void 0) { ox = 0; }
            if (oy === void 0) { oy = 0; }
            var horizontalMargin = this.paddingLeft;
            _.reduce(this.components, function (width, component) {
                var horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                var verticalSpace = Math.max(_this.paddingTop, component.marginTop);
                var x = _this.x + horizontalSpace;
                switch (_this.justifyContent) {
                    case 'spaceBetween':
                        if (_this.rawWidth && _this.components.length > 1) {
                            horizontalSpace += (_this.rawWidth - _this.contentWidth) / (_this.components.length - 1);
                        }
                        break;
                    case 'center':
                        x += (_this.rawWidth ? (_this.rawWidth - _this.contentWidth) / 2 : 0);
                        break;
                    case 'right':
                        x += (_this.rawWidth ? _this.rawWidth - _this.contentWidth : 0);
                        break;
                }
                var y = _this.y + verticalSpace;
                switch (_this.alignItems) {
                    case 'center':
                        y += (component.innerHeight(_this) - component.height) / 2;
                        break;
                    case 'bottom':
                        y += component.innerHeight(_this) - component.height;
                        break;
                }
                if (component.position === 'absolute') {
                    component.move(_this.x, _this.y, _this);
                }
                else {
                    component.move(x, y, _this);
                }
                if (component.position === 'absolute') {
                    return width;
                }
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            }, 0);
        };
        return class_1;
    }(base));
}
exports.default = Layouter;
