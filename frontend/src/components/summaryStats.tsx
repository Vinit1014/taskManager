import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/AppContext"; // Ensure you have this context

export function SummaryStats() {
  const { tasks } = useAppContext(); // Access tasks from app context

  // State variables to store calculated stats
  const [totalTasks, setTotalTasks] = useState<any>(0);
  const [completedTasks, setCompletedTasks] = useState<any>(0);
  const [pendingTasks, setPendingTasks] = useState<any>(0);
  const [averageTimePerTask, setAverageTimePerTask] = useState<any>(0);
  const [totalTimeLapsed, setTotalTimeLapsed] = useState<any>(0);
  const [totalTimeToFinish, setTotalTimeToFinish] = useState<any>(0);
  const [priorityStats, setPriorityStats] = useState<any>([]);

  useEffect(() => {
    const totalTasksCount = tasks.length;

    const completedTasksCount = tasks.filter((task) => task.status === "Finished").length;
    const pendingTasksCount = totalTasksCount - completedTasksCount;

    const totalTimeSpent = tasks.reduce((sum, task) => {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const timeSpent = (end.getTime() - start.getTime()) / (1000 * 3600); 
      return sum + timeSpent;
    }, 0);
    const avgTimePerTask = totalTasksCount > 0 ? (totalTimeSpent / totalTasksCount).toFixed(1) : 0;

    const totalLapsedTime = tasks.reduce((sum, task) => {
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const timeSpent = (end.getTime() - start.getTime()) / (1000 * 3600);
      return sum + timeSpent;
    }, 0);

    const totalFinishTime = tasks.reduce((sum, task) => {
      if (task.status !== "Finished") {
        return sum + task.totalTimeToFinish;
      }
      return sum;
    }, 0); 

    const calculatedPriorityStats = [1, 2, 3, 4, 5].map((priority) => {
      const filteredTasks = tasks.filter((task) => task.priority === priority);
      const pendingFilteredTasks = filteredTasks.filter((task) => task.status !== "Finished");

      const pendingTasksCount = pendingFilteredTasks.length;

      const timeLapsed = pendingFilteredTasks.reduce((sum, task) => {
        const start = new Date(task.startTime);
        const end = new Date(task.endTime);
        const timeSpent = (end.getTime() - start.getTime()) / (1000 * 3600); 
        return sum + timeSpent;
      }, 0);

      const timeToFinish = pendingFilteredTasks.reduce((sum, task) => sum + task.totalTimeToFinish, 0);

      return {
        priority,
        pendingTasks: pendingTasksCount,
        timeLapsed,
        timeToFinish
      };
    });

    setTotalTasks(totalTasksCount);
    setCompletedTasks(completedTasksCount);
    setPendingTasks(pendingTasksCount);
    setAverageTimePerTask(avgTimePerTask);
    setTotalTimeLapsed(totalLapsedTime);
    setTotalTimeToFinish(totalFinishTime);
    setPriorityStats(calculatedPriorityStats);
  }, [tasks]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{((completedTasks / totalTasks) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{((pendingTasks / totalTasks) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average time per task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageTimePerTask} hrs</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total time lapsed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTimeLapsed.toFixed(1)} hrs</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total time to finish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTimeToFinish} hrs</div>
            <p className="text-xs text-muted-foreground">estimated based on endtime</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task priority</TableHead>
                <TableHead>Pending tasks</TableHead>
                <TableHead>Time lapsed (hrs)</TableHead>
                <TableHead>Time to finish (hrs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priorityStats.map((stat:any) => (
                <TableRow key={stat.priority}>
                  <TableCell>{stat.priority}</TableCell>
                  <TableCell>{stat.pendingTasks}</TableCell>
                  <TableCell>{stat.timeLapsed.toFixed(1)}</TableCell>
                  <TableCell>{stat.timeToFinish}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
