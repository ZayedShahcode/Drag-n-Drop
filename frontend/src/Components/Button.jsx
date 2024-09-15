import React from 'react'

export default function Button({type,login,setLogin}) {

    
  return (
    <div className={'button-box ' + (login===type?'active':'')} onClick={()=>{setLogin(type)}} >
        <span>{type}</span>
    </div>
  )
}
