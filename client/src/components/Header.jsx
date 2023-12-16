import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import AVATAR_DEFAULT from '../assets/avatar.jpg';

export default function Header() {
  const { currentUser } = useSelector(
    (state) => state.user,
  );
  return (
    <div className='bg-pink-100'>
      <div className='flex justify-between items-center max-w-7xl mx-auto p-4'>
        <div className='font-bold'>
          <Link to='/'>Auth</Link>
        </div>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/about'>
            <li>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                src={currentUser.avatar ?? AVATAR_DEFAULT}
                alt='avatar'
                className='h-7 w-7 rounded-full object-cover'
              />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
