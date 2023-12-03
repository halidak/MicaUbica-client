import { useState, useEffect } from 'react';
import './Game.css';
import { BoardSquare } from './board/BoardSquare';
import { Stone } from './board/Stone';
import { allowedMoves } from './allowedMoves';
import { millsPostitions } from './millsPositions';


export function GameCC({ totalPlacedStones1, setTotalPlacedStones1, totalPlacedStones2, setTotalPlacedStones2,
    whitePlayerStonesOut, blackPlayerStonesOut, setWhitePlayerStonesOut, setBlackPlayerStonesOut, level }) {
    
    const [humanStones, setHumanStones] = useState([])
    const [computerStones, setComputerStones] = useState([])
    const [stones, setStones] = useState([]);
    const [color, setColor] = useState('white');
    const [selectedStone, setSelectedStone] = useState(null);
    const [highlightedMoves, setHighlightedMoves] = useState([]);
    const [compusterMills, setComputerMills] = useState([])  
    const [currentMill, setCurrentMill] = useState([]);
    const [player, setPlayer] = useState('human')

    useEffect(() => {
       //post request
       const sendPostRequest = () => {
    
            const data = {
                player,
                level
            };
        
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data), 
            };
    
        const apiUrl = 'http://localhost:8000/comp';
    
        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response:', data);
                setHumanStones(data.board.currentState.humanStones)
                setComputerStones(data.board.currentState.computerStones)
                setTotalPlacedStones2(data.board.pending.computer)
                setTotalPlacedStones1(data.board.pending.human)
                setWhitePlayerStonesOut(data.board.out.human)
                setBlackPlayerStonesOut(data.board.out.computer)
                if(player == 'human')
                    setPlayer('computer')
                else
                    setPlayer('human')
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
        sendPostRequest()
            if (whitePlayerStonesOut === 7 || blackPlayerStonesOut === 7) {
                if (whitePlayerStonesOut === 7) {
                    alert("Player 2 je pobedio!");
                } else if (blackPlayerStonesOut === 7) {
                    alert("Player 1 je pobedio!");
                }
                setStones([]);
                setColor('white');
                setSelectedStone(null);
                setHighlightedMoves([]);
                setHumanStones([])
                setComputerStones([])
                setTotalPlacedStones1(9); 
                setTotalPlacedStones2(9);
                setWhitePlayerStonesOut(0);
                setBlackPlayerStonesOut(0);
            }
    }, [humanStones, computerStones])


    useEffect(() => {

        const apiUrlReset = 'http://localhost:8000/reset';
        
        fetch(apiUrlReset)
            .then(response => {
                console.log(response)
            })

        setStones([]);
        setColor('white');
        setSelectedStone(null);
        setHighlightedMoves([]);
        setHumanStones([])
        setComputerStones([])
        setTotalPlacedStones1(9); // Postavite broj postavljenih kamenova na početnu vrednost
        setTotalPlacedStones2(9);
        setWhitePlayerStonesOut(0); // Resetujte brojače za whitePlayerStonesOut i blackPlayerStonesOut
        setBlackPlayerStonesOut(0);
   }, [])

    return (
        <svg viewBox='0 0 100 100'>
            <line className='board-line' x1={50} y1={10} x2={50} y2={30} />
            <line className='board-line' x1={70} y1={50} x2={90} y2={50} />
            <line className='board-line' x1={50} y1={70} x2={50} y2={90} />
            <line className='board-line' x1={10} y1={50} x2={30} y2={50} />
            <BoardSquare padding={10}  highlightedMoves={highlightedMoves}/>
            <BoardSquare padding={20}  highlightedMoves={highlightedMoves}/>
            <BoardSquare padding={30}  highlightedMoves={highlightedMoves}/>
            {humanStones.map(({ square, index, color }) => {
                   const isStoneInMills = currentMill.some(stone => stone.square === square && stone.index === index);
                return (
                    <Stone
                    key={`${square}-${index}-${color}`}
                    square={square}
                    index={index}
                    color={isStoneInMills ? 'yellow' : "white"}
                    isSelected={selectedStone && selectedStone.square === square && selectedStone.index === index}
                    />
                );
                })}
                {computerStones.map(({ square, index, color }) => {
                   const isStoneInMills = currentMill.some(stone => stone.square === square && stone.index === index);
                return (
                    <Stone
                    key={`${square}-${index}-${color}`}
                    square={square}
                    index={index}
                    color={isStoneInMills ? 'green' : "black"}
                    isSelected={selectedStone && selectedStone.square === square && selectedStone.index === index}
                    />
                );
                })}
        </svg>
    )
}