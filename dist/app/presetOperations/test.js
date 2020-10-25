"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const alta_jsapi_1 = require("alta-jsapi");
const RemoteConsole_1 = __importDefault(require("../jsapi/RemoteConsole"));
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        var servers = yield alta_jsapi_1.Servers.getControllable();
        for (var server of servers) {
            try {
                var details = yield alta_jsapi_1.Servers.joinConsole(server.id);
                let remoteConsole = new RemoteConsole_1.default(server.name);
                remoteConsole.onError = error => { throw error; };
                remoteConsole.onMessage = message => console.log(message.data);
                yield remoteConsole.connect(details.address, details.websocket_port);
                remoteConsole.sendStructured('Subscribe', undefined, undefined, 'ErrorLog');
                remoteConsole.sendStructured('Subscribe', undefined, undefined, 'FatalLog');
                remoteConsole.sendStructured('Command', 'wipe');
            }
            catch (error) {
                console.error("Error running on " + server.name);
                console.error(error);
            }
        }
    });
}
exports.default = default_1;
