export class MoveEvent extends CustomEvent {
  constructor(event, args) {
    super('move', {
      detail: event
    })
    this.moveX = args.moveX
    this.moveY = args.moveY
  }
}