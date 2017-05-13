"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../typings/index.d.ts' />
var _ = require("lodash");
_.mixin({
    chunkBy: function (array, predicate) {
        return array.reduce(function (prev, current, index) {
            if (prev.length === 0 || predicate(current)) {
                prev.push([current]);
            }
            else {
                prev[prev.length - 1].push(current);
            }
            return prev;
        }, [[]]);
    },
}, { chain: false });
