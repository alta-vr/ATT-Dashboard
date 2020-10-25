"use strict";
/**
 * Test injectors
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
const react_router_dom_1 = require("react-router-dom");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
const react_testing_library_1 = require("react-testing-library");
const configureStore_1 = __importDefault(require("../../configureStore"));
const injectReducer_1 = __importStar(require("../injectReducer"));
const reducerInjectors = __importStar(require("../reducerInjectors"));
// Fixtures
const Component = () => null;
const reducer = s => s;
describe('injectReducer decorator', () => {
    let store;
    let injectors;
    let ComponentWithReducer;
    beforeAll(() => {
        reducerInjectors.default = jest.fn().mockImplementation(() => injectors);
    });
    beforeEach(() => {
        store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
        injectors = {
            injectReducer: jest.fn(),
        };
        ComponentWithReducer = injectReducer_1.default({ key: 'test', reducer })(Component);
        reducerInjectors.default.mockClear();
    });
    it('should inject a given reducer', () => {
        react_test_renderer_1.default.create(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithReducer, null)));
        expect(injectors.injectReducer).toHaveBeenCalledTimes(1);
        expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer);
    });
    it('should set a correct display name', () => {
        expect(ComponentWithReducer.displayName).toBe('withReducer(Component)');
        expect(injectReducer_1.default({ key: 'test', reducer })(() => null).displayName).toBe('withReducer(Component)');
    });
    it('should propagate props', () => {
        const props = { testProp: 'test' };
        const renderedComponent = react_test_renderer_1.default.create(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithReducer, Object.assign({}, props))));
        const { props: { children }, } = renderedComponent.getInstance();
        expect(children.props).toEqual(props);
    });
});
describe('useInjectReducer hook', () => {
    let store;
    let injectors;
    let ComponentWithReducer;
    beforeAll(() => {
        injectors = {
            injectReducer: jest.fn(),
        };
        reducerInjectors.default = jest.fn().mockImplementation(() => injectors);
        store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
        ComponentWithReducer = () => {
            injectReducer_1.useInjectReducer({ key: 'test', reducer });
            return null;
        };
    });
    it('should inject a given reducer', () => {
        react_testing_library_1.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithReducer, null)));
        expect(injectors.injectReducer).toHaveBeenCalledTimes(1);
        expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer);
    });
});
