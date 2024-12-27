export interface Task {
    id: number
    title: string
    priority: number
    status: 'Pending' | 'Finished'
    startTime: string
    endTime: string
    totalTimeToFinish: number
  }
  
  // Optional: If you need to type the response from your backend
  export interface TaskResponse {
    success: boolean
    data: Task[]
    message?: string
  }
  
  // Optional: If you need to type the payload for creating/updating tasks
  export interface CreateTaskPayload {
    title: string
    priority: number
    status: 'Pending' | 'Finished'
    startTime: string
    endTime: string
  }
  
  export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
    id: number
  }
  
  