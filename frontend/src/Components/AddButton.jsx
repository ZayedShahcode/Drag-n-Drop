import Plus from '../icons/Plus';
import colors from '../assets/colors.json'
import { useRef } from 'react';
import { getUser } from '../Context/UserContext';


const AddButton = ()=>{
    const startingPos = useRef(10);
    const {response,setResponse} = getUser();

    const addNote = ()=>{
        fetch('http://localhost:3000/notes',{
            method:"POST",
            credentials:'include',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                body:"Write Here",
                colors:colors[0],
                position:{
                    x:startingPos.current,
                    y:startingPos.current
                },
                user_id:response.token
            })
        })
        const change = {...response,changedAt:new Date()}
        setResponse(change)
        startingPos.current+=10;
    }

    return (
        <div id="add-btn" onClick={addNote}><Plus/></div>
    )
}

export default AddButton;