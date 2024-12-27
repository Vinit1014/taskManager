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

function formatDateTimeForInput(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toISOString().slice(0, 16);
}

interface EditTaskDialogProps {
  task: Task
  onUpdate: (task: Task) => void
}

export function EditTaskDialog({ task, onUpdate }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [editedTask, setEditedTask] = useState({
    ...task,
    startTime: formatDateTimeForInput(task.startTime),
    endTime: formatDateTimeForInput(task.endTime)
  })
  const [status, setStatus] = useState(task.status === 'Finished')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTask: Task = {
      ...editedTask,
      status: status ? 'Finished' : 'Pending',
      startTime: new Date(editedTask.startTime).toLocaleString(),
      endTime: new Date(editedTask.endTime).toLocaleString()
    };
    onUpdate(updatedTask);
    setOpen(false);
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
            <div className="text-sm">Task ID: {task.id}</div>
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

