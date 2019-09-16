import { Servers } from 'alta-jsapi';

import RemoteConsole from "../jsapi/RemoteConsole";

export default async function()
{
    var servers = await Servers.getControllable();

    for (var server of servers)
    {
        try
        {
            var details = await Servers.joinConsole(server.id);

            let remoteConsole = new RemoteConsole(server.name);

            remoteConsole.onError = error => { throw error; }
            remoteConsole.onMessage = message => console.log(message.data);

            await remoteConsole.connect(details.address, details.websocket_port);

            remoteConsole.sendStructured('Subscribe', undefined, undefined, 'ErrorLog');
            remoteConsole.sendStructured('Subscribe', undefined, undefined, 'FatalLog');

            remoteConsole.sendStructured('Command', 'wipe');

            
        }
        catch (error)
        {
            console.error("Error running on " + server.name);
            console.error(error);
        }
    }
}