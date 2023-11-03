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
    const [previousMills, setPreviousMills] = useState([]); // Dodaj stanje za prethodne mlinove
    

    // const [whitePlayerStonesOut, setWhitePlayerStonesOut] = useState(1);
    // const [blackPlayerStonesOut, setBlackPlayerStonesOut] = useState(1);

    const checkAndHighlightStones = (stonesToCheck) => {
        const stonesInMills = [];
        
        for (let position of millsPostitions) {
            const stonesInPosition = position.map(([square, index]) => 
                stonesToCheck.find(stone => stone.square === square && stone.index === index)
            );
    
            // Proveri da li su svi kamenovi u trenutnoj poziciji iste boje i da li nisu bili u mlinu u prethodnom potezu
            if (stonesInPosition.every(stone => stone && stone.color === color) && 
                !stonesInPosition.every(stone => previousMills.includes(stone))) {
                stonesInMills.push(...stonesInPosition); // Dodaj kamenje u mlinu u niz
            } 
        }
    
       
        setStonesInMills(stonesInMills); // Ažuriraj stanje sa kamenjem u mlinovima
        return stonesInMills.length > 0; // Vrati true ako ima kamenja u mlinovima
    };

    useEffect(() => {
        console.log("STONES IZ USEEFFECT", stones)
        checkAndHighlightStones(stones);
        console.log(stonesInMills);
        console.log("VEC BILI", previousMills)
        console.log("TRENUTNI", stonesInMills)
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
            setPreviousMills([]);
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
                if (isCircleFree(targetCircle.square, targetCircle.index) &&  isMoveAllowed(selectedStone.square, selectedStone.index, targetCircle.square, targetCircle.index, stones)) {
                    moveStone(selectedStone, targetCircle);
                    toggleColor();
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
    

    const handleStoneSelect = (square, index) => {
        let areMillsSame = false;
        if (stonesInMills.length > 0 && previousMills.length > 0) {
            areMillsSame = stonesInMills.every((currStone, index) =>
                currStone.square === previousMills[index].square && currStone.index === previousMills[index].index
            );
        }

        if (isMills && !areMillsSame) {
            const stone = stones.find(s => s.square === square && s.index === index);
            if (stone && stone.color === color) {
                // Makni ga iz stones liste
                const newStones = stones.filter(stone => !(stone.square === square && stone.index === index));
                setStones(newStones);
                
                // Proveri boju i dodaj ga u odgovarajući niz lost
                if (stone.color === 'white') {
                    setWhitePlayerStonesOut((prevTotal) => prevTotal + 1);
                } else if (stone.color === 'black') {
                    setBlackPlayerStonesOut((prevTotal) => prevTotal + 1);
                }
                
                setIsMills(false);
                setStonesInMills([]);
                setPreviousMills(stonesInMills); // Postavi trenutne mlinove kao prethodne za sledeći potez
                console.log("VEC MILLS", previousMills)
                console.log()
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
    const isStoneInMills = stonesInMills.some(stone => stone.square === square && stone.index === index);
    return (
        <Stone
            key={`${square}-${index}-${color}`}
            square={square}
            index={index}
            color={isStoneInMills ? 'yellow' : color} // If the stone is in a mill, color it yellow
            isSelected={selectedStone && selectedStone.square === square && selectedStone.index === index}
            onSelect={handleStoneSelect}
        />
    );
})}

        </svg>
    )
}
