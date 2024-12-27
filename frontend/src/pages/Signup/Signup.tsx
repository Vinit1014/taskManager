import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import { validateSignUp } from '../../utils/helper'; 
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'sonner';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<any>('');
  const [error, setError] = useState<{ name: string | null; email: string | null; password: string | null }>({
    name: null,
    email: null,
    password: null,
  });

  const navigate = useNavigate();
  
  const handleSignUp = async (e:any) => {
    e.preventDefault();

    const { success, errors } = validateSignUp({ name, email, password });

    if (!success) {
      const fieldErrors = { name: null, email: null, password: null };
      errors.forEach((err:any) => {
        if (err.includes('Name')) {
          fieldErrors.name = err;
        }
        if (err.includes('Email')) {
          fieldErrors.email = err;
        }
        if (err.includes('Password')) {
          fieldErrors.password = err;
        }
      });
      setError(fieldErrors);
      toast.error('Form validation failed.');
      return;
    }
    console.log('Form is valid. Proceed with sign-up.');

    try {
      const response = await axiosInstance.post('/api/users/register', {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token); 
        toast.success('Sign-up successful! Redirecting to dashboard...');
        navigate('/dashboard'); 
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError({ name: null, email: null, password: error.response.data.message });
        toast.error('Sign-up failed: ' + error.response.data.message);
      } else {
        setError({ name: null, email: null, password: 'An unexpected error occurred. Please try again' });
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Name"
              className={`input-box ${error.name ? 'border-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}

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
              Sign Up
            </button>

            {/* Link to Login */}
            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;