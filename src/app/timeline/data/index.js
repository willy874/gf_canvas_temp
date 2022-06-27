import {
  Collection
} from '@base/utils';

/**
 * @template {EventModel} T
 * @extends {Collection<T>}
 */
export class EventCollection extends Collection {
  /**
   * @param {T[]} args 
   */
  constructor(args = []) {
    super();
    args.forEach((p) => {
      this.set(p.id, p);
    })
  }

  getMinStartTime() {
    const list = this.all()
    return list.length ? Math.min(...list.map(p => p.startTime)) : Date.now()
  }

  getMaxEndTime() {
    const list = this.all()
    return list.length ? Math.max(...list.map(p => p.endTime)) : Date.now()
  }
}