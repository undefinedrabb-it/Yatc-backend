import { ChatUserstate } from 'tmi.js';
import { MessageBuilder } from '../domain/Message';

export type RawTwitchChatMessage = [
  channel: string,
  userstate: ChatUserstate,
  message: string,
  self: boolean,
];

export interface TwitchChatMessage {
  channel: string;
  userstate: ChatUserstate;
  message: string;
  self: boolean;
}

export const RawMessageObjectFactory = (
  raw: RawTwitchChatMessage,
): TwitchChatMessage => ({
  channel: raw[0],
  userstate: raw[1],
  message: raw[2],
  self: raw[3],
});

export const RawMessageToDomain = (
  tags: ChatUserstate,
  message: string,
): MessageBuilder => {
  const t = new Date(Date.now()).toString();
  const messageBuilder = new MessageBuilder({
    id: tags.id || '',
    message,
    timestamp: tags['tmi-sent-ts'] || t,
  });
  messageBuilder.setUserFields({
    brodcaster: tags.badges?.broadcaster === '1',
    displayName: tags['display-name'] || tags.username || '',
    username: tags.username || '',
  });
  return messageBuilder;
};
