const express = require('express')
const NotesRouter = express.Router();
const NotesController = require('../controllers/Notes')
const authController = require('../controllers/authController')

NotesRouter.route('/')
.get(authController.protect,NotesController.getAllNotes)
.post(NotesController.addNewNote)
.patch(NotesController.updateNotePosition)
.delete(authController.protect,NotesController.deleteNote)

module.exports = NotesRouter