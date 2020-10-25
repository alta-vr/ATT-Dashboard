"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hoist_non_react_statics_1 = __importDefault(require("hoist-non-react-statics"));
const react_redux_1 = require("react-redux");
const reducerInjectors_1 = __importDefault(require("./reducerInjectors"));
/**
 * Dynamically injects a reducer
 *
 * @param {string} key A key of the reducer
 * @param {function} reducer A reducer that will be injected
 *
 */
exports.default = ({ key, reducer }) => WrappedComponent => {
    class ReducerInjector extends react_1.default.Component {
        constructor(props, context) {
            super(props, context);
            reducerInjectors_1.default(context.store).injectReducer(key, reducer);
        }
        render() {
            return react_1.default.createElement(WrappedComponent, Object.assign({}, this.props));
        }
    }
    ReducerInjector.WrappedComponent = WrappedComponent;
    ReducerInjector.contextType = react_redux_1.ReactReduxContext;
    ReducerInjector.displayName = `withReducer(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;
    return hoist_non_react_statics_1.default(ReducerInjector, WrappedComponent);
};
const useInjectReducer = ({ key, reducer }) => {
    const context = react_1.default.useContext(react_redux_1.ReactReduxContext);
    react_1.default.useEffect(() => {
        reducerInjectors_1.default(context.store).injectReducer(key, reducer);
    }, []);
};
exports.useInjectReducer = useInjectReducer;
