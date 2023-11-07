import { useState, useEffect } from 'react';
import './Game.css';
import { BoardSquare } from './board/BoardSquare';
import { Stone } from './board/Stone';
import { allowedMoves } from './allowedMoves';
import { millsPostitions } from './millsPositions';

export function Game({ totalPlacedStones1, setTotalPlacedStones1, totalPlacedStones2, setTotalPlacedStones2,
    whitePlayerStonesOut, blackPlayerStonesOut, setWhitePlayerStonesOut, setBlackPlayerStonesOut }) {
    const [stones, setStones] = useState([]);
    const [color, setColor] = useState('white');
    const [selectedStone, setSelectedStone] = useState(null);
    const [highlightedMoves, setHighlightedMoves] = useState([]);
    
    //console.log(selectedStone)

    const [isMills, setIsMills] = useState(false);
    const [stonesInMills, setStonesInMills] = useState([]); // Dodaj stanje za kamenje u mlinovima
    //const [previousMills, setPreviousMills] = useState([]); // Dodaj stanje za prethodne mlinove
    const [lastMill, setLastMill] = useState([]);
    const [allMills, setAllMills] = useState([]);
    const [currentMill, setCurrentMill] = useState([]);

    // const [whitePlayerStonesOut, setWhitePlayerStonesOut] = useState(1);
    // const [blackPlayerStonesOut, setBlackPlayerStonesOut] = useState(1);

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
        console.log("STONES IZ USEEFFECT", stones)
        checkAndHighlightStones(stones);
        console.log(stonesInMills);
        console.log("TRENUTNI", stonesInMills)
        console.log("PRETHODNI", lastMill)
        console.log("SVI", allMills)
        if (isMills) {
            setCurrentMill(stonesInMills);
        }
        if (whitePlayerStonesOut === 7 || blackPlayerStonesOut === 7) {
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
            setTotalPlacedStones1(9); // Postavite broj postavljenih kamenova na početnu vrednost
            setTotalPlacedStones2(9);
            setWhitePlayerStonesOut(0); // Resetujte brojače za whitePlayerStonesOut i blackPlayerStonesOut
            setBlackPlayerStonesOut(0);
        }
        
    }, [stones, whitePlayerStonesOut, blackPlayerStonesOut]);


    const toggleColor = () => {
        setColor(c => c === 'white' ? 'black' : 'white');
    };
    
    const onCircleClick = (square, index) => {
        const targetCircle = { square, index };
        const newColor = color;
    
        if (isMills) {
            return; // Ako je mills stanje, ne dozvoljavamo dodavanje novih kamenova
        }
    
        if ((newColor === 'white' && totalPlacedStones1 <= 0) || (newColor === 'black' && totalPlacedStones2 <= 0)) {
            if (selectedStone != null) {
                //ako ima 3 od nekog bilo kojeg dozvoli mu na svako slobodno mesto da postavi kamen
                // If whitePlayerStonesOut === 6, allow white player to move to any free space
                if(whitePlayerStonesOut === 6 && color === 'white'){
                    if (isCircleFree(targetCircle.square, targetCircle.index)) {
                        moveStone(selectedStone, targetCircle);
                        toggleColor();
                        setLastMill(stonesInMills);
                    }
                }
                // If blackPlayerStonesOut === 6, allow black player to move to any free space
                else if(blackPlayerStonesOut === 6 && color === 'black'){
                    if (isCircleFree(targetCircle.square, targetCircle.index)) {
                        moveStone(selectedStone, targetCircle);
                        toggleColor();
                        setLastMill(stonesInMills);
                    }
                }
                else{

                    if (isCircleFree(targetCircle.square, targetCircle.index) &&  isMoveAllowed(selectedStone.square, selectedStone.index, targetCircle.square, targetCircle.index, stones)) {
                        moveStone(selectedStone, targetCircle);
                        toggleColor();
                        setLastMill(stonesInMills);
                    }
                }
            }
        } else {
            const newStones = [...stones, { square, index, color: newColor }];
            const hasMills = checkAndHighlightStones(newStones);
            setIsMills(hasMills);
            setStones(newStones);
            toggleColor();
        
            if (newColor === 'white') {
                setTotalPlacedStones1((prevTotal) => prevTotal - 1);
            } else if (newColor === 'black') {
                setTotalPlacedStones2((prevTotal) => prevTotal - 1);
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
        //let areMillsSame = false;
        // if (stonesInMills.length > 0 && previousMills.length > 0) {
        //     areMillsSame = stonesInMills.every((currStone, index) =>
        //         currStone.square === previousMills[index].square && currStone.index === previousMills[index].index
        //     );
        // }

        
        const areStonesInAllMills = stonesInMills.every(stoneInMill => {
            const occurrences = allMills.filter(allMill =>
                allMill.square === stoneInMill.square && allMill.index === stoneInMill.index
            ).length;
        
            return occurrences === 0;
        });

        console.log("jesul", areStonesInAllMills)

        const areAllStonesInAllMills = stones.every(stone => {
            const occurrences = allMills.filter(mill =>
                mill.some(s => s.square === stone.square && s.index === stone.index && s.color === stone.color)
            ).length;
    
            return occurrences > 0;
        });

        if (isMills) {
            const stone = stones.find(s => s.square === square && s.index === index);
            if (stone && stone.color === color) {
                 const isInAllMills = allMills.some(mill =>
                mill.some(s => s.square === square && s.index === index && s.color === color)
            );
            
            if (!isInAllMills || areAllStonesInAllMills) {
                // Ako kamen nije uključen u neki mlin, onda ga možete izbaciti
                const newStones = stones.filter(stone => !(stone.square === square && stone.index === index));
                setAllMills(prevMills => [...prevMills, stonesInMills]);
                setStones(newStones);
                // Proveri boju i dodaj ga u odgovarajući niz lost
                if (stone.color === 'white') {
                    setWhitePlayerStonesOut((prevTotal) => prevTotal + 1);
                } else if (stone.color === 'black') {
                    setBlackPlayerStonesOut((prevTotal) => prevTotal + 1);
                }
                setLastMill(stonesInMills);
                setIsMills(false);
                setStonesInMills([]);
                setCurrentMill([])
                }
                else{
                    alert("Ne mozete izbaciti figure koje su u mlinu");
                }
            }
            return;
        }
        // Pronađite kamen na datoj lokaciji
        const stone = stones.find(s => s.square === square && s.index === index);
    
        // Ako kamen ne postoji ili njegova boja ne odgovara trenutnoj boji, ne dozvolite odabir
        if (!stone || stone.color !== color) {
            return;
        }
    
        if (totalPlacedStones1 !== 0 && totalPlacedStones2 !== 0) {
            return;
        }
    
        // Check if the clicked stone is the same as the selected one
        if (selectedStone && selectedStone.square === square && selectedStone.index === index) {
            setSelectedStone(null);
            setHighlightedMoves([]);
        } else {
                // Otherwise, set the selected stone
                setSelectedStone({ square, index });
                if ((whitePlayerStonesOut === 6 && color === 'white') || (blackPlayerStonesOut === 6 && color === 'black')) {
                    const allMoves = [];
                    for (let square = 0; square < 3; square++) {
                        for (let index = 0; index < 8; index++) {
                            allMoves.push({ square, index });
                        }
                    }

                    const freeSpaces = allMoves.filter(move => {
                        return !stones.some(stone => stone.square === move.square && stone.index === move.index);
                    });

                    console.log(freeSpaces);
                    setHighlightedMoves(freeSpaces);
                } else {
                    setHighlightedMoves(allowedMoves[square][index]);
                }
        }

        
        //napravi da se osvetle
        console.log('Selected Stone:', selectedStone); // Log the selected stone for debugging
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
        for (let stone of stones) {
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
        const newStones = stones.filter(stone => !(stone.square === selectedStone.square && stone.index === selectedStone.index));
    
        // Pronađite boju kamena na staroj lokaciji
        const oldStone = stones.find(stone => stone.square === selectedStone.square && stone.index === selectedStone.index);
        const color = oldStone ? oldStone.color : 'white'; // Uzmi boju ako je dostupna, inače postavi na 'white'
    
        // Zatim se dodaje ažurirani kamen na novi niz sa istom bojom
        newStones.push({ ...selectedStone, square: targetCircle.square, index: targetCircle.index, color: color });
    
        // Postavljanje novog niza kamenova
        setStones(newStones);
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
            {stones.map(({ square, index, color }) => {
                const isStoneInMills = currentMill.some(stone => stone.square === square && stone.index === index);
                return (
                    <Stone
                    key={`${square}-${index}-${color}`}
                    square={square}
                    index={index}
                    color={isStoneInMills ? 'yellow' : color}
                    isSelected={selectedStone && selectedStone.square === square && selectedStone.index === index}
                    onSelect={handleStoneSelect}
                    />
                );
                })}
        </svg>
    )
}
