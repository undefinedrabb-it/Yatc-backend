export interface IRepo<T> {
  findBy(fitler: Partial<T>): Promise<T[]>;
  findOneBy(entity: Partial<T>): Promise<T>;
  create(entity: T): T;
}
