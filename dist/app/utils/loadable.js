"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
    const LazyComponent = react_1.lazy(importFunc);
    return props => (react_1.default.createElement(react_1.Suspense, { fallback: fallback },
        react_1.default.createElement(LazyComponent, Object.assign({}, props))));
};
exports.default = loadable;
