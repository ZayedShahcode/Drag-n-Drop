import React, { useState } from 'react'
import { Navigate, redirect, useNavigate } from 'react-router-dom';
import { getUser } from '../Context/UserContext';


export default function Login() {

  // const {email,setEmail,password,setPassword,response,setResponse} = useNotes();
  const {email,setEmail,password,setPassword,response,setResponse,setCurrUser} = getUser()
  const navigate= useNavigate();
  
  const handleButtonClick = (e)=>{
    e.preventDefault();
    fetch('http://localhost:3000/users/login',{
      method:"POST",
      credentials: 'include',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({email:email,password:password})
    })
    .then(res=>{
      return res.json();
    })
    .then(data=>{setResponse(data)
      
    })
    if(response.status==='success'){
      navigate('/notes')
    }
    
  }
  return (
    <>

      <input type="text" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email'/>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password'/>
      <button onClick={handleButtonClick} style={{fontWeight:"bold",width:'92px'}}>Login </button>
    </>
  )
}
