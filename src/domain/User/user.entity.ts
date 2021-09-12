export type UserRole = 'anonymous' | 'mod' | 'admin';

export interface User {
  id: string;
  avatar?: string;
  brodcaster: boolean;
  displayName: string;
  username: string;
  isLurking: boolean;
}

export class UserBuilder {
  private _user: Partial<User>;

  constructor(user: Partial<User>) {
    this._user = user;
  }

  private readonly requiredField: (keyof User)[] = [
    'id',
    'brodcaster',
    'displayName',
    'username',
    'isLurking',
  ];

  public setFields(user: Partial<User>) {
    this._user = { ...user, ...this._user };
  }

  public validate(): boolean {
    return this.requiredField.every((f) => this._user[f] !== undefined);
  }

  public build(): User | null {
    const u = this._user;
    if (
      u !== undefined &&
      u.id !== undefined &&
      u.brodcaster !== undefined &&
      u.displayName !== undefined &&
      u.username !== undefined &&
      u.isLurking !== undefined
    ) {
      return u as User;
    }
    return null;
  }

  get user() {
    return this._user;
  }

  public merge(builder: UserBuilder) {
    this.setFields(builder._user);
  }
}
