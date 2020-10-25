"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const hoist_non_react_statics_1 = __importDefault(require("hoist-non-react-statics"));
const react_redux_1 = require("react-redux");
const sagaInjectors_1 = __importDefault(require("./sagaInjectors"));
/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.DAEMON) the saga will be started
 * on component mount and never canceled or started again. Another two options:
 *   - constants.RESTART_ON_REMOUNT — the saga will be started on component mount and
 *   cancelled with `task.cancel()` on component unmount for improved performance,
 *   - constants.ONCE_TILL_UNMOUNT — behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
exports.default = ({ key, saga, mode }) => WrappedComponent => {
    class InjectSaga extends react_1.default.Component {
        constructor(props, context) {
            super(props, context);
            this.injectors = sagaInjectors_1.default(context.store);
            this.injectors.injectSaga(key, { saga, mode }, this.props);
        }
        componentWillUnmount() {
            this.injectors.ejectSaga(key);
        }
        render() {
            return react_1.default.createElement(WrappedComponent, Object.assign({}, this.props));
        }
    }
    InjectSaga.WrappedComponent = WrappedComponent;
    InjectSaga.contextType = react_redux_1.ReactReduxContext;
    InjectSaga.displayName = `withSaga(${WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'})`;
    return hoist_non_react_statics_1.default(InjectSaga, WrappedComponent);
};
const useInjectSaga = ({ key, saga, mode }) => {
    const context = react_1.default.useContext(react_redux_1.ReactReduxContext);
    react_1.default.useEffect(() => {
        const injectors = sagaInjectors_1.default(context.store);
        injectors.injectSaga(key, { saga, mode });
        return () => {
            injectors.ejectSaga(key);
        };
    }, []);
};
exports.useInjectSaga = useInjectSaga;
