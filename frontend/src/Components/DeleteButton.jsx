import React from 'react'
import Trash from '../icons/Trash'
import { getUser } from '../Context/UserContext'


export  const DeleteButton = ({note_id}) => {
    const {response,setResponse} = getUser();
    const handleOnClick = ()=>{
        fetch('https://drag-n-drop-server.onrender.com/notes',{
            method: "DELETE",
            credentials:"include",
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer '+response.token
            },
            body:JSON.stringify({
                id : note_id
            })   
        }
    )
        const change = {...response,changedAt:new Date()}
        setResponse(change)
}
    
  return (
    <div 
        onClick={handleOnClick}
    >
        <Trash></Trash>
    </div>
  )
}
