import React from 'react'
import './index.css'
import ReactDOM from 'react-dom'

class Square extends React.Component {
  constructor(props){
    super(props)
    this.rowIndex = props.row
    this.colIndex = props.col
  }
  render() {
    return (
      <button className={this.props.bold} onClick = {() => {
        this.props.onClick()
      }}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props) 
    this.row = props.row
    this.col = props.col
    this.state = {
      squares: Array(parseInt(this.row)).fill(Array(parseInt(this.col)).fill(null)),
      turn: 'X',
      win: null,
      history : [],
      moveCount: 0,
      sort: false,
      bold: Array(parseInt(this.row)).fill(Array(parseInt(this.col)).fill("square"))
    }
  }
  handleClick(row, col){
    const squares = Array(this.state.squares.length)
    for (let i = 0 ; i < this.state.squares.length ; i++){
      squares[i] = this.state.squares[i].slice();
    }
    if (squares[row][col] != null || this.state.win != null) return
    if (this.state.turn === 'X') {
      squares[row][col] = 'X'
      this.setState({squares: squares})
      this.setState({turn: 'O'})
      let history = {position: {row: row, col: col}, value: 'X', move: this.state.moveCount + 1}
      let historyArray = this.state.history.slice()
      if (this.state.moveCount < historyArray.length){
        //history.move = history.move - 1
        if (this.state.sort == false)
          historyArray[this.state.moveCount] = history
        else historyArray[historyArray.length - this.state.moveCount - 1] = history
      }
      else {
        historyArray.push(history)
      }
      this.setState({history: historyArray})
      this.setState({moveCount: this.state.moveCount + 1})
    } 
    else {
      squares[row][col] = 'O'
      this.setState({squares: squares})
      this.setState({turn: 'X'})
      let history = {position: {row: row, col: col}, value: 'O', move: this.state.moveCount + 1}
      let historyArray = this.state.history.slice()
      if (this.state.moveCount < historyArray.length){
        //history.move = history.move - 1
        if (this.state.sort == false)
          historyArray[this.state.moveCount] = history
        else historyArray[historyArray.length - this.state.moveCount - 1] = history
      }
      else {
        historyArray.push(history)
      }
      this.setState({history: historyArray})
      this.setState({moveCount: this.state.moveCount + 1})
    }
    let boldArray = Array(this.state.bold.length)
    for (let i = 0 ; i < this.state.bold.length ; i++){
      boldArray[i] = Array(this.state.bold[i].length).fill("square")
    }
    boldArray[row][col] = "square-bold"
    console.log(boldArray)
    this.setState({bold: boldArray})
    
    // check win lose condition

    let checkArray = squares
    let toLeftRow = [-1, -2, -3, -4]
    let toLeftCol = [0, 0, 0, 0]
    let toRightRow = [1, 2, 3, 4]
    let toRightCol = [0, 0, 0, 0]
    if (this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      this.setState({win: this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [0, 0, 0, 0]
    toLeftCol = [-1, -2, -3, -4]
    toRightRow = [0, 0, 0, 0]
    toRightCol = [1, 2, 3, 4]
    if (this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      this.setState({win: this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [-1, -2, -3, -4]
    toLeftCol = [-1, -2, -3, -4]
    toRightRow = [1, 2, 3, 4]
    toRightCol = [1, 2, 3, 4]
    if (this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      this.setState({win: this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [-1, -2, -3, -4]
    toLeftCol = [1, 2, 3, 4]
    toRightRow = [1, 2, 3, 4]
    toRightCol = [-1, -2, -3, -4]
    if (this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      this.setState({win: this.checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    
  }
  checkWinlose(row, col, checkArray, toLeftRow, toLeftCol, toRightRow, toRightCol){
    let count = 0
    let boldArray = Array(this.state.bold.length)
    for (let i = 0 ; i < boldArray.length ; i++){
      boldArray[i] = Array(this.state.bold[i].length).fill("square")
    }
    for (let i = 0; i < toLeftRow.length ; i++){
      if (row + toLeftRow[i] < 0 || col + toLeftCol[i] < 0 || row + toLeftRow[i] > parseInt(this.state.row) - 1 || col + toLeftCol[i] > parseInt(this.state.col) - 1)
      continue
      if (checkArray[row][col] == checkArray[row + toLeftRow[i]][col + toLeftCol[i]]){
        count = count + 1
        boldArray[row + toLeftRow[i]][col + toLeftCol[i]] = "square-bold"
      }
      else break;
    }
    for (let i = 0 ; i < toRightRow.length ; i++){
      if (row + toRightRow[i] < 0 || col + toRightCol[i] < 0 || row + toRightRow[i] > parseInt(this.state.row) - 1 || col + toRightCol[i] > parseInt(this.state.col) - 1)
      continue
      if (checkArray[row][col] == checkArray[row + toRightRow[i]][col + toRightCol[i]]){
        boldArray[row + toRightRow[i]][col + toRightCol[i]] = "square-bold"
        count = count + 1;
      }
      else break
    }
    if (count >= 4){
      boldArray[row][col] = "square-bold"
      this.setState({bold: boldArray})
      return checkArray[row][col]
    }
    else return null
  }
  renderWinner(){
    if (this.state.win === 'X' || this.state.win === 'O'){
      return <div className = "winner">The winner is {this.state.win}</div>
    }
    else if (this.state.win === 'draw') {
      return <div className = "winner">draw</div>
    }
    else return <div className = "winner">{this.state.win}</div>
  }
  historyTransformClick(moveNumber){
    let resetArray = Array(parseInt(this.row))
    for (let i = 0 ; i < resetArray.length ; i++){
      resetArray[i] = Array(parseInt(this.col)).fill(null)
    }
    for (let i = 0 ; i <= moveNumber ; i++){
      let position = this.state.history[i].position
      let value = this.state.history[i].value
      resetArray[position.row][position.col] = value
    }
    let historyArray = this.state.history.slice()

    let boldArray = Array(this.state.bold.length)
    for (let i = 0 ; i < boldArray.length ; i++){
      boldArray[i] = Array(this.state.bold[i].length).fill("square")
    }

    let currentPosition = this.state.history[moveNumber].position
    boldArray[currentPosition.row][currentPosition.col] = "square-bold"
    this.setState({bold: boldArray})

    let win = false;

    let toLeftRow = [-1, -2, -3, -4]
    let toLeftCol = [0, 0, 0, 0]
    let toRightRow = [1, 2, 3, 4]
    let toRightCol = [0, 0, 0, 0]
    if (this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      win = true
      this.setState({win: this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [0, 0, 0, 0]
    toLeftCol = [-1, -2, -3, -4]
    toRightRow = [0, 0, 0, 0]
    toRightCol = [1, 2, 3, 4]
    if (this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      win = true
      this.setState({win: this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [-1, -2, -3, -4]
    toLeftCol = [-1, -2, -3, -4]
    toRightRow = [1, 2, 3, 4]
    toRightCol = [1, 2, 3, 4]
    if (this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      win = true
      this.setState({win: this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }
    toLeftRow = [-1, -2, -3, -4]
    toLeftCol = [1, 2, 3, 4]
    toRightRow = [1, 2, 3, 4]
    toRightCol = [-1, -2, -3, -4]
    if (this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol) != null){
      win = true
      this.setState({win: this.checkWinlose(currentPosition.row, currentPosition.col, resetArray, toLeftRow, toLeftCol, toRightRow, toRightCol)})
    }

    //historyArray.splice(moveNumber + 1, historyArray.length - moveNumber)
    this.setState({squares: resetArray})
    this.setState({history: historyArray})
    this.setState({moveCount: moveNumber + 1})
    let value = this.state.history[moveNumber].value
    if (value === 'X')
      this.setState({turn: 'O'})
    else 
      this.setState({turn: 'X'})
    if (win == false)
    this.setState({win: null})
  }
  renderHistoryButton(move){
    return(
      <li>
        <button className = "history-button" onClick = {() => this.historyTransformClick(move.move - 1)}>
          #{move.move} Player {move.value} move: [ row: {move.position.row}, col: {move.position.col} ]
        </button>
      </li>
    )
  }
  renderHistory(){
    return (
      <div>
        <div>History</div>
        <br/>
        <ul className = "history-list">{this.state.history.map((move) => this.renderHistoryButton(move))}</ul>
      </div>
    )
  }
  renderSortHistory(){
    return <div className = "sort-container">
      <button onClick = {() => {this.ascendingHistory()}}>Ascending</button>
      <button onClick = {() => {this.descendingHistory()}}>Descending</button>
    </div>
  }
  ascendingHistory(){
    if (this.state.sort == false)
    return
    let historyTemplate = this.state.history.slice();
    this.setState({history: historyTemplate.reverse()})
    this.setState({sort: false})
  }
  descendingHistory(){
    if (this.state.sort == true)
    return
    let historyTemplate = this.state.history.slice();
    this.setState({history: historyTemplate.reverse()})
    this.setState({sort: true})
  }
  renderSquare(row, col){
      return(
        <Square row = {row} col = {col} value = {this.state.squares[row][col]} bold = {this.state.bold[row][col]} onClick = {() => this.handleClick(row, col)}></Square>
      )

  }
  listBox (numbers) {
    let arrayCol = Array(parseInt(this.col)).fill(null)
    for (let i = 0 ; i < arrayCol.length ; i++){
      arrayCol[i] = i
    }
    return arrayCol.map((num) => <Square row = {numbers} col = {num} value = {this.state.squares[numbers][num]} bold = {this.state.bold[numbers][num]} onClick = {() => this.handleClick(numbers, num)}></Square>)
    //return arrayCol.map((num) => this.renderSquare(numbers, num))
  }
  renderCol(numbers) {
    return (
      <ul className = "board-list">{this.listBox(numbers)}</ul>
    )
  }
  renderRow() {
    let arrayRow = Array(parseInt(this.row)).fill(null)
    for (let i = 0 ; i < arrayRow.length ; i++){
      arrayRow[i] = i
    }
    return arrayRow.map((numbers) => <li><div className = "board-row">{this.renderCol(numbers)}</div></li>)
  }
  renderBoard() {
    return(
      <ul className = "board-list">{this.renderRow()}</ul>
    )
  }
  render() {

    return (
      <div className = "game">
        <div className = "game-board">
          <div className = "container">
            <div className="status">Next player: {this.state.turn}</div>
            {this.renderBoard()}
            
          </div>
        </div>
        <div className = "game-info">
        <div className = "winner-title">The winner</div>
        {this.renderWinner()}
          <ol></ol>
        </div>
        <div className = "history-info">{this.renderHistory()}</div>
        <div className = "sort-history">{this.renderSortHistory()}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props)
    this.text = "hello"
  }
  render() {
    return ( 
        <Board row = "20" col = "20"/>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);