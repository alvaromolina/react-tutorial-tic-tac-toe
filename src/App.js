import { useState } from 'react';

function Square({value, onSquareClick, winner, last}) {
  return (
    <button
      className={`square ${last ? "last" : ""} ${winner ? "winner" : ""} `}
      onClick={onSquareClick}> {value}
    </button>
  );
}


function Board({xIsNext, squares, onPlay}) {
  function handleClick(i, winner) {
    if(squares.play[i] || winner){
      return;
    }
    const nextSquares = squares.play.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares.play);
  
  const board = [0,1,2].map(row => <div key={row} className="board-row">
    {[row*3,row*3+1,row*3+2].map(col => 
      <Square 
        key={col}  
        value={squares.play[col]} 
        winner={!winner ? winner : winner.includes(col) } onSquareClick={() => handleClick(col, winner)}
        last={col==squares.positionPlay}
        />
    )}
  </div>)
  return board;

}

function Status({squares, xIsNext}){
  const winner = calculateWinner(squares.play);
  const draw = squares.play.indexOf(null,0) == -1;
  return <div className="status">{winner ? "Winner: " + (xIsNext ? "O" : "X") : ( draw ? "Is a draw!" : "Next player: " + (xIsNext ? "X" : "O"))}</div>
}

export default function Game() {
  const [history, setHistory] = useState( [{positionPlay: null, play: Array(9).fill(null)}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggle, setToggle] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const historyOrdered = toggle ? history.toReversed() : history;

  function handlePlay(nextSquares,positionPlay) {
    const nextHistory = [...history.slice(0, currentMove + 1), {positionPlay: positionPlay, play: nextSquares}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function resetGame(){
    setHistory([{row: null, col: null, play: Array(9).fill(null)}]);
    setToggle(false);
    setCurrentMove(0);
  }

  let moves = historyOrdered.map((squares, move) => {
    let description;
    const movePosition = toggle ? historyOrdered.length -1 - move : move;
    //TODO: improve this
    const row = squares.positionPlay < 3 ? 0 : (squares.positionPlay < 6 ? 1 : 2)
    const col = squares.positionPlay % 3 == 0 ? 0 : (squares.positionPlay == 1 || squares.positionPlay == 4 || squares.positionPlay == 7 ? 1 : 2)

    if (movePosition > 0) {
      description = 'Go to move #' + movePosition + " ["+row+","+col+"]";
    } else {
      description = 'Go to game start';
    }
    if(movePosition == currentMove){
      description = 'You are at move #' + movePosition + (row ? " ["+row+","+col+"]" : "");
    }
    return movePosition == currentMove ? (
      <li key={movePosition}>
       {description}
      </li>
    )  : (
      <li key={movePosition}>
        <button onClick={() => jumpTo(movePosition)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Status xIsNext={xIsNext} squares={currentSquares}/>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <div className="reset">
          <button onClick={resetGame}>Reset Game</button>
          </div>
        </div>
        <div className="game-info">
          <button onClick={() => setToggle(!toggle)}>Toggle History</button>
          <ol>{ moves }</ol>
        </div>
      </div>

    </>


  );
}

function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]]
  const winnerLine = lines.find(line => {
      return (new Set(line.map(play => squares[play] ?  squares[play] : play ))).size == 1 
  });
  return winnerLine ? winnerLine : false
  
}