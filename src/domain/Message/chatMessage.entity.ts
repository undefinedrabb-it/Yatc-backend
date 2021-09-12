/* eslint-disable max-classes-per-file */
import { User, UserBuilder } from '../User';
import { DeepPartial } from '../../utils';

export interface ChatMessage {
  id: string;
  user: User;
  message: string;
  timestamp: string;
}

export class MessageBuilder {
  private _user: UserBuilder;

  private _message: DeepPartial<ChatMessage>;

  constructor(message: DeepPartial<ChatMessage>) {
    this._user = new UserBuilder(message);
    this._message = message;
  }

  private readonly requiredField: (keyof ChatMessage)[] = [
    'id',
    'message',
    'timestamp',
  ];

  public setFields(message: Partial<ChatMessage>) {
    this._message = { ...message, ...this._message };
  }

  public setUserFields(user: Partial<User>) {
    this._user.setFields(user);
  }

  public validate(): boolean {
    return (
      this.requiredField.every((f) => this._message[f] !== undefined) &&
      this._user.validate()
    );
  }

  public build(): ChatMessage | null {
    const m = this._message;
    const u = this._user.build();
    m.user = u !== null ? u : undefined;
    if (
      m !== undefined &&
      m.id !== undefined &&
      m.user !== undefined &&
      m.message !== undefined &&
      m.timestamp !== undefined
    ) {
      return m as ChatMessage;
    }
    return null;
  }

  get message() {
    return this._message;
  }

  get userBuilder() {
    return this._user;
  }
}
