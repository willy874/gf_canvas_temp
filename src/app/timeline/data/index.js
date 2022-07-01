import {
  Collection
} from '@base/utils';
import dayjs from 'dayjs';

/**
 * @template {EventModel} T
 * @extends {Collection<T>}
 * @implements {IEventCollection<T>}
 */
export class EventCollection extends Collection {
  /**
   * @param {T[]} args 
   */
  constructor(args = []) {
    super();
    args.forEach((p) => {
      this.set(p.id, new EventModel(p));
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

/**
 * @implements {IEventModel}
 */
export class EventModel {
  constructor(args = {}) {
    this.id = args.id
    this.startTime = dayjs(args.startTime).valueOf()
    this.endTime = dayjs(args.endTime).valueOf()
    this.title = args.title
    this.type = args.type
  }
}