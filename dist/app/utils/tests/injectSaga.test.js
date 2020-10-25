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
const effects_1 = require("redux-saga/effects");
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
const react_testing_library_1 = require("react-testing-library");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const configureStore_1 = __importDefault(require("../../configureStore"));
const injectSaga_1 = __importStar(require("../injectSaga"));
const sagaInjectors = __importStar(require("../sagaInjectors"));
// Fixtures
const Component = () => null;
function* testSaga() {
    yield effects_1.put({ type: 'TEST', payload: 'yup' });
}
describe('injectSaga decorator', () => {
    let store;
    let injectors;
    let ComponentWithSaga;
    beforeAll(() => {
        sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
    });
    beforeEach(() => {
        store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
        injectors = {
            injectSaga: jest.fn(),
            ejectSaga: jest.fn(),
        };
        ComponentWithSaga = injectSaga_1.default({
            key: 'test',
            saga: testSaga,
            mode: 'testMode',
        })(Component);
        sagaInjectors.default.mockClear();
    });
    it('should inject given saga, mode, and props', () => {
        const props = { test: 'test' };
        react_test_renderer_1.default.create(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithSaga, Object.assign({}, props))));
        expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
        expect(injectors.injectSaga).toHaveBeenCalledWith('test', { saga: testSaga, mode: 'testMode' }, props);
    });
    it('should eject on unmount with a correct saga key', () => {
        const props = { test: 'test' };
        const renderedComponent = react_test_renderer_1.default.create(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithSaga, Object.assign({}, props))));
        renderedComponent.unmount();
        expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
        expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
    });
    it('should set a correct display name', () => {
        expect(ComponentWithSaga.displayName).toBe('withSaga(Component)');
        expect(injectSaga_1.default({ key: 'test', saga: testSaga })(() => null).displayName).toBe('withSaga(Component)');
    });
    it('should propagate props', () => {
        const props = { testProp: 'test' };
        const renderedComponent = react_test_renderer_1.default.create(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithSaga, Object.assign({}, props))));
        const { props: { children }, } = renderedComponent.getInstance();
        expect(children.props).toEqual(props);
    });
});
describe('useInjectSaga hook', () => {
    let store;
    let injectors;
    let ComponentWithSaga;
    beforeAll(() => {
        sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
    });
    beforeEach(() => {
        store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
        injectors = {
            injectSaga: jest.fn(),
            ejectSaga: jest.fn(),
        };
        ComponentWithSaga = () => {
            injectSaga_1.useInjectSaga({
                key: 'test',
                saga: testSaga,
                mode: 'testMode',
            });
            return null;
        };
        sagaInjectors.default.mockClear();
    });
    it('should inject given saga and mode', () => {
        const props = { test: 'test' };
        react_testing_library_1.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithSaga, Object.assign({}, props))));
        expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
        expect(injectors.injectSaga).toHaveBeenCalledWith('test', {
            saga: testSaga,
            mode: 'testMode',
        });
    });
    it('should eject on unmount with a correct saga key', () => {
        const props = { test: 'test' };
        const { unmount } = react_testing_library_1.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(ComponentWithSaga, Object.assign({}, props))));
        unmount();
        expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
        expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
    });
});
