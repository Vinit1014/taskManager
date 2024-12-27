
// import { Pencil } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { tasks } from "@/lib/data"

// export function TaskList() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90">Add task</Button>
//         <Button variant="outline" className="text-destructive">Delete selected</Button>
//         <div className="ml-auto flex items-center gap-2">
          
//           {/* Sort */}
//           <Select>
//             <SelectTrigger className='w-[100px]'>
//                 <SelectValue placeholder="Sort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="sasc">Start time: ASC</SelectItem>
//               <SelectItem value="sdesc">Start time: DESC</SelectItem>
//               <SelectItem value="easc">End time: ASC</SelectItem>
//               <SelectItem value="edesc">End time: DESC</SelectItem>
//               <SelectItem value="removeSort" className="text-red-500">
//                 Remove sort
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Priority */}
//           <Select>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Priority" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="1">1</SelectItem>
//               <SelectItem value="2">2</SelectItem>
//               <SelectItem value="3">3</SelectItem>
//               <SelectItem value="4">4</SelectItem>
//               <SelectItem value="5">5</SelectItem>
//               <Button className='text-red-500 bg-white hover:bg-slate-00'>Remove filter</Button>
//               {/* <SelectItem value="removeFilter" className="text-red-500">
//                 Remove filter
//               </SelectItem> */}
//             </SelectContent>
//           </Select>

//           {/* Status */}
//           <Select>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="finished">Finished</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[50px]">
//               <Checkbox />
//             </TableHead>
//             <TableHead>Task ID</TableHead>
//             <TableHead>Title</TableHead>
//             <TableHead>Priority</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Start Time</TableHead>
//             <TableHead>End Time</TableHead>
//             <TableHead>Total time to finish (hrs)</TableHead>
//             <TableHead className="w-[50px]">Edit</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {tasks.map((task) => (
//             <TableRow key={task.id}>
//               <TableCell>
//                 <Checkbox />
//               </TableCell>
//               <TableCell>{task.id}</TableCell>
//               <TableCell>{task.title}</TableCell>
//               <TableCell>{task.priority}</TableCell>
//               <TableCell>{task.status}</TableCell>
//               <TableCell>{task.startTime}</TableCell>
//               <TableCell>{task.endTime}</TableCell>
//               <TableCell>{task.totalTimeToFinish}</TableCell>
//               <TableCell>
//                 <Button variant="ghost" size="icon">
//                   <Pencil className="h-4 w-4" />
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

import { useState } from "react"; // Import useState for managing state
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tasks as initialTasks } from "@/lib/data";
import { AddTaskDialog } from "./addTaskDialog";
import { EditTaskDialog } from "./editTaskDialog";
import { Task } from "@/types";

export function TaskList() {
  // State for "Sort", "Priority", and "Status" selects
  const [sortValue, setSortValue] = useState<string | undefined>();
  const [priorityValue, setPriorityValue] = useState<string | undefined>();
  const [statusValue, setStatusValue] = useState<string | undefined>();

  const [taskList, setTaskList] = useState(initialTasks);
  
  const handleUpdateTask = (updatedTask: Task) => {
    setTaskList(taskList.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };


  const handleSortChange = (value: string) => {
    
    if (value === "removeSort") {
        setSortValue(undefined); // Reset to default placeholder
    } else {
      setSortValue(value); // Set the selected value
    }
  };

  const handlePriorityChange = (value: string) => {
    if (value === "removeFilter") {
      setPriorityValue(undefined); // Reset to default placeholder
    } else {
      setPriorityValue(value); // Set the selected value
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === "removeFilter") {
      setStatusValue(undefined); // Reset to default placeholder
    } else {
      setStatusValue(value); // Set the selected value
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Buttons */}
        <AddTaskDialog />
        <Button 
          variant="outline" 
          className="text-destructive">
          Delete selected
        </Button>

        {/* Filters */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sort Select */}
          <Select value={sortValue || ""} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sasc">Start time: ASC</SelectItem>
              <SelectItem value="sdesc">Start time: DESC</SelectItem>
              <SelectItem value="easc">End time: ASC</SelectItem>
              <SelectItem value="edesc">End time: DESC</SelectItem>
              <SelectItem value="removeSort" className="text-red-500">
                Remove sort
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Select */}
          <Select value={priorityValue || ""} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="removeFilter" className="text-red-500">
                Remove filter
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status Select */}
          <Select value={statusValue || ""} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="removeFilter" className="text-red-500">
                Remove filter
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Task ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Total time to finish (hrs)</TableHead>
            <TableHead className="w-[50px]">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskList.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.startTime}</TableCell>
              <TableCell>{task.endTime}</TableCell>
              <TableCell>{task.totalTimeToFinish}</TableCell>
              <TableCell>
                <EditTaskDialog task={task} onUpdate={handleUpdateTask} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


