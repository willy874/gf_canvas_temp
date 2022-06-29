/**
 * @template T
 * @implements {ICollection<T>}
 */
export class Collection {
  constructor(data = {}, primaryKey = 'id') {
    /** @type {Record<PrimaryKeyType ,T>} */
    this.current = {};
    /** @type {PrimaryKeyType} */
    this.primaryKey = primaryKey;
    for (const key in data) {
      this.current[key] = data[key];
    }
  }

  keys() {
    return Object.keys(this.current)
  }

  all() {
    return Object.values(this.current);
  }

  clear() {
    this.current = {};
  }

  get(key) {
    return this.current[key];
  }

  set(key, value) {
    this.current[key] = value;
  }

  has(key) {
    return Boolean(this.current[key])
  }

  delete(key) {
    delete this.current[key];
  }

  getList(sort) {
    if (sort) {
      return sort.map((item) => {
        if (typeof item === 'number' || typeof item === 'string' || typeof item === 'symbol') {
          return this.get(item);
        }
        return item ? this.get(item[this.primaryKey]) : null;
      });
    }
    return this.all()
  }
}