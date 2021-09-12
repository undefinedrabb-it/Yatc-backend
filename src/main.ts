/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line max-classes-per-file
import dotenv from 'dotenv';
import { Socket } from 'socket.io';
import { filter, fromEvent, map, switchMap } from 'rxjs';
import { Identity, ConsoleLogger } from './utils';

import { Server } from './http-infra';
import { initMongo, UserRepo } from './mongo-infra';

import { MessageService } from './MessageService';
import { ChatMessage } from './domain/Message';
import { Bot } from './Bot';
import {
  RawMessageObjectFactory,
  RawMessageToDomain,
  RawTwitchChatMessage,
  TwitchInfra,
} from './twitch-infra';

dotenv.config({ path: '.secret.env' });
dotenv.config();

class UserService {
  private readonly _repo: UserRepo;

  constructor() {
    this._repo = new UserRepo();
  }

  get repo() {
    return this._repo;
  }
}

const main = async () => {
  const config = {
    twitch: {
      chat: {
        channels: [process.env.TWITCH_CHANNEL || ''],
      },
      auth: {
        clientId: process.env.CLIENT_ID || '',
        appAccessToken: process.env.APP_ACCESS_TOKEN || '',
        userAccessToken: process.env.USER_ACCESS_TOKEN || '',
      },
    },
    server: {
      port: Number.parseInt(process.env.PORT || '', 10) || 5000,
      fUrl: process.env.F_URL || 'http://localhost:3000',
    },
  };

  await initMongo();

  const twitchInfra = new TwitchInfra(config.twitch);

  const IdentityToRawMessage = Identity<unknown, RawTwitchChatMessage>();
  const TwitchMessageStream = fromEvent(
    twitchInfra.chat.client,
    'message',
  ).pipe(
    map(IdentityToRawMessage),
    map(RawMessageObjectFactory),
    filter((m) => !m.self),
  );

  const logger = new ConsoleLogger();
  const server = new Server(config.server, logger);

  const userService = new UserService();

  const service = new MessageService(
    twitchInfra.apiClient,
    userService.repo,
    logger,
  );

  const domainMessage = TwitchMessageStream.pipe(
    map((m) => RawMessageToDomain(m.userstate, m.message)),
    // niewiadomo czemu service.Transorm nie chciał działać jak bez wrappera tzn. nie chciłą korzysrtać z private repo wierd
    switchMap((m) => service.Transform(m)),
    map((m) => m.build()),
    filter((m) => m !== null),
    map(Identity<unknown, ChatMessage>()),
  );

  const bot = new Bot('~');

  const botMessageCmd = [
    {
      cmd: 'lurk',
      fn: (message: ChatMessage) => {
        userService.repo.modify(
          { username: message.user.username },
          { isLurking: true },
        );
      },
    },
    {
      cmd: 'unlurk',
      fn: (message: ChatMessage) => {
        userService.repo.modify(
          { username: message.user.username },
          { isLurking: false },
        );
      },
    },
  ];

  botMessageCmd.forEach((cmds) => {
    bot.registerCmd(cmds.cmd, cmds.fn);
  });

  server.registerSocket('connection', (socket: Socket) => {
    bot.registerCmd('clear', () => {
      socket.emit('clear');
    });

    const proxyStream = domainMessage.subscribe((m) => {
      bot.transform(m);
      socket.emit('events', m);
    });

    socket.on('disconnect', () => {
      proxyStream.unsubscribe();
      // botStream.unsubscribe();
    });
  });

  server.start();
};

main()
  .then(() => {
    console.log('DONE!!');
  })
  .catch((e) => {
    console.error(e);
  });
