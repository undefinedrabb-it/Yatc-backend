// eslint-disable-next-line max-classes-per-file
import { DeepPartial } from '../utils';
import { IBuilder } from './IBuilder';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class SampleBuilder<T extends Record<string, unknown>>
  implements IBuilder<T>
{
  private _entity: DeepPartial<T> = {};

  public setFields(entity: DeepPartial<T>): IBuilder<T> {
    this._entity = { ...entity, ...this._entity };
    return this;
  }

  private readonly requiredField: (keyof T)[] = [];

  public validate(): boolean {
    return this.requiredField.every((f) => this._entity[f] !== undefined);
  }

  // eslint-disable-next-line class-methods-use-this
  public build(): T | null {
    return null;
  }
}
