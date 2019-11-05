const express = require('express')
const app = express()
const port = 3000
var serveIndex = require('serve-index')
let _ = require('lodash')

let GAMES = {}

let mock = {
  id: 0,
  board: [
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
  ],
  winner: '',
  turn: '',
  valid_subgames: []
}
let counter = 0;
let createGame = () => {
  let id = counter++
  return {
    id,
    board: [
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
      ['','','','','','','','',''],
    ],
    winner: '',
    turn: '',
    valid_subgames: []
  }

}

let findGame = (id) => {
  return GAMES[id]
}

let makeMoveInGame = (id, moveData) => {
  console.log(moveData)
}


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/game/:id', (req, res) => res.end(JSON.stringify(findGame(req.params.id))))
app.post('/game/', (req, res) => res.end(JSON.stringify(createGame())))

app.post('/move/:id', (req, res) => makeMoveInGame(req.params.id, req.data))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
