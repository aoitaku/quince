"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../typings/index.d.ts' />
const lodash_1 = require("lodash");
require("./lodash-chunk_by");
function Layouter(base) {
    return class extends base {
        resizeComponents(parent) {
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
        }
        moveComponents(ox = 0, oy = 0, parent) {
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
        }
        get testIfComponentsOverflow() {
            let horizontalMargin = this.paddingLeft;
            let width = 0;
            const maxWidth = this.contentWidth;
            let forceBreak = false;
            return (component) => {
                if (component.position === 'absolute') {
                    return false;
                }
                const horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + component.width;
                if (forceBreak) {
                    forceBreak = component.breakAfter;
                    width = horizontalSpace;
                    horizontalMargin = this.paddingLeft;
                    return true;
                }
                else {
                    forceBreak = component.breakAfter;
                }
                const expectedWidth = width + component.layoutWidth + this.paddingLeft + this.paddingRight;
                if (width > 0 && expectedWidth > maxWidth) {
                    width = horizontalSpace;
                    horizontalMargin = this.paddingLeft;
                    return true;
                }
                else {
                    width += horizontalSpace;
                    horizontalMargin = component.marginRight;
                    return false;
                }
            };
        }
        evaluateRowWidth(withExtraCalcuration) {
            let horizontalMargin = this.paddingLeft;
            return (width, component) => {
                let horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                if (withExtraCalcuration) {
                    horizontalSpace = withExtraCalcuration(component, horizontalSpace);
                }
                if (component.position === 'absolute') {
                    return width;
                }
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            };
        }
        resizeComponentsForFlowLayout(parent) {
            let verticalMargin = this.paddingTop;
            this.contentWidth = this.rawWidth;
            this.contentHeight = lodash_1.default.reduce(lodash_1.default.chunkBy(lodash_1.default.forEach(this.components, (component) => {
                component.resize(this);
            }), this.testIfComponentsOverflow), (height, row) => {
                const component = lodash_1.default.maxBy(row, (col) => col.layoutHeight);
                if (component.position === 'absolute') {
                    return height;
                }
                const verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0) + Math.max(verticalMargin, this.paddingBottom);
        }
        moveComponentsForFlowLayout(ox = 0, oy = 0, parent) {
            let verticalMargin = this.paddingTop;
            return lodash_1.default.reduce(lodash_1.default.chunkBy(this.components, this.testIfComponentsOverflow), (height, row) => {
                const tallestComponent = lodash_1.default.maxBy(row, (col) => col.layoutHeight);
                const maxComponentHeight = tallestComponent.height;
                const verticalSpace = Math.max(verticalMargin, tallestComponent.marginTop) + height;
                verticalMargin = tallestComponent.marginBottom;
                const innerWidth = lodash_1.default.reduce(row, this.evaluateRowWidth(), 0) + Math.max(lodash_1.default.last(row).marginRight, this.paddingRight);
                lodash_1.default.reduce(row, this.evaluateRowWidth((component, horizontalSpace) => {
                    let x = this.x + horizontalSpace;
                    switch (this.justifyContent) {
                        case 'spaceBetween':
                            if (row.length > 1 && !lodash_1.default.last(row).breakAfter) {
                                horizontalSpace += (this.width - innerWidth) / (row.length - 1.0);
                                x += horizontalSpace;
                            }
                        case 'center':
                            x += (this.width - innerWidth) / 2.0;
                        case 'right':
                            x += (this.width - innerWidth);
                    }
                    let y = this.y + verticalSpace;
                    switch (this.alignItems) {
                        case 'center':
                            y += (maxComponentHeight - component.height) / 2.0;
                        case 'bottom':
                            y += (maxComponentHeight - component.height);
                    }
                    if (component.position === 'absolute') {
                        component.move(this.x, this.y, this);
                    }
                    else {
                        component.move(x, y, this);
                    }
                    return horizontalSpace;
                }), 0);
                return verticalSpace + maxComponentHeight;
            }, 0);
        }
        resizeComponentsForVerticalBox(parent) {
            let verticalMargin = this.paddingTop;
            this.contentHeight = lodash_1.default.reduce(this.components, (height, component) => {
                const verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0) + Math.max(verticalMargin, this.paddingBottom);
            const widestComponent = lodash_1.default.maxBy(this.components, (component) => component.layoutWidth);
            if (widestComponent) {
                this.contentWidth = widestComponent.width +
                    Math.max(widestComponent.marginLeft, this.paddingLeft) +
                    Math.max(widestComponent.marginRight, this.paddingRight);
            }
        }
        moveComponentsForVerticalBox(ox = 0, oy = 0, parent) {
            let verticalMargin = this.paddingTop;
            lodash_1.default.reduce(this.components, (height, component) => {
                const horizontalSpace = Math.max(this.paddingLeft, component.marginLeft);
                let verticalSpace = Math.max(verticalMargin, component.marginTop) + height;
                let x = this.x + horizontalSpace;
                switch (this.justifyContent) {
                    case 'center':
                        x += (component.innerWidth(this) - component.width) / 2;
                        break;
                    case 'right':
                        x += (component.innerWidth(this) - component.width);
                        break;
                }
                let y = this.y + verticalSpace;
                switch (this.alignItems) {
                    case 'spaceBetween':
                        if (this.rawHeight && this.components.length > 1) {
                            verticalSpace += (this.rawHeight - this.contentHeight) / (this.components.length - 1);
                        }
                        break;
                    case 'center':
                        y += (this.rawHeight ? (this.rawHeight - this.contentHeight) / 2 : 0);
                        break;
                    case 'bottom':
                        y += (this.rawHeight ? this.rawHeight - this.contentHeight : 0);
                        break;
                }
                if (component.position === 'absolute') {
                    component.move(this.x, this.y, this);
                }
                else {
                    component.move(x, y, this);
                }
                if (component.position === 'absolute') {
                    return height;
                }
                verticalMargin = component.marginBottom;
                return verticalSpace + component.height;
            }, 0);
        }
        resizeComponentsForHorizontalBox(parent) {
            let horizontalMargin = this.paddingLeft;
            this.contentWidth = lodash_1.default.reduce(this.components, (width, component) => {
                component.resize(this);
                if (component.position === 'absolute') {
                    return width;
                }
                const horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            }, 0) + Math.max(horizontalMargin, this.paddingRight);
            const tallestComponent = lodash_1.default.maxBy(this.components, (component) => component.layoutHeight);
            if (tallestComponent) {
                this.contentHeight = tallestComponent.height +
                    Math.max(tallestComponent.marginTop, this.paddingTop) +
                    Math.max(tallestComponent.marginBottom, this.paddingBottom);
            }
        }
        moveComponentsForHorizontalBox(ox = 0, oy = 0, parent) {
            let horizontalMargin = this.paddingLeft;
            lodash_1.default.reduce(this.components, (width, component) => {
                let horizontalSpace = Math.max(horizontalMargin, component.marginLeft) + width;
                const verticalSpace = Math.max(this.paddingTop, component.marginTop);
                let x = this.x + horizontalSpace;
                switch (this.justifyContent) {
                    case 'spaceBetween':
                        if (this.rawWidth && this.components.length > 1) {
                            horizontalSpace += (this.rawWidth - this.contentWidth) / (this.components.length - 1);
                        }
                    case 'center':
                        x += (this.rawWidth ? (this.rawWidth - this.contentWidth) / 2 : 0);
                        break;
                    case 'right':
                        x += (this.rawWidth ? this.rawWidth - this.contentWidth : 0);
                        break;
                }
                let y = this.y + verticalSpace;
                switch (this.alignItems) {
                    case 'center':
                        y = (component.innerHeight(this) - component.height) / 2;
                    case 'bottom':
                        y = component.innerHeight(this) - component.height;
                }
                if (component.position === 'absolute') {
                    component.move(this.x, this.y, this);
                }
                else {
                    component.move(x, y, this);
                }
                if (component.position === 'absolute') {
                    return width;
                }
                horizontalMargin = component.marginRight;
                return horizontalSpace + component.width;
            }, 0);
        }
    };
}
exports.default = Layouter;
