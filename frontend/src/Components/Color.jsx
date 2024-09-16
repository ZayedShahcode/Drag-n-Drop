import React from 'react'
import { useNotes } from '../Context/NoteContext';
import { getUser } from '../Context/UserContext';

export default function Color({color}) {
    const {selectedNote} = useNotes();
    const {response,setResponse } = getUser();
    const changeColor = ()=>{
        fetch('https://drag-n-drop-server.onrender.com/notes',{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            id:selectedNote._id,
            key:'colors',
            value:color
          })

        })
        const change = {...response,changedAt:new Date()}
        setResponse(change);
    }
  return (
    <div className="color"
        onClick={changeColor}
        style={{backgroundColor:color.colorHeader}}
    ></div>
  )
}
