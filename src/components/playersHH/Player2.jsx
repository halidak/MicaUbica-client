// import React from 'react';
import './Player2.css';
// import PropTypes from 'prop-types';

// Player2.propTypes = {
//   totalPlacedStones: PropTypes.number.isRequired,
//   setTotalPlacedStones: PropTypes.func.isRequired,
// }

const Player2 = ({totalPlacedStones2, whitePlayerStonesOut}) => {
  return (
    <div className="playerContainer">
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
