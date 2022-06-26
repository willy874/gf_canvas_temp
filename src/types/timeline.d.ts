interface TimelineProps {
  width: number
  height: number
  startTime: number
  endTime: number
  x: number
  y: number
  list: EventModel[]
}

interface EventModel {
  id: number
  startTime: number
  endTime: number
  title: string
  type: string
}
