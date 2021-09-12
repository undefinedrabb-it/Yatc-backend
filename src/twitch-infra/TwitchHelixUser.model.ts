import { HelixUser } from 'twitch';
import { UserBuilder } from '../domain/User';

export const HelixUserToDomainUser = (helixUser: HelixUser): UserBuilder => {
  return new UserBuilder({
    id: helixUser.id,
    avatar: helixUser.profilePictureUrl,
    displayName: helixUser.displayName,
  });
};
