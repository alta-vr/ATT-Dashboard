import net from 'chrome-net';
import { EventEmitter } from 'events';

export default class RemoteConsole
{
    name;
    connection;

    onMessage;
    onError;
    onClose;

    constructor(name)
    {
        this.name = name;
    }

    async connect(ipAddress, commandPort, loggingPort)
    {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://127.0.0.1:8181');
        this.connection = connection;
        
        await new Promise((resolve, reject) =>
        {
            connection.onopen = resolve;
            connection.onerror = reject;
        });

        connection.onmessage = message => this.onMessage(message);
        connection.onerror = error => this.onError(error);
        connection.onclose = data => this.onClose(data);
    }

    send(command)
    {
        this.connection.send(command);
    }

    terminate()
    {
        try
        {
            this.connection.close();
        }
        catch (error)
        {
            console.log("Error destroying connection : " + error);
        }
    }
}