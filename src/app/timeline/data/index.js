import {
  Collection
} from '@base/utils';

export class EventCollection extends Collection {
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