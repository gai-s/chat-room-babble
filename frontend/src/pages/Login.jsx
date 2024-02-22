import { useState } from 'react';
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../features/Auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, message } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(loginAsync(userData))
      .unwrap()
      .then(() => {
        toast.success('Login successful');
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Login failed: ${message}`);
      });
  };

  if (isLoading) return <Spinner />;
  return (
    <div className='login-form'>
      <section>
        <h1>
          {' '}
          <FaUser /> Login
        </h1>
        <p>Login to create an account</p>
      </section>
      <section className='form'>
        <form onSubmit={handleSubmit}>
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
          <div className='form-group password-input'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => handleChange(e)}
              required
            />
            <button
              className='btn input-show-password'
              type='button'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}{' '}
            </button>
          </div>
          <button className='btn btn-block' type='submit'>
            Login
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
