
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from "./pages/Signup/Signup";
import { AppProvider } from './context/AppContext';

function App() {

  return (
    <>
      <Router>
        <AppProvider>
          <Routes>
            <Route path='/dashboard' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' element={<Navigate to="/login" />} />
          </Routes>
        </AppProvider>
      </Router>
    </>
  )
}

export default App
