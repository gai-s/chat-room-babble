const axios = require('axios');

let token, id;

test('Register a user should responded with a token', async () => {
  expect.assertions(1);
  try {
    let user = { name: 'test', email: 'test@gmail.com', password: '1111' };
    const res = await axios.post('http://localhost:5000/api/users', user);
    token = res.data.token;
    id = res.data._id.toString();
    expect(res.data.token).toBeTruthy();
  } catch (error) {
    console.log(error);
  }
});

test('Register again the same user should result error of: User already exists', async () => {
  let user = { name: 'test', email: 'test@gmail.com', password: '1111' };
  expect.assertions(1);
  try {
    const res = await axios.post('http://localhost:5000/api/users', user);
  } catch (error) {
    const message = error.response.data.message;
    expect(message).toEqual('User already exists');
  }
});

test('Login with the registered user should responded with a token', async () => {
  const user = { email: 'test@gmail.com', password: '1111' };
  expect.assertions(1);
  try {
    const res = await axios.post('http://localhost:5000/api/users/login', user);
    expect(res.data.token).toBeTruthy();
  } catch (error) {
    console.log(error);
    expect(error).not.toBeTruthy();
  }
});

test('Delete the user should return a message: User removed', async () => {
  expect.assertions(1);
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(
      `http://localhost:5000/api/users/${id}`,
      config
    );
    expect(res.data.message).toBe('User removed');
  } catch (error) {
    console.log(error);
    expect(error).toBeFalsy();
  }
});

test('Second Delete should fail - User can not be deleted twice, request should return: Not authorized', async () => {
  expect.assertions(1);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios
    .delete(`http://localhost:5000/api/users/${id}`, config)
    .catch((error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.data?.message ||
        error?.message;
      expect(message).toMatch('Not authorized');
    });
});
