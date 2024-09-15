import { createContext, useContext,useState } from "react";

const UserContext = createContext();


export function UserProvider({children}){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [response,setResponse] = useState({
        status:'failure',
        token:null,
        changedAt: new Date()
    })
    const [currUser,setCurrUser] = useState('');

    const contextData= {email,setEmail,password,setPassword,response,setResponse,currUser,setCurrUser}

    return <UserContext.Provider value={contextData}>
        {children}
    </UserContext.Provider>
}

export function getUser(){
    const context = useContext(UserContext);
    if(context){
        return context;
    }
    return "NONONO#"
}