import React, { useState } from 'react'
import {Link , useNavigate} from 'react-router-dom'
import Oauth from '../../components/Oauth';
export default function SignUp() {
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formData,setformData]= useState({});
  const navigate = useNavigate();
  const handleChange =(ev)=>{
    setformData({...formData, [ev.target.id] : ev.target.value});
    
  };
  const handleSubmit =async (ev)=>{
    ev.preventDefault();
    try{
      setLoading(true);
      const res= await fetch('/api/auth/signup', {
        method:'POST',
        headers:{
          'Content-Type': `application/json`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if(data.success ==false){
        setError(true)
      }
      navigate('/sign-in');
    }
    catch(error){
      setLoading(false);  
      setError(true);
    }
    
  };
  return (
    <div className='p-3 max-w-sm mx-auto'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' id='username' className='bg-slate-200 p-3 rounded-lg ' onChange={handleChange}/>
        <input type="email" placeholder='Email' id='email' className='bg-slate-200 p-3 rounded-lg ' onChange={handleChange}/>
        <input type="password" placeholder='password' id='password' className='bg-slate-200 p-3 rounded-lg ' onChange={handleChange}/>
        <button disabled={loading} className='bg-red-500 rounded-lg p-2 hover:opacity-80'>
        {loading ? 'Loading...':'Sign Up'}</button>
        <Oauth/>
      </form>
      <div className="flex flex-row gap-2 mt-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
        <span className='text-red-500'>Sign In</span>
        </Link>
      </div>
      <p className='text-red-700 mt-3'>{error && 'Something went wrong!'}</p>
    </div>
  )
}

