import { useState, useEffect } from 'react';
import './Game.css';
import { BoardSquare } from './board/BoardSquare';
import { Stone } from './board/Stone';
import { allowedMoves } from './allowedMoves';
import { millsPostitions } from './millsPositions';

export function GameHC({ totalPlacedStones1, setTotalPlacedStones1, totalPlacedStones2, setTotalPlacedStones2,
    whitePlayerStonesOut, blackPlayerStonesOut, setWhitePlayerStonesOut, setBlackPlayerStonesOut, level }) {
    
    const [humanStones, setHumanStones] = useState([])
    const [computerStones, setComputerStones] = useState([])
    const [stones, setStones] = useState([]);
    const [color, setColor] = useState('white');
    const [selectedStone, setSelectedStone] = useState(null);
    const [highlightedMoves, setHighlightedMoves] = useState([]);
    const [compusterMills, setComputerMills] = useState([])
    
   useEffect(() => {

        const apiUrlReset = 'http://localhost:8000/reset';
        
        fetch(apiUrlReset)
            .then(response => {
                console.log(response)
            })
   }, [])


    const [isMills, setIsMills] = useState(false);
    const [stonesInMills, setStonesInMills] = useState([]); // Dodaj stanje za kamenje u mlinovima
    const [lastMill, setLastMill] = useState([]);
    const [allMills, setAllMills] = useState([]);
    const [currentMill, setCurrentMill] = useState([]);

    const [canPlay, setCanPlay] = useState(true)
    const [nextPlayer, setNextPlayer] = useState('human')


    //slanje requesta 
    const sendPostRequest = (humanStones, computerStones, totalPlacedStones2, nextPlayer, totalPlacedStones1,
        whitePlayerStonesOut, blackPlayerStonesOut, allMills ) => {
        let dataToSend = {
            human_stones: humanStones,
            computer_stones: computerStones,
            total_placed_stones2: totalPlacedStones2,
            next_player: nextPlayer,
            total_placed_stones1: totalPlacedStones1,
            white_player_stones_out: whitePlayerStonesOut,
            black_player_stones_out: blackPlayerStonesOut,
            allMills,
            level
        }
        console.log("DATA TO SEND", dataToSend)
        const data = {
            humanStones,
            computerStones,
            totalPlacedStones2,
            nextPlayer,
            totalPlacedStones1,
            whitePlayerStonesOut,
            blackPlayerStonesOut,
            level
        };
    
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
    
        const apiUrl = 'http://localhost:8000/stones';
    
        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Obrada odgovora sa servera, ako je potrebno
                console.log('Server response:', data);
                console.log("NEXT PLAYER", data.nextPlayer)
                setComputerStones(data.computerStones);
                setHumanStones(data.humanStones)
                console.log("NOVI HUMAN", humanStones)
                console.log("komp",computerStones)
                setTotalPlacedStones2(data.totalPlacedStones2)
                setWhitePlayerStonesOut(data.whitePlayerStonesOut)

                if(data.isComputerMills === true){
                    setCurrentMill(data.found_mill)
                }
                //setCanPlay(true)
                setComputerMills(data.computerMills)
                setNextPlayer('human')
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const checkAndHighlightStones = (stonesToCheck) => {
        const stonesInMills = [];

        for (let position of millsPostitions) {
            const stonesInPosition = position.map(([square, index]) =>
                stonesToCheck.find(stone => stone.square === square && stone.index === index)
            );
    
            // Check if all stones in the current position are of the same color
            if (stonesInPosition.every(stone => stone && stone.color === color)) {
                // Sort the stones in the mill by their positions
                const sortedStonesInMill = stonesInPosition.sort((a, b) => {
                    if (a.square !== b.square) {
                        return a.square - b.square;
                    } else {
                        return a.index - b.index;
                    }
                });
    
                // Check if all stones in the current mill have already occurred in any mill in allMills
                const isUniqueMill = !allMills.some(mill => {
                    return sortedStonesInMill.every((stone, index) => {
                        const existingMill = mill.find(s => s.square === stone.square && s.index === stone.index);
                        return existingMill ? existingMill.color === color : false;
                    });
                });
    
                // If this mill is unique, add it to stonesInMills and allMills
                if (isUniqueMill) {
                    stonesInMills.push(...stonesInPosition); // Add stones in the mill to the array
                    setAllMills(prevMills => [...prevMills, sortedStonesInMill]);
                }
            }
        }
    
        setStonesInMills(stonesInMills); // Update state with stones in mills
        return stonesInMills.length > 0; // Return true if there are stones in mills
    };

    useEffect(() => {
        console.log("PLAYER", nextPlayer)
        // console.log("STONES IZ USEEFFECT", stones)
        checkAndHighlightStones(stones);
        console.log(stonesInMills);
        // console.log("TRENUTNI", stonesInMills)
        // console.log("PRETHODNI", lastMill)
        // console.log("SVI", allMills)
        console.log("HUMAN", humanStones)
        console.log("COMPUTER", computerStones)
        if (isMills) {
            setCurrentMill(stonesInMills);
            console.log(currentMill)
        }
        if (whitePlayerStonesOut === 7 || blackPlayerStonesOut === 7 || hasAvailableMoves(humanStones == false || hasAvailableMoves(computerStones) == false)) {
            if (whitePlayerStonesOut === 7) {
                alert("Player 2 je pobedio!");
            } else if (blackPlayerStonesOut === 7) {
                alert("Player 1 je pobedio!");
            }
            // Resetujte sva stanja igre ovde, na primer:
            setStones([]);
            setColor('white');
            setSelectedStone(null);
            setHighlightedMoves([]);
            setIsMills(false);
            setStonesInMills([]);
            setHumanStones([])
            setComputerStones([])
            setTotalPlacedStones1(9); // Postavite broj postavljenih kamenova na početnu vrednost
            setTotalPlacedStones2(9);
            setWhitePlayerStonesOut(0); // Resetujte brojače za whitePlayerStonesOut i blackPlayerStonesOut
            setBlackPlayerStonesOut(0);
        }
        
    }, [humanStones, whitePlayerStonesOut, blackPlayerStonesOut]);


    const hasAvailableMoves = (stones) => {
        for (const square in allowedMoves) {
            // Check if allowedMoves[square] is defined
            if (allowedMoves[square]) {
                for (const index in allowedMoves[square]) {
                    // Check if allowedMoves[square][index] is defined
                    if (allowedMoves[square][index]) {
                        if (stones[square] && stones[square][index] !== null) {
                            const moves = allowedMoves[square][index];
                            for (const move of moves) {
                                // Check if stones[move.square] is defined
                                if (stones[move.square] && stones[move.square][move.index] === null) {
                                    return true; // At least one available move is found
                                }
                            }
                        }
                    }
                }
            }
        }
        return false; // No available moves
    };
    

    const toggleColor = () => {
        setColor(c => c === 'white' ? 'black' : 'white');
    };
    
    const onCircleClick = (square, index) => {
        const targetCircle = { square, index };
        const newColor = color;
    
        if (isMills) {
            return; // Ako je mills stanje, ne dozvoljavamo dodavanje novih kamenova
        }
    
        if ((totalPlacedStones1 === 0) || (totalPlacedStones2 < 0)) {
            if (selectedStone != null) {
                if(whitePlayerStonesOut === 6 && color === 'white'){
                    if (isCircleFree(targetCircle.square, targetCircle.index)) {
                        moveStone(selectedStone, targetCircle);
                        //toggleColor();
                        setLastMill(stonesInMills);
                    }
                }
                else{

                    if (isCircleFree(targetCircle.square, targetCircle.index) &&  isMoveAllowed(selectedStone.square, selectedStone.index, targetCircle.square, targetCircle.index, stones)) {
                        moveStone(selectedStone, targetCircle);
                        //toggleColor();
                        setLastMill(stonesInMills);
                    }
                }
            }
        } else {
            if(nextPlayer == 'human'){
                const newStones = [...humanStones, { square, index, color: newColor }];
                const hasMills = checkAndHighlightStones(newStones);
                setIsMills(hasMills);
                setStones(newStones);
                setHumanStones(newStones)
                //toggleColor();
                
                if (newColor === 'white') {
                    setTotalPlacedStones1((prevTotal) => prevTotal - 1);
                } else if (newColor === 'black') {
                    setTotalPlacedStones2((prevTotal) => prevTotal - 1);
                }
                console.log("NEW", newStones)
                if(!hasMills){
                    setNextPlayer('computer')
                    sendPostRequest(newStones, computerStones, totalPlacedStones2, nextPlayer, totalPlacedStones2, whitePlayerStonesOut, blackPlayerStonesOut, allMills)
                }
            }
        }
        console.log(stones);
    };

    const areMillsDifferent = (mills1, mills2) => {
        // If both mills are null or empty, they are the same
        if ((!mills1 || mills1.length === 0) && (!mills2 || mills2.length === 0)) {
            return true;
        }
    
        if ((mills1 && mills1.length) !== (mills2 && mills2.length)) {
            return true; // If the number of stones in mills is different, they are different.
        }
    
        // Compare the positions of stones in mills
        return !mills1.every((stone, index) => {
            const prevStone = mills2[index];
            return (
                prevStone.square === stone.square && prevStone.index === stone.index
            );
        });
    };

    const handleStoneSelect = (square, index) => {
       
        const areStonesInAllMills = stonesInMills.every(stoneInMill => {
            const occurrences = allMills.filter(allMill =>
                allMill.square === stoneInMill.square && allMill.index === stoneInMill.index
            ).length;
        
            return occurrences === 0;
        });
        
        const areAllStonesInAllMills = computerStones.every(stone => {
            const occurrences = compusterMills.filter(mill =>
                mill.some(s => s.square === stone.square && s.index === stone.index && s.color === stone.color)
            ).length;
    
            return occurrences > 0;
        });
        
        console.log("jesul", areAllStonesInAllMills)
        if (isMills) {
            
            const stone = computerStones.find(s => s.square === square && s.index === index);
            console.log("STONE", stone)
            if (stone) {
                const isInAllMills = compusterMills.some(mill =>
                mill.some(s => s.square === square && s.index === index && s.color === color)
            );
            
            if (!isInAllMills || areAllStonesInAllMills) {
                const isInComputerMills = compusterMills.some(mill =>
                    mill.some(s => s.square === square && s.index === index)
                );

                if(areAllComputerStonesInMills()){
                    alert("Cannot remove stones that are part of a mill.");
                    setIsMills(false)
                    return;
                }

                if (isInComputerMills) {
                    alert("Cannot remove stones that are part of a mill.");
                    return;
                }

                // Ako kamen nije uključen u neki mlin, onda ga možete izbaciti
                const newStones = computerStones.filter(stone => !(stone.square === square && stone.index === index));
                setAllMills(prevMills => [...prevMills, stonesInMills]);
                setStones(newStones);
                setComputerStones(newStones)
                // Proveri boju i dodaj ga u odgovarajući niz lost
                if (canPlay == 'human') {
                    setWhitePlayerStonesOut((prevTotal) => prevTotal + 1);
                } else {
                    setBlackPlayerStonesOut((prevTotal) => prevTotal + 1);
                }
                setLastMill(stonesInMills);
                setIsMills(false);
                setStonesInMills([]);
                setCurrentMill([])
                setNextPlayer('computer')
                sendPostRequest(humanStones, newStones, totalPlacedStones2, nextPlayer, totalPlacedStones2, whitePlayerStonesOut, blackPlayerStonesOut, allMills)                
                }
            }
            return;
        }
        // Pronađite kamen na datoj lokaciji
        const stone = humanStones.find(s => s.square === square && s.index === index);
    
        // Ako kamen ne postoji ili njegova boja ne odgovara trenutnoj boji, ne dozvolite odabir
        if (!stone || stone.color !== 'white') {
            console.log("hocu da selektujem")
            return;
        }
    
        if (totalPlacedStones1 !== 0 && totalPlacedStones2 !== 0) {
            return;
        }
        console.log("hocu da selektujem")
        // Check if the clicked stone is the same as the selected one
        if (selectedStone && selectedStone.square === square && selectedStone.index === index) {
            setSelectedStone(null);
            setHighlightedMoves([]);
        } else {
            // Otherwise, set the selected stone
            setSelectedStone({ square, index });
            setHighlightedMoves(allowedMoves[square][index]);
        }
    
        console.log('Selected Stone:', selectedStone); // Log the selected stone for debugging
    };

    const areAllComputerStonesInMills = () => {
        for (const stone of computerStones) {
            const isInAnyMill = compusterMills.some(mill =>
                mill.some(s => s.square === stone.square && s.index === stone.index)
            );

            if (!isInAnyMill) {
                return false; // Ako bilo koji kamen nije uključen u mlin, vraća se false
            }
        }

        return true; // Svi kamenovi su uključeni u neki mlin
    };

    const isMoveAllowed = (currentSquare, currentIndex, targetSquare, targetIndex, stones) => {
        // const isOccupied = stones.some(stone => stone.square === targetSquare && stone.index === targetIndex);
    
        // if (isOccupied) {
        //     return false; // Potez nije dozvoljen ako je polje već zauzeto
        // }
    
        const moves = allowedMoves[currentSquare][currentIndex];
        return moves.some(move => move.square === targetSquare && move.index === targetIndex);
    };
    
    

    const isCircleFree = (square, index) => {
        for (let stone of computerStones) {
            if (stone.square === square && stone.index === index) {
                return false;
            }
        }
        return true;
    };

    const moveStone = (selectedStone, targetCircle) => {
        console.log("Before moveStone:", selectedStone, targetCircle);

        if (isMills) {
            console.log("Mills are active. Cannot move stone.");
            return;
        }
    
        // Prvo se kreira novi niz bez starog kamena
        const newStones = humanStones.filter(stone => !(stone.square === selectedStone.square && stone.index === selectedStone.index));
    
        // Pronađite boju kamena na staroj lokaciji
        const oldStone = humanStones.find(stone => stone.square === selectedStone.square && stone.index === selectedStone.index);
        const color = oldStone ? oldStone.color : 'white'; // Uzmi boju ako je dostupna, inače postavi na 'white'
    
        // Zatim se dodaje ažurirani kamen na novi niz sa istom bojom
        newStones.push({ ...selectedStone, square: targetCircle.square, index: targetCircle.index, color: color });
    
        // Postavljanje novog niza kamenova
        setStones(newStones);
        setHumanStones(newStones);
        setLastMill(stonesInMills);

        const movedStonesInMills = stonesInMills.filter(stoneInMill => {
            return stoneInMill.square !== selectedStone.square || stoneInMill.index !== selectedStone.index;
        });
        setAllMills(prevMills => prevMills.filter(mill => !areMillsDifferent(mill, movedStonesInMills)));

        setSelectedStone(null);
        setHighlightedMoves([]);
        const hasMills = checkAndHighlightStones(newStones);
        setIsMills(hasMills);
        console.log("After moveStone:", newStones);
        console.log(totalPlacedStones1);
        console.log(totalPlacedStones2);
       if(!hasMills){
            setNextPlayer('computer')
            sendPostRequest(newStones, computerStones, totalPlacedStones2, nextPlayer, totalPlacedStones2, whitePlayerStonesOut, blackPlayerStonesOut, allMills)                
       }
    };
    

    return (
        <svg viewBox='0 0 100 100'>
            <line className='board-line' x1={50} y1={10} x2={50} y2={30} />
            <line className='board-line' x1={70} y1={50} x2={90} y2={50} />
            <line className='board-line' x1={50} y1={70} x2={50} y2={90} />
            <line className='board-line' x1={10} y1={50} x2={30} y2={50} />
            <BoardSquare padding={10} onCircleClick={onCircleClick} highlightedMoves={highlightedMoves}/>
            <BoardSquare padding={20} onCircleClick={onCircleClick} highlightedMoves={highlightedMoves}/>
            <BoardSquare padding={30} onCircleClick={onCircleClick} highlightedMoves={highlightedMoves}/>
            {humanStones.map(({ square, index, color }) => {
                   const isStoneInMills = currentMill.some(stone => stone.square === square && stone.index === index);
                return (
                    <Stone
                    key={`${square}-${index}-${color}`}
                    square={square}
                    index={index}
                    color={isStoneInMills ? 'yellow' : "white"}
                    isSelected={selectedStone && selectedStone.square === square && selectedStone.index === index}
                    onSelect={handleStoneSelect}
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
                    onSelect={handleStoneSelect}
                    />
                );
                })}
        </svg>
    )
}