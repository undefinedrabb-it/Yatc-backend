import { ApiClient } from 'twitch';
import { TwitchAuth, TwitchAuthConfig } from './TwitchAuth';
import { TwitchChatClient, TwitchChatClientConfig } from './TwitchChatClient';

export interface TwitchInfraConfig {
  chat: TwitchChatClientConfig;
  auth: TwitchAuthConfig;
}

export class TwitchInfra {
  private readonly _apiClient: ApiClient;

  private readonly _auth: TwitchAuth;

  private readonly _chat: TwitchChatClient;

  constructor(config: TwitchInfraConfig) {
    this._auth = new TwitchAuth(config.auth);

    this._apiClient = new ApiClient({ authProvider: this._auth.app });

    this._chat = new TwitchChatClient(config.chat, this._auth.user);
  }

  get apiClient() {
    return this._apiClient;
  }

  get chat() {
    return this._chat;
  }
}
