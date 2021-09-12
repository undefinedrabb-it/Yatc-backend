import { ApiClient } from 'twitch';
import { ILogger } from './utils';
import { UserRepo } from './mongo-infra';
import { MessageBuilder } from './domain/Message';
import { HelixUserToDomainUser } from './twitch-infra';
import { UserBuilder } from './domain/User';

function enchantUser(userBuilder: UserBuilder, m: MessageBuilder) {
  m.setUserFields({ isLurking: false });
  m.userBuilder.merge(userBuilder);
  return m;
}

export class MessageService {
  private readonly _twitchClient: ApiClient;

  private readonly _logger: ILogger;

  private readonly _userRepo: UserRepo;

  constructor(apiClient: ApiClient, userRepo: UserRepo, logger: ILogger) {
    this._twitchClient = apiClient;
    this._logger = logger;
    this._userRepo = userRepo;
  }

  public async Transform(m: MessageBuilder) {
    if (m.userBuilder.user?.username !== undefined) {
      const user = await this._userRepo.findBy({
        username: m.userBuilder.user?.username,
      });
      if (user.length === 0) {
        const chatter = await this._twitchClient.helix.users.getUserByName(
          m.userBuilder.user.username,
        );

        if (chatter !== null) {
          const mBuilder = enchantUser(HelixUserToDomainUser(chatter), m);

          const usr = mBuilder.userBuilder.build();
          if (usr !== null) {
            const newChatter = await this._userRepo.create(usr);
            m.setUserFields({ ...newChatter });
            return m;
          }
          m.setUserFields({
            id: chatter.id,
            avatar: chatter?.profilePictureUrl,
          });
          return m;
        }
      } else {
        m.setUserFields({ ...user[0] });
        return m;
      }
    }
    throw new Error('test');
  }
}
