import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { setAccessToken } from '../redux/auth/authSlice';
import { setRefreshToken } from '../utils/cookies';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post('/api/auth/signin', formData);
      if (response.status === 200) {
        dispatch(setAccessToken(response.data.accessToken));
        setRefreshToken(response.data.refreshToken);
        dispatch(signInSuccess(response.data));
        navigate('/');
      } else {
        dispatch(signInFailure(response.data));
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          id='email'
          className='bg-gray-100 rounded-md p-3'
          placeholder='email'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          className='bg-gray-100 rounded-md p-3'
          placeholder='password'
          onChange={handleChange}
        />

        {error && (
          <p className='text-center text-semibold text-red-700 my-2'>{error.message || 'Something went wrong!'}</p>
        )}
        <button
          disabled={isLoading}
          className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200'
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-4 justify-center'>
        <p>Do not have an account?</p>
        <Link to='/sign-up'>
          <span className='text-pink-300/70 font-bold'>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
