"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
require("./lodash-chunk_by");
var Layouter = (function () {
    function Layouter() {
    }
    Layouter.prototype.resize = function (component, parent) {
        switch (component.layout) {
            case 'flow':
                this.resizeComponentsForFlowLayout(component, parent);
                break;
            case 'horizontalBox':
                this.resizeComponentsForHorizontalBox(component, parent);
                break;
            case 'verticalBox':
                this.resizeComponentsForVerticalBox(component, parent);
                break;
            default:
                break;
        }
    };
    Layouter.prototype.move = function (component, ox, oy, parent) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        switch (component.layout) {
            case 'flow':
                this.moveComponentsForFlowLayout(component, ox, oy, parent);
                break;
            case 'horizontalBox':
                this.moveComponentsForHorizontalBox(component, ox, oy, parent);
                break;
            case 'verticalBox':
                this.moveComponentsForVerticalBox(component, ox, oy, parent);
                break;
            default:
                break;
        }
    };
    Layouter.prototype.testIfComponentsOverflow = function (component) {
        var horizontalMargin = component.paddingLeft;
        var width = 0;
        var maxWidth = component.contentWidth;
        var forceBreak = false;
        return function (child) {
            if (child.position === 'absolute') {
                return false;
            }
            var horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + child.width;
            if (forceBreak) {
                forceBreak = child.breakAfter;
                width = horizontalSpace;
                horizontalMargin = component.paddingLeft;
                return true;
            }
            else {
                forceBreak = child.breakAfter;
            }
            var expectedWidth = width + child.layoutWidth + component.paddingLeft + component.paddingRight;
            if (width > 0 && expectedWidth > maxWidth) {
                width = horizontalSpace;
                horizontalMargin = component.paddingLeft;
                return true;
            }
            else {
                width += horizontalSpace;
                horizontalMargin = child.marginRight;
                return false;
            }
        };
    };
    Layouter.prototype.evaluateRowWidth = function (component, withExtraCalcuration) {
        var horizontalMargin = component.paddingLeft;
        return function (width, child) {
            var horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width;
            if (withExtraCalcuration) {
                horizontalSpace = withExtraCalcuration(child, horizontalSpace);
            }
            if (child.position === 'absolute') {
                return width;
            }
            horizontalMargin = child.marginRight;
            return horizontalSpace + child.width;
        };
    };
    Layouter.prototype.resizeComponentsForFlowLayout = function (component, parent) {
        var verticalMargin = component.paddingTop;
        component.contentWidth = component.rawWidth;
        component.contentHeight = _.reduce(_.chunkBy(_.forEach(component.components, function (child) {
            child.resize(component);
        }), this.testIfComponentsOverflow(component)), function (height, row) {
            var child = _.maxBy(row, function (col) { return col.layoutHeight; });
            if (child.position === 'absolute') {
                return height;
            }
            var verticalSpace = Math.max(verticalMargin, child.marginTop) + height;
            verticalMargin = child.marginBottom;
            return verticalSpace + child.height;
        }, 0) + Math.max(verticalMargin, component.paddingBottom);
    };
    Layouter.prototype.moveComponentsForFlowLayout = function (component, ox, oy, parent) {
        var _this = this;
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        var verticalMargin = component.paddingTop;
        return _.reduce(_.chunkBy(component.components, this.testIfComponentsOverflow(component)), function (height, row) {
            var tallestComponent = _.maxBy(row, function (col) { return col.layoutHeight; });
            var maxComponentHeight = tallestComponent.height;
            var verticalSpace = Math.max(verticalMargin, tallestComponent.marginTop) + height;
            verticalMargin = tallestComponent.marginBottom;
            var innerWidth = _.reduce(row, _this.evaluateRowWidth(component), 0) + Math.max(_.last(row).marginRight, component.paddingRight);
            _.reduce(row, _this.evaluateRowWidth(component, function (child, horizontalSpace) {
                var x = component.x + horizontalSpace;
                switch (component.justifyContent) {
                    case 'spaceBetween':
                        if (row.length > 1 && !_.last(row).breakAfter) {
                            horizontalSpace += (component.width - innerWidth) / (row.length - 1.0);
                        }
                        break;
                    case 'center':
                        x += (component.width - innerWidth) / 2.0;
                        break;
                    case 'right':
                        x += (component.width - innerWidth);
                        break;
                }
                var y = component.y + verticalSpace;
                switch (component.alignItems) {
                    case 'center':
                        y += (maxComponentHeight - child.height) / 2.0;
                        break;
                    case 'bottom':
                        y += (maxComponentHeight - child.height);
                        break;
                }
                if (child.position === 'absolute') {
                    child.move(component.x, component.y, component);
                }
                else {
                    child.move(x, y, component);
                }
                return horizontalSpace;
            }), 0);
            return verticalSpace + maxComponentHeight;
        }, 0);
    };
    Layouter.prototype.resizeComponentsForVerticalBox = function (component, parent) {
        var verticalMargin = component.paddingTop;
        component.contentHeight = _.reduce(component.components, function (height, child) {
            var verticalSpace = Math.max(verticalMargin, child.marginTop) + height;
            child.resize(component);
            if (child.position === 'absolute') {
                return height;
            }
            verticalMargin = child.marginBottom;
            return verticalSpace + child.height;
        }, 0) + Math.max(verticalMargin, component.paddingBottom);
        var widestComponent = _.maxBy(component.components, function (child) { return child.layoutWidth; });
        if (widestComponent) {
            component.contentWidth = widestComponent.width +
                Math.max(widestComponent.marginLeft, component.paddingLeft) +
                Math.max(widestComponent.marginRight, component.paddingRight);
        }
    };
    Layouter.prototype.moveComponentsForVerticalBox = function (component, ox, oy, parent) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        var verticalMargin = component.paddingTop;
        _.reduce(component.components, function (height, child) {
            var horizontalSpace = Math.max(component.paddingLeft, child.marginLeft);
            var verticalSpace = Math.max(verticalMargin, child.marginTop) + height;
            var x = component.x + horizontalSpace;
            switch (component.justifyContent) {
                case 'center':
                    x += (child.innerWidth(component) - child.width) / 2;
                    break;
                case 'right':
                    x += (child.innerWidth(component) - child.width);
                    break;
            }
            var y = component.y + verticalSpace;
            switch (component.alignItems) {
                case 'spaceBetween':
                    if (component.rawHeight && component.components.length > 1) {
                        verticalSpace += (component.rawHeight - component.contentHeight) / (component.components.length - 1);
                    }
                    break;
                case 'center':
                    y += (component.rawHeight ? (component.rawHeight - component.contentHeight) / 2 : 0);
                    break;
                case 'bottom':
                    y += (component.rawHeight ? component.rawHeight - component.contentHeight : 0);
                    break;
            }
            if (child.position === 'absolute') {
                child.move(component.x, component.y, component);
            }
            else {
                child.move(x, y, component);
            }
            if (child.position === 'absolute') {
                return height;
            }
            verticalMargin = child.marginBottom;
            return verticalSpace + child.height;
        }, 0);
    };
    Layouter.prototype.resizeComponentsForHorizontalBox = function (component, parent) {
        var horizontalMargin = component.paddingLeft;
        component.contentWidth = _.reduce(component.components, function (width, child) {
            child.resize(component);
            if (child.position === 'absolute') {
                return width;
            }
            var horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width;
            horizontalMargin = child.marginRight;
            return horizontalSpace + child.width;
        }, 0) + Math.max(horizontalMargin, component.paddingRight);
        var tallestComponent = _.maxBy(component.components, function (child) { return child.layoutHeight; });
        if (tallestComponent) {
            component.contentHeight = tallestComponent.height +
                Math.max(tallestComponent.marginTop, component.paddingTop) +
                Math.max(tallestComponent.marginBottom, component.paddingBottom);
        }
    };
    Layouter.prototype.moveComponentsForHorizontalBox = function (component, ox, oy, parent) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        var horizontalMargin = component.paddingLeft;
        _.reduce(component.components, function (width, child) {
            var horizontalSpace = Math.max(horizontalMargin, child.marginLeft) + width;
            var verticalSpace = Math.max(component.paddingTop, component.marginTop);
            var x = component.x + horizontalSpace;
            switch (component.justifyContent) {
                case 'spaceBetween':
                    if (component.rawWidth && component.components.length > 1) {
                        horizontalSpace += (component.rawWidth - component.contentWidth) / (component.components.length - 1);
                    }
                    break;
                case 'center':
                    x += (component.rawWidth ? (component.rawWidth - component.contentWidth) / 2 : 0);
                    break;
                case 'right':
                    x += (component.rawWidth ? component.rawWidth - component.contentWidth : 0);
                    break;
            }
            var y = component.y + verticalSpace;
            switch (component.alignItems) {
                case 'center':
                    y += (child.innerHeight(component) - child.height) / 2;
                    break;
                case 'bottom':
                    y += child.innerHeight(component) - child.height;
                    break;
            }
            if (component.position === 'absolute') {
                child.move(component.x, component.y, component);
            }
            else {
                child.move(x, y, component);
            }
            if (component.position === 'absolute') {
                return width;
            }
            horizontalMargin = child.marginRight;
            return horizontalSpace + child.width;
        }, 0);
    };
    return Layouter;
}());
exports.Layouter = Layouter;
