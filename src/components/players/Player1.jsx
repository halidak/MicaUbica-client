// import React from 'react';
import './Player1.css';
// import PropTypes from 'prop-types';

// Player1.propTypes = {
//   totalPlacedStones: PropTypes.number.isRequired,
//   setTotalPlacedStones: PropTypes.func.isRequired,
// }

const Player1 = ({totalPlacedStones1, blackPlayerStonesOut}) => {
  return (
    <div className="playerContainer">
      <div className="playerTitle">Player 1</div>
      <div className="player">
        {[...Array(Math.max(0, totalPlacedStones1))].map((_, index) => (
          <div key={index} className="playerCircle"></div>
        ))}
        <div className='playerLoss'>
         {[...Array(blackPlayerStonesOut)].map((_, index) => (
          <div key={index} className="playerCircle-black"></div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Player1;
