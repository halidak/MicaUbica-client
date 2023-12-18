import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Flex, Modal } from 'antd';
import './App.css';
import { Game } from './components/Game';
import Player1 from './components/playersHH/Player1';
import Player2 from './components/playersHH/Player2';
import React, { useState } from 'react';
import { GameHC } from './components/GameHC';
import { GameCC } from './components/GameCC';

function App() {
  const [totalPlacedStones1, setTotalPlacedStones1] = useState(9);
  const [totalPlacedStones2, setTotalPlacedStones2] = useState(9);
  const [whitePlayerStonesOut, setWhitePlayerStonesOut] = useState(0);
  const [blackPlayerStonesOut, setBlackPlayerStonesOut] = useState(0);
  const [isModalOpenHC, setIsModalOpenHC] = useState(false); // Separate state for Human vs Computer modal
  const [isModalOpenCC, setIsModalOpenCC] = useState(false); // Separate state for Computer vs Computer modal
  const [level, setLevel] = useState(0);
  const [bestMove, setBestMove] = useState(null)

  const showModalHC = () => {
    setIsModalOpenHC(true);
  };

  const showModalCC = () => {
    setIsModalOpenCC(true);
  };

  const customCloseButton = (
    <span className="custom-close-button" role="img" aria-label="close">
      {/* You can replace this with your own close button icon or text */}
    </span>
  );

  const customModalFooter = (
    <div>
      {/* Add any additional footer content if needed */}
      <Button onClick={() => setIsModalOpenHC(false)}>{customCloseButton}Close</Button>
    </div>
  );

  const customModalFooter2 = (
    <div>
      {/* Add any additional footer content if needed */}
      <Button onClick={() => setIsModalOpenCC(false)}>{customCloseButton}Close</Button>
    </div>
  );

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
                    level={level}
                    setBestMove={setBestMove}
                  />
                  <Player2
                    totalPlacedStones2={totalPlacedStones2}
                    setTotalPlacedStones2={setTotalPlacedStones2}
                    whitePlayerStonesOut={whitePlayerStonesOut}
                    setWhitePlayerStonesOut={setWhitePlayerStonesOut}
                    bestMove={bestMove}
                  />
                </div>
              </div>
            </React.Fragment>
          }
        />
        <Route
          path='/gameCC'
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
                  <GameCC
                    totalPlacedStones1={totalPlacedStones1}
                    setTotalPlacedStones1={setTotalPlacedStones1}
                    totalPlacedStones2={totalPlacedStones2}
                    setTotalPlacedStones2={setTotalPlacedStones2}
                    whitePlayerStonesOut={whitePlayerStonesOut}
                    blackPlayerStonesOut={blackPlayerStonesOut}
                    setWhitePlayerStonesOut={setWhitePlayerStonesOut}
                    setBlackPlayerStonesOut={setBlackPlayerStonesOut}
                    level={level}
                    setBestMove={setBestMove}
                  />
                  <Player2
                    totalPlacedStones2={totalPlacedStones2}
                    setTotalPlacedStones2={setTotalPlacedStones2}
                    whitePlayerStonesOut={whitePlayerStonesOut}
                    setWhitePlayerStonesOut={setWhitePlayerStonesOut}
                    bestMove={bestMove}
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
                  <Button onClick={showModalHC}>Human vs Computer</Button>
                  <Modal title="Select level" open={isModalOpenHC} closeIcon={customCloseButton} footer={customModalFooter}>
                    <div className='dugmad'>
                      <Link to='/gameHC'>
                        <Button type="primary" onClick={() => setLevel(0)}>Easy</Button>
                      </Link>
                      <br></br>
                      <br></br>
                      <Link to='/gameHC'>
                        <Button type="primary" onClick={() => setLevel(1)}>Medium</Button>
                      </Link>
                      <br></br>
                      <br></br>
                      <Link to='/gameHC'>
                        <Button type="primary" onClick={() => setLevel(2)}>Hard</Button>
                      </Link>
                    </div>
                  </Modal>
                  <Button onClick={showModalCC}>Computer vs Computer</Button>
                  <Modal title="Select level" open={isModalOpenCC} closeIcon={customCloseButton} footer={customModalFooter2}>
                    <div className='dugmad'>
                      <Link to='/gameCC'>
                        <Button type="primary" onClick={() => setLevel(0)}>Easy</Button>
                      </Link>
                      <br></br>
                      <br></br>
                      <Link to='/gameCC'>
                        <Button type="primary" onClick={() => setLevel(1)}>Medium</Button>
                      </Link>
                      <br></br>
                      <br></br>
                      <Link to='/gameCC'>
                        <Button type="primary" onClick={() => setLevel(2)}>Hard</Button>
                      </Link>
                    </div>
                  </Modal>
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
