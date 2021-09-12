import { ChatMessage } from './domain/Message';

export class Bot {
  public readonly _cmd: Map<string, (message: ChatMessage) => void>;

  private readonly _prefix: string;

  constructor(prefix: string) {
    this._cmd = new Map();
    this._prefix = prefix;
  }

  // TODO public start(Observalbe)
  public transform(chatMessage: ChatMessage) {
    const { message } = chatMessage;
    if (message.startsWith(this._prefix)) {
      const handler = this._cmd.get(message.slice(1));
      if (handler !== undefined) {
        handler(chatMessage);
      }
    }
  }

  public registerCmd(name: string, handler: (message: ChatMessage) => void) {
    this._cmd.set(name, handler);
  }
}
