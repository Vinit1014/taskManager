import {useEffect, useState} from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { SummaryStats } from '@/components/summaryStats'
import { TaskList } from '@/components/taskList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Home = () => {

    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    
    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getUserInfo = async()=>{
        try {
            const response = await axiosInstance.get('/api/users/info');
            if (response.data && response.data.user){
                setUserInfo(response.data.user);
            }
        } catch (error:any) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }

    useEffect(()=>{
        getUserInfo();
        return ()=>{};
    },[])
  return (
    <div>
        <Tabs defaultValue="dashboard">
            <div className="flex h-16 items-center px-4 border-b">
                <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="task-list">Task list</TabsTrigger>
                </TabsList>
                </div>
                <Button variant="outline" className="ml-auto" onClick={onLogout}>
                Sign out
                </Button>
            </div>
            <main className="flex-1 space-y-4 p-8 pt-6">
                <TabsContent value="dashboard" className="space-y-4">
                <div className="grid gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
                    <SummaryStats />
                </div>
                </TabsContent>
                <TabsContent value="task-list" className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Task list</h2>
                </div>
                <TaskList />
                </TabsContent>
            </main>
        </Tabs>
    </div>
  )
}

export default Home