
export function Stone({ square, index, color, isSelected, onSelect  }) {
    let x = 0;
    let y = 0;
    if (index >= 0 && index < 3) {
        y = square * 10 + 10;
        if (index === 0) {
            x = square * 10 + 10;
        } else if (index === 1) {
            x = 50;
        } else if (index === 2) {
            x = 100 - (square * 10 + 10)
        }
    } else if (index >= 4 && index < 7) {
        y = 100 - (square * 10 + 10);
        if (index === 4) {
            x = 100 - (square * 10 + 10)
        } else if (index === 5) {
            x = 50;
        } else if (index === 6) {
            x = square * 10 + 10;
        }
    } else if (index === 3) {
        y = 50;
        x = 100 - (square * 10 + 10)
    } else if (index === 7) {
        y = 50;
        x = square * 10 + 10;
    }

    const handleStoneClick = () => {
        onSelect(square, index);
    };

    return (
        <circle cx={x} cy={y} r={3}  fill={isSelected ? 'red' : color} onClick={handleStoneClick}/>
    )
}