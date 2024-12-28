import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import { validateLogin } from '../../utils/helper';  
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ email: string | null; password: string | null }>({
      email: null,
      password: null,
    });
  const navigate = useNavigate();
    
  const handleLogin = async (e:any) => {
    e.preventDefault();
    const { success, errors } = validateLogin({ email, password });
    
    if (!success) {
      const fieldErrors = { email: null, password: null };
      errors.forEach((err:any) => {
        if (err.includes('Email')) {
          fieldErrors.email = err;
        }
        if (err.includes('Password')) {
          fieldErrors.password = err;
        }
      });
      setError(fieldErrors);
      return;
    }

    console.log('Form is valid. Proceed with login.');
    try{
      const response = await axiosInstance.post("/api/users/login",{
        email: email,
        password: password,
      })

      if (response.data && response.data.token){
        localStorage.setItem("token", response.data.token)
        toast.success('Login successful! Redirecting to dashboard...');
        navigate('/dashboard')
      }
    }catch(error:any){
      if (error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
        toast.error('Login failed: ' + error.response.data.message);
      }else{
        setError({ email: null, password: 'An unexpected error occurred. Please try again.' });
        toast.error('An unexpected error occurred. Please try again.'); 
      }
    }

  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className={`input-box ${error.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}

            {/* Password Input */}
            <PasswordInput
              value={password}
              onChange={(e:any) => setPassword(e.target.value)}
              className={error.password ? 'border-red-500' : ''}
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-primary">
              Login
            </button>

            {/* Sign Up Link */}
            <p className="text-sm text-center mt-4">
              Not registered yet?{' '}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;