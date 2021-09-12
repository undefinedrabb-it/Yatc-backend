import { AuthProvider, StaticAuthProvider } from 'twitch-auth';

export interface TwitchAuthConfig {
  clientId: string;
  appAccessToken: string;
  userAccessToken: string;
}

export class TwitchAuth {
  private readonly _app: AuthProvider;

  private readonly _user: AuthProvider;

  constructor(config: TwitchAuthConfig) {
    this._app = new StaticAuthProvider(config.clientId, config.appAccessToken);

    this._user = new StaticAuthProvider(
      config.clientId,
      config.userAccessToken,
    );
  }

  get app(): AuthProvider {
    return this.app;
  }

  get user(): AuthProvider {
    return this.user;
  }
}
