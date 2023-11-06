import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Flex } from 'antd';
import './App.css';
import { Game } from './components/Game';
import Player1 from './components/playersHH/Player1';
import Player2 from './components/playersHH/Player2';
import React, { useState } from 'react';
import { GameHC } from './components/GameHC';

function App() {
  const [totalPlacedStones1, setTotalPlacedStones1] = useState(9);
  const [totalPlacedStones2, setTotalPlacedStones2] = useState(9);
  const [whitePlayerStonesOut, setWhitePlayerStonesOut] = useState(0);
  const [blackPlayerStonesOut, setBlackPlayerStonesOut] = useState(0);

  return (
    <Router>
      
          <Routes>
            <Route
              path="/game"
              element={
                <React.Fragment>
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
                </React.Fragment>
              }
            />
            <Route
            path='/gameHC'
                element={
                  <React.Fragment>
                    <div className="container">
                    <div className="gameAndPlayersContainer">
                    <Player1
                    totalPlacedStones1={totalPlacedStones1}
                    setTotalPlacedStones1={setTotalPlacedStones1}
                    blackPlayerStonesOut={blackPlayerStonesOut}
                    setBlackPlayerStonesOut={setBlackPlayerStonesOut}
                  />
                   <GameHC
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
                  </React.Fragment>
              }
            />
            <Route
              path="/"
              element={
                <React.Fragment>
                  <div className='centered-content'>
                  <h1>Mills / Mica Ubica</h1>
                  <p>Select game mode</p>
                  <Flex gap="small" wrap="wrap">
                  <Link to='/game'>
                  <Button>Human vs Human</Button>
                </Link>
                <Link to='/gameHC'>
                  <Button>Human vs Computer</Button>
                </Link>
                <Link to='/gameCC'>
                  <Button>Computer vs Computer</Button>
                </Link>
                </Flex>
                  </div>
                </React.Fragment>
              }
            />
          </Routes>
    </Router>
  );
}

export default App;
