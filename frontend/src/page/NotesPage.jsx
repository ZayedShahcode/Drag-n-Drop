
import { NoteCard } from '../Components/NoteCard'
import { useNotes } from '../Context/NoteContext'
import Controls from '../Components/Controls'


export const NotesPage = () => {
  const { data } = useNotes();


  return (
    <div id="app">
      <div>
        {data.map(note => <NoteCard key={note._id} note={note} />)}
        <Controls></Controls>
      </div>
    </div>
  )
}
