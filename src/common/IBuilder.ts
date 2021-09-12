import { DeepPartial } from '../utils';

export interface IBuilder<T extends Record<string, unknown>> {
  setFields(message: DeepPartial<T>): IBuilder<T>;

  validate(): boolean;

  build(): T | null;
}
