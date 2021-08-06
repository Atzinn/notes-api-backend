const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/404')
const handleErrors = require('./middlewares/handleErrors')

require('dotenv').config()
require('./mongo')

const app = express()
const Note = require('./models/Note')

app.use(express.json())
app.use(cors())

// Index
app.get('/', (req, res) => {
  res.send('<h1>Hola mundo</h1>')
})

// Get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

// Get just one note
app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      return note ? res.json(note) : res.status(404).end()
    })
    .catch(err => {
      next(err)
    })
})

// Update a note
app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => res.json(result))
    .catch(err => next(err))
})

// Delete just one note
app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// Save a note
app.post('/api/notes', async (req, res, next) => {
  const usernote = req.body

  if (!usernote || !usernote.content) {
    return res
      .status(400)
      .json({ error: 'note.content is missing' })
  }

  const newNote = new Note({
    content: usernote.content,
    important:
      typeof usernote.important !== 'undefined' ? usernote.important : false,
    date: new Date().toISOString()
  })

  // newNote.save()
  //   .then(savedNote => res.status(201).json(savedNote))
  //   .catch(err => next(err))

  try {
    const savedNote = await newNote.save()
    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

// 404 Error
app.use(notFound)

// Errors
app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`)
})

module.exports = {
  app,
  server
}
