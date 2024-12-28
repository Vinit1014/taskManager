import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';


interface AppContextType {
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(()=>{
        console.log(tasks);
    },[tasks])

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/api/users/info');
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.clear();
                
            }
        }
    };

    // Fetch tasks
    const getTasks = async (userId: string) => {
        console.log("user id is "+userId);
        
        try {
        const response = await axiosInstance.get(`/api/tasks/${userId}`);
        // console.log(response.data);
        
        if (response.data) {
            setTasks(response.data);
        }
        } catch (error) {
        console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
        await getUserInfo();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (userInfo?.id) {
            getTasks(userInfo.id);
        }
    }, [userInfo]);

    return (
        <AppContext.Provider value={{ userInfo, setUserInfo, tasks, setTasks }}>
        {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
