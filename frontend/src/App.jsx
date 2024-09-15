import React from 'react'
import { NotesPage } from './page/NotesPage'
import {NoteProvider} from './Context/NoteContext'
import {UserProvider} from './Context/UserContext'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './page/SignUp'

export default function App() {
  return (
    // <NoteProvider>
    //   <div id="app">
    //     <NotesPage></NotesPage>
    //   </div>
    // </NoteProvider>

    
      
        <UserProvider>
      <Routes>
        <Route path="/" element={<SignUp/>}></Route>
        <Route path="notes" element={<NoteProvider><NotesPage/></NoteProvider>}  ></Route>
      </Routes>
      </UserProvider>
      
    

  )
}
