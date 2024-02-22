import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaRocketchat } from 'react-icons/fa';

function Home() {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <section>
        <h1>Hello {user && user.name}</h1>
      </section>

      <Link to='/chat' className='btn btn-block'>
        <FaRocketchat />
        Enter chat Planet
      </Link>
    </>
  );
}

export default Home;
