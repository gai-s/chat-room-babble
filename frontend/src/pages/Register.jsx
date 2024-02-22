import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { registerAsync } from '../features/Auth/authSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, message } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = userData;

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
      console.log('Passwords do not match');
    } else {
      const userData = { name, email, password };

      dispatch(registerAsync(userData))
        // NOTE: by unwrapping the AsyncThunkAction we can navigate the user after
        // getting a good response from our API or catch the AsyncThunkAction
        // rejection to show an error message
        .unwrap()
        .then(() => {
          toast.success('Registration successful');
          navigate('/');
        })
        .catch((error) => {
          toast.error(`Registration failed: ${message}`);
        });
    }
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='register-form'>
      <section>
        <h1>
          {' '}
          <FaUser /> Register
        </h1>
        <p>Register to create an account</p>
      </section>
      <section className='form'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Add name'
              value={name}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Add email'
              value={email}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              name='password2'
              id='password2'
              placeholder='Confirm password'
              value={password2}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <button className='btn btn-block' type='submit'>
            Register
          </button>
        </form>
      </section>
    </div>
  );
}

export default Register;
