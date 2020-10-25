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
const SubscriptionBar_1 = require("./SubscriptionBar");
const MessageTable_1 = require("./MessageTable");
const react_resize_observer_1 = __importDefault(require("react-resize-observer"));
const react_responsive_1 = __importDefault(require("react-responsive"));
const MobileRow = styled_components_1.default.div `

    display: flex;
    flex-direction: row;
`;
const MobileHeader = styled_components_1.default.div `

    flex 0 0 85px;

    font-weight: bold;
`;
const MobileValue = styled_components_1.default.div `

    width: 0px;
    min-width: 0px;

    flex 1 0 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Selected = styled_components_1.css `

    ${MobileHeader}
    {
        flex 0 0 19px;
    }

    ${MobileValue}
    {
        width: 100%;

        flex unset;

        overflow: auto;
        text-overflow: initial;
        white-space: pre;
    }

    >${MobileRow}
    {
        flex-direction: column;
    }
`;
const MobileSupportedWrapper = styled_components_1.default.div `

    ${(props) => props.selected ? Selected : null};

    display: flex;
	flex-direction: row;
    width: 100%;

    @media (max-width: 1224px)
    {
		flex-direction: column;
    }
`;
function MessageRow({ id, style, messageId, message, setSelected, selected, onResize }) {
    var item = fitToTable(message);
    return (React.createElement(MessageTable_1.BodyRow, { key: item.id, selected: selected, color: item.color, onClick: () => setSelected(item.id), style: style },
        React.createElement(MobileSupportedWrapper, { selected: selected },
            React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
                React.createElement(MessageTable_1.Column, null, item.type),
                React.createElement(MessageTable_1.Column, null, item.timeStamp.toLocaleTimeString()),
                React.createElement(MessageTable_1.Column, null, item.eventType),
                React.createElement(MessageTable_1.Column, null, item.logger),
                React.createElement(MessageTable_1.Column, null, item.message)),
            React.createElement(react_responsive_1.default, { maxDeviceWidth: 1224 },
                React.createElement(MobileRow, null,
                    React.createElement(MobileHeader, null, "Type"),
                    React.createElement(MobileValue, null, item.type)),
                React.createElement(MobileRow, null,
                    React.createElement(MobileHeader, null, "Time"),
                    React.createElement(MobileValue, null, item.timeStamp.toLocaleTimeString())),
                React.createElement(MobileRow, null,
                    React.createElement(MobileHeader, null, "Event"),
                    React.createElement(MobileValue, null, item.eventType)),
                React.createElement(MobileRow, null,
                    React.createElement(MobileHeader, null, "Logger"),
                    React.createElement(MobileValue, null, item.logger)),
                React.createElement(MobileRow, null,
                    React.createElement(MobileHeader, null, "Message"),
                    React.createElement(MobileValue, null, item.message))),
            React.createElement(react_resize_observer_1.default, { onResize: onResize }))));
}
function fitToTable(item) {
    if (!item) {
        console.error("Item undefined!");
        return { id: -1 };
    }
    var result = { id: item.id };
    result.color = 'normal';
    result.type = item.type;
    result.timeStamp = new Date(item.data.timeStamp || item.timeStamp);
    result.eventType = item.eventType;
    result.logger = item.data.logger;
    if (item.eventType == 'WarnLog') {
        result.color = 'warning';
    }
    else if (item.eventType == 'ErrorLog' || item.eventType == 'FatalLog') {
        result.color = 'error';
    }
    else if (!SubscriptionBar_1.allLogs.includes(item.eventType)) {
        result.color = 'success';
    }
    if (typeof item.data == 'string') {
        result.message = item.data;
    }
    else if (!!item.data.message) {
        result.message = item.data.message;
    }
    else if (!!item.data.Result) {
        result.message = JSON.stringify(item.data.Result, null, 4);
    }
    else if (!!item.data.StringResult) {
        result.message = item.data.StringResult;
    }
    if (!!item.data.Exception) {
        result.color = 'error';
        result.message = item.data.Exception.Message;
    }
    return result;
}
const mapStateToProps = (state, ownProps) => {
    return {
        message: RemoteConsoles.makeMessageSelector(ownProps.id, ownProps.messageId)(state),
    };
};
function mapDispatchToProps(dispatch) {
    return {};
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(MessageRow);
