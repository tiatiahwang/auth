import { useSelector } from 'react-redux';

import AVATAR_DEFAULT from '../assets/avatar.jpg';

export default function Profile() {
  const { currentUser } = useSelector(
    (state) => state.user,
  );
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='font-semibold text-4xl text-center my-8'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <img
          src={currentUser.avater ?? AVATAR_DEFAULT}
          alt='avatar'
          className='w-24 h-24 self-center cursor-pointer rounded-full object-cover'
        />
        <input
          type='text'
          id='username'
          defaultValue={currentUser.username}
          className='bg-gray-100 rounded-md p-3'
          placeholder='username'
        />
        <input
          type='email'
          id='email'
          defaultValue={currentUser.email}
          className='bg-gray-100 rounded-md p-3'
          placeholder='email'
        />
        <input
          type='password'
          id='password'
          className='bg-gray-100 rounded-md p-3'
          placeholder='password'
        />
        <button className='bg-gray-300 text-white p-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200'>
          Update
        </button>
      </form>
      <div className='flex mt-4 justify-between'>
        <span className='text-red-500 cursor-pointer'>
          Delete Account
        </span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
}
