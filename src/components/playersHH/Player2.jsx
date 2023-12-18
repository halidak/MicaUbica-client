// import React from 'react';
import './Player2.css';
// import PropTypes from 'prop-types';

// Player2.propTypes = {
//   totalPlacedStones: PropTypes.number.isRequired,
//   setTotalPlacedStones: PropTypes.func.isRequired,
// }

const Player2 = ({totalPlacedStones2, whitePlayerStonesOut, bestMove}) => {
  return (
    <div className="playerContainer">
        <div className="playerTitle2">Last move:</div>
        {bestMove && (
        <div className="playerTitle3">
          {Array.isArray(bestMove) ? (
            bestMove.map((move, index) => (
              <div key={index}>
                Square: {move.square}, Index: {move.index}
              </div>
            ))
          ) : (
            <div>
              Square: {bestMove.square}, Index: {bestMove.index}
            </div>
          )}
        </div>
      )}
        <br></br>
        <br></br>
      <div className="playerTitle">Player 2</div>
      <div className="player">
        {[...Array(Math.max(0, totalPlacedStones2))].map((_, index) => (
          <div key={index} className="playerCircle2"></div>
        ))}
        <div className='playerLoss'>
         {[...Array(whitePlayerStonesOut)].map((_, index) => (
          <div key={index} className="playerCircle-white"></div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Player2;
