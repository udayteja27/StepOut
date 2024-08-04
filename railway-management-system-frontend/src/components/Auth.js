import React, { useState } from 'react';
import { signup, login } from '../api';
import './Auth.css';

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isLogin ? await login(form) : await signup(form);
      setUser(response.data);
      setError('');
    } catch (error) {
      setError('Failed to authenticate. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        {!isLogin && <input type="email" name="email" placeholder="Email" onChange={handleChange} required />}
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Switch to Signup' : 'Switch to Login'}</button>
    </div>
  );
};

export default Auth;
