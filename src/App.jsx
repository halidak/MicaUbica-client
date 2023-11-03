import './App.css'
import { Game } from './components/Game'
import Player1 from './components/players/Player1'
import Player2 from './components/players/Player2'
import { useState } from 'react'

function App() {
  const [totalPlacedStones1, setTotalPlacedStones1] = useState(9);
  const [totalPlacedStones2, setTotalPlacedStones2] = useState(9);
  const [whitePlayerStonesOut, setWhitePlayerStonesOut] = useState(0);
  const [blackPlayerStonesOut, setBlackPlayerStonesOut] = useState(0);


  return (
    <div className="container">
      <div className="gameAndPlayersContainer">
      <Player1
          totalPlacedStones1={totalPlacedStones1}
          setTotalPlacedStones1={setTotalPlacedStones1}
          blackPlayerStonesOut={blackPlayerStonesOut}
          setBlackPlayerStonesOut={setBlackPlayerStonesOut}
        />
        <Game
          totalPlacedStones1={totalPlacedStones1}
          setTotalPlacedStones1={setTotalPlacedStones1}
          totalPlacedStones2={totalPlacedStones2}
          setTotalPlacedStones2={setTotalPlacedStones2}
          whitePlayerStonesOut={whitePlayerStonesOut}
          blackPlayerStonesOut={blackPlayerStonesOut}
          setWhitePlayerStonesOut={setWhitePlayerStonesOut}
          setBlackPlayerStonesOut={setBlackPlayerStonesOut}
        />
        <Player2
          totalPlacedStones2={totalPlacedStones2}
          setTotalPlacedStones2={setTotalPlacedStones2}
          whitePlayerStonesOut={whitePlayerStonesOut}
          setWhitePlayerStonesOut={setWhitePlayerStonesOut}
        />
      </div>
    </div>
  );
}

export default App
