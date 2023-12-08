import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      setIsLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>
        Sign In
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4'
      >
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
          <p className='text-center text-semibold text-red-700 my-2'>
            Something went wrong!
          </p>
        )}
        <button
          disabled={isLoading}
          className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200'
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-4 justify-center'>
        <p>Do not have an account?</p>
        <Link to='/sign-up'>
          <span className='text-pink-300/70 font-bold'>
            Sign Up
          </span>
        </Link>
      </div>
    </div>
  );
}
