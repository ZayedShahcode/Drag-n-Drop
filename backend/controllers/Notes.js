const {promisify}  = require('util');
const Note = require('../models/Note')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getAllNotes = async (req,res)=>{
    try{
        // const decoded = await promisify(jwt.verify)(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
        const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
        const notes = await Note.find({user_id:`${decoded.id}`});

        res.status(200).json({
            Notes: notes
        })
    }
    catch(err){
        console.log(err);
        res.status(404).send(err);
    }
}

const addNewNote = async (req,res)=>{
    try{
        const decoded = await promisify(jwt.verify)(req.body.user_id,process.env.JWT_SECRET);
        req.body = {...req.body,user_id:decoded.id}
        await Note.create(req.body);
        res.status(200).send("Note added successfully")
    }
    catch(err){
        console.log(err);
        res.send(err);
    }

}

const updateNotePosition= async (req,res)=>{
    try{
        // console.log(req.body)
        const id = { _id : req.body.id};
        // const position ={position : req.body.position}
        const keyt = req.body.key;
        const value = req.body.value;
        const payload  = {[keyt] : value}
        await Note.findOneAndUpdate(id,payload);
        res.status(200).json({
            "status":"Success"
        }
        )

    }
    catch(err){
        res.send(err);
    }
}

const deleteNote = async (req,res)=>{
    try{
        const id = { _id : req.body.id };
        await Note.findOneAndDelete(id);
        res.status(200).json({
            "Status":"Deleted Note Successfully"
        })
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}

module.exports = {getAllNotes,addNewNote,updateNotePosition,deleteNote};