import React, { useState } from 'react'
import { getUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const {email,setEmail,password,setPassword,response,setResponse,setCurrUser} = getUser()
  const [confirmPassword,setConfirmPassword] = useState('');
  const navigate = useNavigate()
  const handleButtonClick = (e)=>{
    e.preventDefault();
    fetch('http://localhost:3000/users/signup',{
      method:"POST",
      credentials:'include',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({email:email,password:password,confirmPassword:confirmPassword})
    })
    .then(res=>{
      return res.json();
    })
    .then(data=>{setResponse(data)})

  if(response.status==='success'){
      navigate('/notes')
    }
  }
  return (
    <>
      <input type="text" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email'/>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password'/>
      <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder='Confirm Password'/>
      <button onClick={handleButtonClick} style={{fontWeight:"bold",width:'92px'}}>Signup </button>
    </>
  )
}
