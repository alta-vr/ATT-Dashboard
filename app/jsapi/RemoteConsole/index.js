import net from 'chrome-net';
import { EventEmitter } from 'events';

import { Sessions } from 'alta-installer/dist/webApiClient';

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
        connection.send(Sessions.getLocalTokens().identity_token);
        resolve();
      };
      connection.onerror = reject;
    });

    connection.onmessage = message => this.onMessage(message);
    connection.onerror = error => this.onError(error);
    connection.onclose = data => this.onClose(data);
  }

  send(command) {
    this.connection.send(command);
  }

  terminate() {
    try {
      this.connection.close();
    } catch (error) {
      console.log(`Error destroying connection : ${error}`);
    }
  }
}
