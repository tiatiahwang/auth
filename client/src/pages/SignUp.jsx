import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>
        SignUp
      </h1>
      <form className='flex flex-col gap-4'>
        <input
          type='text'
          id='username'
          className='bg-gray-100 rounded-md p-3'
          placeholder='username'
        />
        <input
          type='email'
          id='email'
          className='bg-gray-100 rounded-md p-3'
          placeholder='email'
        />
        <input
          type='password'
          id='password'
          className='bg-gray-100 rounded-md p-3'
          placeholder='password'
        />
        <button className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400'>
          Sign Up
        </button>
      </form>
      <div className='flex gap-2 mt-4 justify-center'>
        <p>Already have an account?</p>
        <Link to='/sign-in'>
          <span className='text-pink-300/70 font-bold'>
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}
