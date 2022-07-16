type PrimaryKeyType = string | number

class ICollection<T> {
  current: Record<PrimaryKeyType, T>
  primaryKey: PrimaryKeyType
  has(key: PrimaryKeyType): boolean
  keys(): string[]
  all(): T[]
  clear(): void
  get(key: PrimaryKeyType): T
  set(key: PrimaryKeyType, value: any): void
  delete(key: PrimaryKeyType): void
  getList(sort: Array<PrimaryKeyType | T>): T[]
}

type TimingFunction = (x: number) => number
