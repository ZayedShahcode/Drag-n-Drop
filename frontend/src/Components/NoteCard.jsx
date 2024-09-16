import { useRef, useEffect, useState } from 'react'
import {DeleteButton} from './DeleteButton'
import Spinner from '../icons/Spinner'
import { setNewOffset, autoGrow, setZIndex, bodyParser } from '../../utils';
import {useNotes} from '../Context/NoteContext'

export const NoteCard = ({ note }) => {
    // const body = JSON.parse(note.body);
    const body = bodyParser(note.body);

    const [position, setPosition] = useState(note.position)
    const [saving, setSaving] = useState(false);

    // const colors = JSON.parse(note.colors)
    const colors = bodyParser(note.colors);

    const textAreaRef = useRef(null);
    const keyUpTimer = useRef(null);

    let mouseStartPos = { x: 0, y: 0 }
    const cardRef = useRef(null);
    const {selectedNote,setSelectedNote}= useNotes();

    useEffect(() => {
        autoGrow(textAreaRef);
    }, [])



    const mouseDown = (e) => {
        if(e.target.className ==='card-header')
        {
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);

            setZIndex(cardRef.current);
            setSelectedNote(note);
        }
            
    }
    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir)

        //3 - Update card top and left position.
        setPosition(newPosition);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData('position', newPosition)

    }

    const saveData = (key, value) => {
        fetch('https://drag-n-drop-server.onrender.com/notes', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: note._id,
                key: key,
                value: value
            })
        })
            
        setSaving(false)
    }

    const handleKeyUp = () => {
        setSaving(true);
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData('body', textAreaRef.current.value)
        }, 2000)

    }

    return (
        <div className="card" ref={cardRef} style={{
            backgroundColor: colors.colorBody,
            left: `${position.x}px`,
            top: `${position.y}px`
        }} >

            <div onMouseDown={mouseDown} className="card-header" style={{ backgroundColor: colors.colorHeader }}>
                <DeleteButton note_id={note._id} ></DeleteButton>
                {
                    saving && (
                        <div className="card-saving">
                            <Spinner color={colors.colorText} />
                            <span style={{ color: colors.colorText }}>Saving...</span>
                        </div>
                    )
    }
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    ref={textAreaRef}
                    defaultValue={body}
                    style={{ color: colors.colorText }}
                    onInput={() => { autoGrow(textAreaRef) }}
                    onFocus={() => { setZIndex(cardRef.current)
                        setSelectedNote(note)
                     }}
                    
                >
                </textarea>
            </div>
        </div>
    )
}
