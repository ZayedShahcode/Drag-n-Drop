import {createContext, CreateContext,useContext,useEffect,useState} from "react";
import Spinner from "../icons/Spinner"
import { getUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import {setCookie,getCookie} from '../../utils.js'

const NoteContext = createContext();

const NoteProvider = ({children})=>{
    const [loading,setLoading] = useState(true);
    const [data,setData] = useState([]);
    const [selectedNote,setSelectedNote] = useState(null);

    const {response,setResponse} = getUser();
    const navigate = useNavigate();
  
    
    
    useEffect(()=>{
    if(response.token ){
      fetch('http://localhost:3000/notes',{
        method:"GET",
        credentials: 'include',
        headers:{
            'Content-type':'application/json'
           
        },
       
    })
    .then(response => response.json())
    .then(dat=>setData(dat.Notes));
    setLoading(false);
    // setCookie('jwt',response.token,90)
}
else{
    navigate('/')
}
},[response,navigate])

    


    const contextData = {data,setData,selectedNote,setSelectedNote}
    return <NoteContext.Provider value={contextData}>
        {loading? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Spinner size="100" />
                </div>
            ) :children}
    </NoteContext.Provider>
}

const useNotes= ()=>{
    const context = useContext(NoteContext);
    if(context===undefined)
        throw new Error("NONONONO")
    return context;
}

export { NoteProvider,useNotes};
