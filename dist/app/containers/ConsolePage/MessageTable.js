"use strict";
/**
 *
 * ServersPage
 *
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const RemoteConsoles = __importStar(require("../../jsapi/remoteConsoles"));
const react_window_1 = require("react-window");
const react_responsive_1 = __importDefault(require("react-responsive"));
const { useMediaQuery } = require('react-responsive');
const MessageRow_1 = __importDefault(require("./MessageRow"));
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const Table = styled_components_1.default.div `

    height: calc(100vh - 300px);
    
    @media (max-width: 1224px)
    {
		height: calc(100vh - 180px);
    }
`;
exports.Column = styled_components_1.default.div `

    flex-grow: 0;
    flex-shrink: 0;
    vertical-align: top;

    font-size: 14px;
    -webkit-font-smoothing: antialiased;

    width: 100px;
    padding-right: 20px;
    
    min-height: max-content;
    height: unset;

    :nth-child(1)
    {
        width: 150px;
    }
    :nth-child(2)
    {
        width: 150px;
    }
    :nth-child(3)
    {
        width: 100px;
    }
    :nth-child(4)
    {
        width: 150px;
    }
    :nth-child(5)
    {
        width: calc(100% - 550px);
    }
`;
const Unselected = styled_components_1.css `

    height: 44px;

    ${exports.Column}
    {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
const Selected = styled_components_1.css `

    height: max-content !important;
    

    ${exports.Column}
    {
        overflow: auto;
    };
    
    ${exports.Column}:nth-child(5)
    {
        white-space: pre;
    };
`;
const Row = styled_components_1.default.div `

    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    width: 100%;
    padding: 12px;
    border-bottom: 1px solid #DCE1EA;
    box-sizing: border-box;

    align-items: stretch;
    
    font-family: 'Courier New';

    ${(props) => props.selected ? Selected : Unselected};
`;
exports.HeaderRow = styled_components_1.default(Row) `

    box-shadow: 0 1px 2px 0 #E9EFFA;

    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
`;
const colors = {
    ['success']: "#C5F9D8",
    ['normal']: "#EDF4F7",
    ['warning']: "#F9F0C5",
    ['error']: "#F9C5C5",
};
exports.BodyRow = styled_components_1.default(Row) `

    color: #333333;
    background-color: ${(props) => colors[props.color]}50;

    cursor: pointer;

    :hover
    {
		background-color: ${(props) => colors[props.color]}A0;
		box-shadow: 0 1px 2px 0 ${(props) => colors[props.color]};
    }
`;
exports.Wrapper = styled_components_1.default.div `

    display: flex;
	flex-direction: row;
    width: 100%;

    @media (max-width: 1224px)
    {
		flex-direction: column;
    }
`;
//https://codepen.io/jonstuebe/pen/XgKpzq
exports.List = styled_components_1.default(react_window_1.VariableSizeList) `

    display: flex;
    flex-direction: column-reverse;

    >div
    {
        flex-shrink: 0;
        flex-grow: 0;

        position: relative;
    }
`;
function MessageTable(props) {
    const desktop = useMediaQuery({ query: '(min-device-width: 1224px)' });
    return React.createElement(Table, null,
        React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
            React.createElement(exports.HeaderRow, null,
                React.createElement(exports.Wrapper, null,
                    React.createElement(exports.Column, null, "Type"),
                    React.createElement(exports.Column, null, "Time"),
                    React.createElement(exports.Column, null, "Event"),
                    React.createElement(exports.Column, null, "Logger"),
                    React.createElement(exports.Column, null, "Message")))),
        React.createElement(TableBody, { id: props.id, desktop: desktop }));
}
exports.default = MessageTable;
function TableBodyRaw({ id, messages, desktop }) {
    const [selected, setSelected] = React.useState(undefined);
    const [lastCount, setLastCount] = React.useState(0);
    const [selectedHeight, setSelectedHeight] = React.useState(44);
    const listRef = React.useRef();
    if (lastCount != messages.length) {
        var current = listRef.current;
        if (current != undefined) {
            //Force it to stick to the bottom
            current._onScrollVertical({ currentTarget: current._outerRef });
        }
        setLastCount(messages.length);
    }
    var rowHeight = desktop ? 44 : 120;
    return (React.createElement(react_virtualized_auto_sizer_1.default, null, ({ height, width }) => {
        var listHeight = desktop ? height - rowHeight : height;
        var extraHeight = desktop ? 24 : 48;
        return React.createElement(exports.List, { ref: listRef, height: listHeight, width: width, itemKey: (index, data) => data[index].id, itemData: messages, itemCount: messages.length, estimatedItemSize: rowHeight, itemSize: (index) => selected == messages[index].id ? selectedHeight + 24 : rowHeight }, ({ index, style }) => React.createElement(MessageRow_1.default, { id: id, messageId: messages[index].id, style: style, selected: selected == messages[index].id, onResize: rect => {
                console.log(rect.height);
                if (rect.height != selectedHeight && rect.height > rowHeight) {
                    setSelectedHeight(rect.height);
                }
                var current = listRef.current;
                if (current != undefined) {
                    current.resetAfterIndex(index, true);
                }
            }, setSelected: value => {
                if (selected == value) {
                    setSelected(-1);
                }
                else {
                    setSelected(value);
                }
            } }));
    }));
}
const mapStateToProps = (state, ownProps) => {
    return {
        messages: RemoteConsoles.makeMessagesSelector(ownProps.id)(state),
    };
};
function mapDispatchToProps(dispatch) {
    return {};
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
const TableBody = redux_1.compose(withConnect)(TableBodyRaw);
