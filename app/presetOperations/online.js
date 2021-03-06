import { promisify } from 'util';

import sha512 from 'crypto-js/sha512';

import { Sessions, Servers } from 'alta-jsapi';

import RemoteConsole from "../jsapi/RemoteConsole";

import EventEmitter from 'events';

const sleep = promisify(setTimeout);

export default async function()
{
    let username = "A";
    let password = "B";

    let hash = sha512(password).toString();

    await Sessions.loginWithUsername(username, hash);

    var online = [];

    while (true)
    {
        var running = await Servers.getRunning();

        for (var server of running)
        {
            if (online.findIndex(item => item.id == server.id) < 0)
            {
                beginConnection(server);
            }
        }
    }
}

async function beginConnection(server, onDisconnect)
{
    try
    {
        var details = await Servers.joinConsole(server.id);

        let remoteConsole = new RemoteConsole(server.name);

        remoteConsole.onError = handleError;
        remoteConsole.onMessage = handleMessage;
        remoteConsole.onClose = onDisconnect;

        await remoteConsole.connect(details.address, details.websocket_port);

        initialize(server, remoteConsole);        
    }
    catch (error)
    {
        console.error("Error running on " + server.name);
        console.error(error);
    }

    function handleMessage(message)
    {
        var { data } = message;

        console.log(data);
    }

    function handleError(error)
    {
        console.error(error);
    }
}


async function getTargetServers()
{

}

async function initialize(server, remoteConsole)
{
    var ezConsole = new EasyRemoteConsole(remoteConsole);

    //Log whenever a player joins or leaves
    ezConsole.subscribe('PlayerJoined', console.log);
    ezConsole.subscribe('PlayerLeft', console.log);

    //Get all players
    var players = await ezConsole.getInfo('Players');

    //Kill a random player
    if (players.length > 0)
    {
        var target = Math.floor(Math.random() * players.length);

        ezConsole.sendCommand('player kill ' + players[target].id);
    }
}