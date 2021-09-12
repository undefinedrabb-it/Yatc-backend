/* eslint-disable class-methods-use-this */
import mongoose from 'mongoose';
import { User } from '../../domain/User';

interface UserEntity {
  twitchId: string;
  avatar?: string;
  brodcaster: boolean;
  displayName: string;
  username: string;
  isLurking: boolean;
}

export const domainUserToEntity = (user: User): UserEntity => ({
  twitchId: user.id,
  avatar: user.avatar,
  brodcaster: user.brodcaster,
  displayName: user.displayName,
  username: user.username,
  isLurking: user.isLurking,
});

export const entityTodomainUser = (entity: UserEntity): User => ({
  id: entity.twitchId,
  avatar: entity.avatar,
  brodcaster: entity.brodcaster,
  displayName: entity.displayName,
  username: entity.username,
  isLurking: entity.isLurking,
});

export const partialDomainUserToEntity = (
  user: Partial<User>,
): Partial<UserEntity> => ({
  twitchId: user.id,
  ...user,
});

const userSchema = new mongoose.Schema<UserEntity>({
  twitchId: String,
  avatar: String,
  userRole: String,
  brodcaster: Boolean,
  displayName: String,
  username: String,
  isLurking: Boolean,
});

// export const RawRepo = mongoose.model<UserEntity>('user', userSchema);
const UserModel = mongoose.model<UserEntity>('user', userSchema);

export class UserRepo {
  public async findBy(user: Partial<User>): Promise<User[]> {
    const us = await UserModel.find(user).exec();
    return us.map((u) => entityTodomainUser(u));
  }

  public async findOneBy(user: Partial<User>): Promise<User | null> {
    const us = await UserModel.findOne(user).exec();
    return us === null ? null : entityTodomainUser(us);
  }

  public async create(user: User): Promise<User> {
    const newChatter = new UserModel(domainUserToEntity(user));
    const us = await newChatter.save();
    return entityTodomainUser(us);
  }

  public async modify(
    filter: Partial<User>,
    user: Partial<User>,
  ): Promise<User | null> {
    const us = await UserModel.findOneAndUpdate(
      filter,
      partialDomainUserToEntity(user),
    ).exec();
    return us === null ? null : entityTodomainUser(us);
  }
}
