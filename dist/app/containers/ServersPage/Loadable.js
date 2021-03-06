"use strict";
/**
 *
 * Asynchronously loads the component for ServersPage
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const loadable_1 = __importDefault(require("utils/loadable"));
exports.default = loadable_1.default(() => Promise.resolve().then(() => __importStar(require('./index'))));
