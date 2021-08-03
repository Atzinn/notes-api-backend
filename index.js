const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Hello world',
    date: new Date().toISOString(),
    important: true
  },
  {
    id: 2,
    content: 'Hello world 2',
    date: new Date().toISOString(),
    important: false
  },
  {
    id: 3,
    content: 'Hello world 3',
    date: new Date().toISOString(),
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)
  note ? res.json(note) : res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const usernote = req.body

  if (!usernote || !usernote.content) {
    return res.status(400).json({ error: 'note.content is missing' })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: usernote.content,
    important:
      typeof usernote.important !== 'undefined' ? usernote.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found'
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('Server runing on port 3001')
})
