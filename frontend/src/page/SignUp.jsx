import React, { useState } from 'react'
import Login from '../Components/Login'
import SignIn from '../Components/SignIn'
import Button from '../Components/Button'

export default function SignUp() {
  const [login,setLogin] = useState('Login')
 
  return (
    
    <div id="app">
      <div className="login-box">
        <div className="options" >
          <Button type={"Login"} login={login} setLogin = {setLogin}  ></Button>
          <Button type={"Signup"} login={login} setLogin = {setLogin} ></Button>
          
        </div>
        <div className="login-content">
          {login==='Login'?<Login/>:<SignIn/>}
        </div>
      </div>
    </div>
    
  )
}
