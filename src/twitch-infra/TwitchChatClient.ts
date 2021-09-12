import { Client } from 'tmi.js';
import { AuthProvider } from 'twitch-auth';
// import { ChatUserstate, Client } from 'twitch-auth-tmi';
// import { StaticAuthProvider } from 'twitch-auth';

export interface TwitchChatClientConfig {
  channels: string[];
}
export class TwitchChatClient {
  private _client: Client;

  // authProvider: AuthProvider
  constructor(config: TwitchChatClientConfig, authProvider: AuthProvider) {
    // const authProvider = new StaticAuthProvider('my-client-id', 'my-bot-token');
    this._client = new Client({
      options: { debug: true, messagesLogLevel: 'info' },
      connection: {
        reconnect: true,
        secure: true,
      },
      // authProvider,
      channels: config.channels,
    });
    this._client.connect();
  }

  get client() {
    return this._client;
  }
}
