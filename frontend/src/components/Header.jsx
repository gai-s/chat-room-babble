import React from 'react';
import { FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/Auth/authSlice';

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>Babble Planet</Link>
      </div>
      <ul>
        {user ? (
          <li onClick={() => dispatch(logout())}>
            <Link to='/'>
              <FaSignOutAlt />
              Logout
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt />
                Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser />
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
