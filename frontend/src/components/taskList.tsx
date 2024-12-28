
import { useState, useEffect } from "react";
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
import { AddTaskDialog } from "./addTaskDialog";
import { EditTaskDialog } from "./editTaskDialog";
import { Task } from "@/types";
import { useAppContext } from "@/context/AppContext"; // Import AppContext
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

export function TaskList() {
  const { tasks, userInfo } = useAppContext(); // Get user info from context
  const [taskList, setTaskList] = useState<Task[]>(tasks); // Store tasks
  const [sortValue, setSortValue] = useState<string | undefined>();
  const [priorityValue, setPriorityValue] = useState<string | undefined>();
  const [statusValue, setStatusValue] = useState<string | undefined>();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]); // Store selected task IDs

  useEffect(()=>{
    console.log(selectedTasks);
  },[selectedTasks])

  // Fetch tasks when the component mounts
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleCheckboxChange = (taskId: string) => {
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(taskId)) {
        return prevSelectedTasks.filter((id) => id !== taskId); // Unselect the task
      } else {
        return [...prevSelectedTasks, taskId]; // Select the task
      }
    });
  };
  
  const handleDeleteSelectedTasks = async () => {
    try {
      if (selectedTasks.length === 0) {
        toast.error("Please select at least one task to delete.");
        return;
      }
  
      const response = await axiosInstance.delete(
        "api/tasks/delete", // Backend route to handle task deletion
        {
          data: { taskIds: selectedTasks }
        }
      );
      
      if (response.status == 200) {
        // On success, refresh the task list (or remove deleted tasks locally)
        setTaskList(taskList.filter((task) => !selectedTasks.includes(task._id)));
        setSelectedTasks([]); // Clear the selection
        toast.success('Selected tasks deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
      toast.error('Failed to delete selected tasks');
    }
  };
  

  const fetchTasks = async () => {
    try {
      const params: Record<string, string> = {};
      if (priorityValue) params.priority = priorityValue;
      if (statusValue) params.status = statusValue;
      if (sortValue) {
        switch (sortValue) {
          case "sasc":
            params.sortBy = "startTimeAsc";
            break;
          case "sdesc":
            params.sortBy = "startTimeDesc";
            break;
          case "easc":
            params.sortBy = "endTimeAsc";
            break;
          case "edesc":
            params.sortBy = "endTimeDesc";
            break;
          default:
            break;
        }
      }

      // console.log("Params is "+params);
      
      const response = await axiosInstance.get(`api/tasks/${userInfo?.id}`, {
        params,
      });
      
      setTaskList(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on mount and when filters/sort change
  }, [sortValue, priorityValue, statusValue]);

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
        <Button variant="outline" className="text-destructive" onClick={handleDeleteSelectedTasks}>
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
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
          {taskList.map((task, index) => (
            <TableRow key={task._id}>
              <TableCell>
                <Checkbox checked={selectedTasks.includes(task._id)} onCheckedChange={() => handleCheckboxChange(task._id)}/>
              </TableCell>
              <TableCell>{index+1}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.startTime}</TableCell>
              <TableCell>{task.endTime}</TableCell>
              <TableCell>{task.totalTimeToFinish}</TableCell>
              <TableCell>
                <EditTaskDialog task={task} index={index+1}  />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


