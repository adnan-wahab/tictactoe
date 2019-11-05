const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
var serveIndex = require('serve-index')
let _ = require('lodash')

let GAMES = {}

let convertBoard = (board, sign) => {
  board = (typeof(board) == 'string')
    ? board = board.replace(/\s/g, '').split('')
    : flatten(board)
  return board.map(c => Number(c === sign))
}
const WINNING_BOARDS =[
  [1, 1, 1,
   0, 0, 0,
   0, 0, 0],

  [0, 0, 0,
   1, 1, 1,
   0, 0, 0],

  [0, 0, 0,
   0, 0, 0,
   1, 1, 1],

  [1, 0, 0,
   1, 0, 0,
   1, 0, 0],

  [0, 1, 0,
   0, 1, 0,
   0, 1, 0],

  [0, 0, 1,
   0, 0, 1,
   0, 0, 1],

  [1, 0, 0,
   0, 1, 0,
   0, 0, 1],

  [0, 0, 1,
   0, 1, 0,
   1, 0, 0]
 ]

let findWinner = (board, symbol) => {

   let converted = convertBoard(board, symbol)
   console.log(converted)
   return isBitVictory(converted)
}



let counter = 0;
let createGame = () => {
  let id = counter++
  console.log('making game ' + id)
  return GAMES[id] = {
    id: id,
    board: [
      ['X','','','','','','','',''],
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
    turn: 'O',
    valid_subgames: [0,1,2,3,4,5,6,7,8]
  }
}

let findGame = (id) => {
  console.log(id)

  return GAMES[id]
}

createGame()
createGame();


let playCell = (board, moveData) => {
  //console.log(board)
  board.board[moveData.subgame][moveData.cell] = board.turn
  board.turn = board.turn == 'O' ? 'X' : 'O';
  board.valid_subgames = [moveData.subgame]

}

let makeMoveInGame = (moveData) => {
  let game = GAMES[moveData.id]
  playCell(game, moveData)

  console.log('checking for WINNER', game.board)

  if (_.some(game.board, (board) => findWinner(board, game.turn))) {
    //check each board for a winner
    game.winner = game.turn
  }
  return game
}



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.get('/game/:id', (req, res) => {
  res//.type('application/json')
  //.sendStatus(200)
  .json(JSON.stringify(findGame(req.param('id'))))
})
app.post('/game/', (req, res) => {
  res
  .json(createGame())
})

app.post('/move/', (req, res) => {
  //res.sendStatus(200)
  res//.type('application/json')
  //.sendStatus(200)
  .json(makeMoveInGame(req.body))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))











//UTILS - stolen from the interwebs
function flatten(arrays) {
  return [].concat.apply([], arrays)
}

function zip(...arrays) {
  let zipped = []
  for(var index = 0; index < arrays[0].length; index++){
    zipped.push(arrays.map(a => a[index]))
  }
  return zipped
}

function equals(a, b) {
    var i = a.length;
    if (i != b.length) return false;
    while (i--) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function bitwiseAnd(a, b) {
  return zip(a, b).map(([bitA, bitB]) => bitA & bitB)
}

function bitboardStatematch(bitboard, [firstState, ...states]) {
  return Boolean(equals(bitwiseAnd(bitboard, firstState), firstState) ||
    (states.length && bitboardStatematch(bitboard, states)))
}


function isBitVictory(bitboard) {
  return bitboardStatematch(bitboard, WINNING_BOARDS)
}

function isVictory(board, sign) {
  return isBitVictory(compileBitboard(board, sign))
}
