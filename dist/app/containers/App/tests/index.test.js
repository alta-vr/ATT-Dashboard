"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const shallow_1 = __importDefault(require("react-test-renderer/shallow"));
const index_1 = __importDefault(require("../index"));
const renderer = new shallow_1.default();
describe('<App />', () => {
    it('should render and match the snapshot', () => {
        renderer.render(react_1.default.createElement(index_1.default, null));
        const renderedOutput = renderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });
});
