import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks if user is logged in

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/api/users/info');
      if (response.data && response.data.user) {
        setIsLoggedIn(true); // Set user as logged in
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        setIsLoggedIn(false); // Ensure state reflects logged-out status
        navigate('/login');
      }
    }
  };

  const onLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // Update state to logged out
    navigate('/login');
  };

  useEffect(() => {
    getUserInfo(); // Fetch user info on component mount
  }, []);

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md">
        {isLoggedIn ?
            <div className='flex'>
                <div>Dashboard</div>
                <div>Task List</div>
            </div>
        : <h2 className="text-xl font-medium text-slate-700 py-2">NoteManager</h2>}
        
        {isLoggedIn && ( // Only show logout button if logged in
            <button className="text-sm text-slate-700 underline" onClick={onLogout}>
            Logout
            </button>
        )}
    </div>
  );
};

export default Navbar;
