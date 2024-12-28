"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Task } from "@/types"
import { Pencil } from 'lucide-react'
import { useAppContext } from "@/context/AppContext"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"


interface EditTaskDialogProps {
  task: Task
  index: any
}

export function EditTaskDialog({ task, index }: EditTaskDialogProps) {
  const { userInfo, setTasks } = useAppContext();
  const [open, setOpen] = useState(false)
  const [editedTask, setEditedTask] = useState({
    ...task,
    startTime: formatDateTimeForInput(task.startTime),
    endTime: formatDateTimeForInput(task.endTime)
  })
  const [status, setStatus] = useState(task.status === 'Finished')

  function formatDateTimeForInput(dateTimeString: string): string {
    if (!dateTimeString) {
      return ""; // Return empty string if no valid date
    }

    const [date, time] = dateTimeString.split(' '); // Split date and time
    const [day, month, year] = date.split('-');   // Reformat dd-mm-yyyy to yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    return `${formattedDate}T${time}`; // Return in yyyy-mm-ddTHH:mm format
  }


  // useEffect(()=>{
  //   console.log(editedTask);
  // },[task])

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTask: Task = {
      ...editedTask,
      status: status ? 'Finished' : 'Pending',
      // startTime: editedTask.startTime,
      startTime: new Date(editedTask.startTime).toISOString(),
      // endTime: editedTask.endTime
      endTime: new Date(editedTask.endTime).toISOString()
    };

    try {
      const dataa = {
        title: updatedTask.title,
        startTime: updatedTask.startTime,
        endTime: updatedTask.endTime,
        priority: updatedTask.priority,
        status: updatedTask.status,
        userId: userInfo?.id
      }

      const response = await axiosInstance.put(`api/tasks/${task._id}`,dataa);
      console.log(response);
      
      toast.success("Updated successfully");

      if (response.status == 200) {
        const updatedTasks = await axiosInstance.get(`/api/tasks/${userInfo.id}`);
        setTasks(updatedTasks.data);
        
      }
      setOpen(false);
      // onUpdate(response.data);

    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error in updating.")
    }

  
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="text-sm">Task ID: {index}</div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={String(editedTask.priority)}
                onValueChange={(value) => setEditedTask({ ...editedTask, priority: Number(value) })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">Pending</span>
                <Switch
                  checked={status}
                  onCheckedChange={setStatus}
                />
                <span className="text-sm">Finished</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                type="datetime-local"
                id="startTime"
                value={editedTask.startTime}
                onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End time</Label>
              <Input
                type="datetime-local"
                id="endTime"
                value={editedTask.endTime}
                onChange={(e) => setEditedTask({ ...editedTask, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="submit" className="bg-primary text-primary-foreground">
              Update
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

