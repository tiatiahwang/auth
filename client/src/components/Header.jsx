import { Link } from 'react-router-dom';

export default function Header() {
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
          <Link to='/sign-in'>
            <li>Sign In</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
