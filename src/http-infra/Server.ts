import express, { Express, Router } from 'express';
import cors from 'cors';
import { Server as SocketServer, Socket } from 'socket.io';
import { ILogger } from '../utils';

interface ServerConfig {
  port: number;
  fUrl: string;
}

export class Server {
  private _io!: SocketServer;

  private readonly _app: Express;

  private readonly _config: ServerConfig;

  private readonly _logger: ILogger;

  private readonly _websocketEventHandler: Map<
    string,
    (socket: Socket) => void
  >;

  private readonly _httpEventHandler: Map<string, Router>;

  constructor(config: ServerConfig, logger: ILogger) {
    this._logger = logger;

    this._config = config;
    this._app = express();

    this._app.use(cors({ origin: config.fUrl }));

    this._websocketEventHandler = new Map();
    this._httpEventHandler = new Map();
  }

  public start(): void {
    this._httpEventHandler.forEach((reqeustHandler, route) => {
      this._app.use(route, reqeustHandler);
    });

    const server = this._app.listen(this._config.port, () => {
      this._logger.log(
        `Example app listening at http://localhost:${this._config.port}`,
      );
    });

    this._io = new SocketServer(server, {
      cors: { origin: this._config.fUrl },
    });

    this._websocketEventHandler.forEach((eventHandler, eventName) => {
      this._io.on(eventName, eventHandler);
    });
  }

  public registerHttp(route: string, reqeustHandler: Router): void {
    this._httpEventHandler.set(route, reqeustHandler);
  }

  public registerSocket(
    eventName: string,
    eventHandler: (socket: Socket) => void,
  ): void {
    this._websocketEventHandler.set(eventName, eventHandler);
  }
}
