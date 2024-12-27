export type Task = {
    id: number
    title: string
    priority: number
    status: 'Pending' | 'Finished'
    startTime: string
    endTime: string
    totalTimeToFinish: number
  }
  
  export type PriorityStats = {
    priority: number
    pendingTasks: number
    timeLapsed: number
    timeToFinish: number
  }
  
  export const tasks: Task[] = [
    {
      id: 1,
      title: "Buy clothes",
      priority: 5,
      status: "Pending",
      startTime: "26-Nov-24 11:00 AM",
      endTime: "30-Nov-24 11:00 AM",
      totalTimeToFinish: 96
    },
    {
      id: 2,
      title: "Finish code",
      priority: 2,
      status: "Finished",
      startTime: "25-Nov-24 09:05 AM",
      endTime: "25-Nov-24 03:15 PM",
      totalTimeToFinish: 6.17
    },
    {
      id: 3,
      title: "Book travel tickets",
      priority: 4,
      status: "Pending",
      startTime: "19-Nov-24 10:00 PM",
      endTime: "20-Nov-24 11:00 PM",
      totalTimeToFinish: 25
    },
    {
      id: 4,
      title: "Order groceries",
      priority: 3,
      status: "Finished",
      startTime: "14-Oct-24 10:30 AM",
      endTime: "16-Oct-24 10:30 PM",
      totalTimeToFinish: 60
    },
    {
      id: 5,
      title: "Medical checkup",
      priority: 1,
      status: "Pending",
      startTime: "19-Nov-24 01:15 PM",
      endTime: "21-Dec-24 05:00 PM",
      totalTimeToFinish: 51.75
    }
  ]
  
  export const priorityStats: PriorityStats[] = [
    { priority: 1, pendingTasks: 3, timeLapsed: 12, timeToFinish: 8 },
    { priority: 2, pendingTasks: 5, timeLapsed: 6, timeToFinish: 3 },
    { priority: 3, pendingTasks: 1, timeLapsed: 8, timeToFinish: 7 },
    { priority: 4, pendingTasks: 0, timeLapsed: 0, timeToFinish: 0 },
    { priority: 5, pendingTasks: 6, timeLapsed: 30, timeToFinish: 6 }
  ]
  
  