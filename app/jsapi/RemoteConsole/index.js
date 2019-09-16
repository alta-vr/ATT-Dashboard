import net from 'chrome-net';
import { EventEmitter } from 'events';

import { Sessions } from 'alta-jsapi';

export default class RemoteConsole {
  name;

  connection;

  onMessage = console.log;

  onError = console.error;

  onClose = console.error;

  constructor(name) {
    this.name = name;
  }

  async connect(ipAddress, port) {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    const connection = new WebSocket(`ws://${ipAddress}:${port}`);
    this.connection = connection;

    await new Promise((resolve, reject) => {
      connection.onopen = () => {

        connection.onmessage = message => 
        {
            console.log(message);

            var data = JSON.parse(message.data);

            console.log(data);

            if (data.type == 'FatalLog' || data.type == 'ErrorLog')
            {
                reject(data.message);
            }
            else
            {
                console.log("Resolve!");
                resolve();
            }
        }

        connection.send(Sessions.getLocalTokens().identity_token);
        console.log("Sent tokens!");
      };
      connection.onerror = reject;
    });

    connection.onmessage = message => this.onMessage(message);
    connection.onerror = error => this.onError(error);
    connection.onclose = data => this.onClose(data);
  }

  sendStructured(type, content, infoType, eventType)
  {
      send(JSON.stringify({type, content, infoType, eventType}));
  }

  send(command) {
    this.connection.send(command);
    console.log("Sent command!");
  }

  terminate() {
    try {
      this.connection.close();
    } catch (error) {
      console.log(`Error destroying connection : ${error}`);
    }
  }
}
