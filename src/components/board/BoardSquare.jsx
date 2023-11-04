// import React from "react";
import './BoardSquare.css'

export function BoardSquare({ padding, onCircleClick, highlightedMoves }) {
    const startPadding = padding;
    const endPadding = 100 - startPadding;
    const square = padding / 10 - 1;
    return (
        <>
            <line className='board-line' x1={startPadding} y1={startPadding} x2={endPadding} y2={startPadding} />
            <line className='board-line' x1={endPadding} y1={startPadding} x2={endPadding} y2={endPadding} />
            <line className='board-line' x1={endPadding} y1={endPadding} x2={startPadding} y2={endPadding} />
            <line className='board-line' x1={startPadding} y1={endPadding} x2={startPadding} y2={startPadding} />

            {[0, 1, 2, 3, 4, 5, 6, 7].map(index => (
    <circle
        key={index}
        className={`board-circle ${highlightedMoves.some(move => move.square === square && move.index === index) ? 'board-circle-highlighted' : ''}`}
        onClick={() => onCircleClick(square, index)}
        cx={getCirclePosition(index, startPadding, endPadding).x}
        cy={getCirclePosition(index, startPadding, endPadding).y}
        r={highlightedMoves.some(move => move.square === square && move.index === index) ? 1.5 : 1}
    />
))}
        </>
    )
}

function getCirclePosition(index, startPadding, endPadding) {
    switch (index) {
        case 0: return { x: startPadding, y: startPadding };
        case 1: return { x: 50, y: startPadding };
        case 2: return { x: endPadding, y: startPadding };
        case 3: return { x: endPadding, y: 50 };
        case 4: return { x: endPadding, y: endPadding };
        case 5: return { x: 50, y: endPadding };
        case 6: return { x: startPadding, y: endPadding };
        case 7: return { x: startPadding, y: 50 };
        default: return { x: 0, y: 0 };
    }
}