const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    body:{
        type:String
    },
    colors:{
            id:String,
            colorHeader:String,
            colorBody:String,
            colorText:String
    },
    position:{
        x:Number,
        y:Number
    },
    user_id: String

    
})

const Note  = mongoose.model('Note',NoteSchema);
module.exports = Note