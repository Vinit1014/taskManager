import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAppContext } from "@/context/AppContext"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from 'sonner';

export function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { userInfo, setTasks } = useAppContext();

  useEffect(()=>{
    console.log("P "+priority);
    
  },[priority])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Clicked");
    
    e.preventDefault();
  
    // Handle form submission here
    const userId = userInfo?.id;
    const taskData = {
      title,
      startTime,
      endTime,
      priority: parseInt(priority),
      status: status ? "Finished" : "Pending",
      userId,
    }
  
    try {
      console.log("Taskdata status "+status);
      
      const response = await axiosInstance.post('/api/tasks', taskData);
      console.log(response);
      
      if (response.status === 201) {
        const updatedTasks = await axiosInstance.get(`/api/tasks/${userInfo.id}`);
        setTasks(updatedTasks.data);
        console.log("Task added:", response.data);
        
        // Reset form fields to their initial state
        setTitle('');
        setStartTime('');
        setEndTime('');
        setPriority('');
        setStatus(false);
  
        toast.success('Task added successfully');
        setOpen(false); // Close the dialog after success
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error('Failed to add the task');
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Apply for new jobs"
              className="w-full"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(e)=>{
                setPriority(e)
              }}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority"/>
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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End time</Label>
              <Input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="submit" className="bg-primary text-primary-foreground">
              Add task
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  // return (
  //   <Dialog open={open} onOpenChange={setOpen}>
  //     <DialogTrigger asChild>
  //       <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">
  //         Add task
  //       </Button>
  //     </DialogTrigger>
  //     <DialogContent className="sm:max-w-[425px]">
  //       <DialogHeader>
  //         <DialogTitle>Add new task</DialogTitle>
  //       </DialogHeader>
  //       <form onSubmit={handleSubmit} className="grid gap-4 py-4">
  //         <div className="grid gap-2">
  //           <Label htmlFor="title">Title</Label>
  //           <Input
  //             id="title"
  //             placeholder="Apply for new jobs"
  //             className="w-full"
  //             value={title}
  //             onChange={(e) => setTitle(e.target.value)}
  //           />
  //         </div>
  //         <div className="grid grid-cols-2 gap-4">
  //           <div className="grid gap-2">
  //             <Label htmlFor="priority">Priority</Label>
  //             <Select
  //               id="priority"
  //               value={priority}
  //               onChange={(e:any) => setPriority(e.target.value)}
  //             >
  //               <SelectTrigger>
  //                 <SelectValue placeholder="Select priority" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="1">1</SelectItem>
  //                 <SelectItem value="2">2</SelectItem>
  //                 <SelectItem value="3">3</SelectItem>
  //                 <SelectItem value="4">4</SelectItem>
  //                 <SelectItem value="5">5</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div className="grid gap-2">
  //             <Label>Status</Label>
  //             <div className="flex items-center gap-2">
  //               <span className="text-sm">Pending</span>
  //               <Switch
  //                 checked={status}
  //                 onCheckedChange={setStatus}
  //               />
  //               <span className="text-sm">Finished</span>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="grid grid-cols-2 gap-4">
  //           <div className="grid gap-2">
  //             <Label htmlFor="startTime">Start time</Label>
  //             <Input
  //               type="datetime-local"
  //               id="startTime"
  //               value={startTime}
  //               onChange={(e) => setStartTime(e.target.value)}
  //             />
  //           </div>
  //           <div className="grid gap-2">
  //             <Label htmlFor="endTime">End time</Label>
  //             <Input
  //               type="datetime-local"
  //               id="endTime"
  //               value={endTime}
  //               onChange={(e) => setEndTime(e.target.value)}
  //             />
  //           </div>
  //         </div>
  //         <div className="flex gap-3 justify-end">
  //           <Button type="submit" className="bg-primary text-primary-foreground">
  //             Add task
  //           </Button>
  //           <Button type="button" variant="outline" onClick={() => setOpen(false)}>
  //             Cancel
  //           </Button>
  //         </div>
  //       </form>
  //     </DialogContent>
  //   </Dialog>
  // )
}

