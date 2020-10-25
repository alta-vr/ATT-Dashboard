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
const util_1 = require("util");
const sha512_1 = __importDefault(require("crypto-js/sha512"));
const alta_jsapi_1 = require("alta-jsapi");
const RemoteConsole_1 = __importDefault(require("../jsapi/RemoteConsole"));
const sleep = util_1.promisify(setTimeout);
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = "A";
        let password = "B";
        let hash = sha512_1.default(password).toString();
        yield alta_jsapi_1.Sessions.loginWithUsername(username, hash);
        var online = [];
        while (true) {
            var running = yield alta_jsapi_1.Servers.getRunning();
            for (var server of running) {
                if (online.findIndex(item => item.id == server.id) < 0) {
                    beginConnection(server);
                }
            }
        }
    });
}
exports.default = default_1;
function beginConnection(server, onDisconnect) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var details = yield alta_jsapi_1.Servers.joinConsole(server.id);
            let remoteConsole = new RemoteConsole_1.default(server.name);
            remoteConsole.onError = handleError;
            remoteConsole.onMessage = handleMessage;
            remoteConsole.onClose = onDisconnect;
            yield remoteConsole.connect(details.address, details.websocket_port);
            initialize(server, remoteConsole);
        }
        catch (error) {
            console.error("Error running on " + server.name);
            console.error(error);
        }
        function handleMessage(message) {
            var { data } = message;
            console.log(data);
        }
        function handleError(error) {
            console.error(error);
        }
    });
}
function getTargetServers() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function initialize(server, remoteConsole) {
    return __awaiter(this, void 0, void 0, function* () {
        var ezConsole = new EasyRemoteConsole(remoteConsole);
        //Log whenever a player joins or leaves
        ezConsole.subscribe('PlayerJoined', console.log);
        ezConsole.subscribe('PlayerLeft', console.log);
        //Get all players
        var players = yield ezConsole.getInfo('Players');
        //Kill a random player
        if (players.length > 0) {
            var target = Math.floor(Math.random() * players.length);
            ezConsole.sendCommand('player kill ' + players[target].id);
        }
    });
}
