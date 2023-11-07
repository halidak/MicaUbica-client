import { useState, useEffect } from 'react';
import './Game.css';
import { BoardSquare } from './board/BoardSquare';
import { Stone } from './board/Stone';
import { allowedMoves } from './allowedMoves';
import { millsPostitions } from './millsPositions';

export function GameHC({ totalPlacedStones1, setTotalPlacedStones1, totalPlacedStones2, setTotalPlacedStones2,
    whitePlayerStonesOut, blackPlayerStonesOut, setWhitePlayerStonesOut, setBlackPlayerStonesOut }) {
    
        const [humanStones, setHumanStones] = useState([])
        const [computerStones, setComputerStones] = useState([])
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
    const [canPlay, setCanPlay] = useState(true)

    //slanje requesta 
    const sendPostRequest = (humanStones, computerStones) => {
        // Napravite objekat sa podacima koje želite poslati na server
        const data = {
            humanStones,
            computerStones,
        };
    
        // Postavite opcije za POST zahtev
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };
    
        // Zamijenite 'https://example.com/api' sa stvarnim URL-om na koji želite poslati zahtev
        const apiUrl = 'http://localhost:8000/stones';
    
        // Pošaljite POST zahtev na server
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
                setComputerStones(data.computerStones);
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
        console.log("STONES IZ USEEFFECT", stones)
        checkAndHighlightStones(stones);
        console.log(stonesInMills);
        console.log("TRENUTNI", stonesInMills)
        console.log("PRETHODNI", lastMill)
        console.log("SVI", allMills)
        console.log("HUMAN", humanStones)
        console.log("COMPUTER", computerStones)
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
        
    }, [humanStones, whitePlayerStonesOut, blackPlayerStonesOut]);


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
                if (isCircleFree(targetCircle.square, targetCircle.index) &&  isMoveAllowed(selectedStone.square, selectedStone.index, targetCircle.square, targetCircle.index, stones)) {
                    moveStone(selectedStone, targetCircle);
                    //toggleColor();
                    setLastMill(stonesInMills);
                }
            }
        } else {
            const newStones = [...humanStones, { square, index, color: newColor }];
            const hasMills = checkAndHighlightStones(newStones);
            setIsMills(hasMills);
            setStones(newStones);
            setHumanStones(newStones)
            //toggleColor();
            sendPostRequest(humanStones, computerStones)
        
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

        const areAllStonesInAllMills = computerStones.every(stone => {
            const occurrences = allMills.filter(mill =>
                mill.some(s => s.square === stone.square && s.index === stone.index && s.color === stone.color)
            ).length;
    
            return occurrences > 0;
        });

        if (isMills) {
            
            const stone = computerStones.find(s => s.square === square && s.index === index);
            console.log("STONE", stone)
            if (stone) {
                const isInAllMills = allMills.some(mill =>
                mill.some(s => s.square === square && s.index === index && s.color === color)
            );
            
            if (!isInAllMills || areAllStonesInAllMills) {
                // Ako kamen nije uključen u neki mlin, onda ga možete izbaciti
                const newStones = computerStones.filter(stone => !(stone.square === square && stone.index === index));
                setAllMills(prevMills => [...prevMills, stonesInMills]);
                setStones(newStones);
                setComputerStones(newStones)
                // Proveri boju i dodaj ga u odgovarajući niz lost
                if (!canPlay) {
                    setWhitePlayerStonesOut((prevTotal) => prevTotal + 1);
                } else {
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
            setHighlightedMoves(allowedMoves[square][index]);
        }
    
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
        const newStones = stones.filter(stone => !(stone.square === selectedStone.square && stone.index === selectedStone.index));
    
        // Pronađite boju kamena na staroj lokaciji
        const oldStone = stones.find(stone => stone.square === selectedStone.square && stone.index === selectedStone.index);
        const color = oldStone ? oldStone.color : 'white'; // Uzmi boju ako je dostupna, inače postavi na 'white'
    
        // Zatim se dodaje ažurirani kamen na novi niz sa istom bojom
        newStones.push({ ...selectedStone, square: targetCircle.square, index: targetCircle.index, color: color });
    
        // Postavljanje novog niza kamenova
        setStones(newStones);
        setHumanStones(newStones)
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
            {humanStones.map(({ square, index, color }) => {
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
                {computerStones.map(({ square, index, color }) => {
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
