function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function checkTicTacToeWinner(matrix) {
    // Все возможные выигрышные комбинации
    const winningCombinations = [
        // Горизонтальные линии
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        // Вертикальные линии
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],

        // Диагонали
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    // Проверяем каждую выигрышную комбинацию
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            matrix[a[0]][a[1]].sign &&
            matrix[a[0]][a[1]].sign === matrix[b[0]][b[1]].sign &&
            matrix[a[0]][a[1]].sign === matrix[c[0]][c[1]].sign
        ) {
            return matrix[a[0]][a[1]].sign; 
        }
    }

    if (matrix.every(row => row.every(cell => cell.sign))) {
        return "nobody";
    }

    return null;
}

const canvas = document.querySelector('canvas');
canvas.width = 280;
canvas.height = 280;
const context = canvas.getContext('2d');

const fillWithColor = (context, color) => {
    const width = context.canvas.width;
    const height = context.canvas.height;

    context.fillStyle = color;
    context.fillRect(0, 0, width, height);
}

const getCell = function (c, x, y, w, h, color) {
    return {
        x, y,
        width: w,
        height: h,
        color,
        sign: null,
        pointer: false,

        interactionColor: {
            hoverOff: color,
            hoverOn: 'rgba(0, 0, 0, 0.5)',
            active: 'rgba(255, 0, 0, 0.6)',
        },

        bounds: {
            topLeft: { x, y },
            topright: { x: x + w, y },
            bottomLeft: { x, y: y + h },
            bottomRight: { x: x + w, y: y + h }
        },

        render: function () {
            //console.log(this);
            c.fillStyle = this.color;
            c.fillRect(x, y, w, h);

            this.drawSign(this.sign);
        },

        drawSign: function(sign) {
            c.lineWidth = 10;
            c.strokeStyle = 'white';

            if(sign == 'x' ) {
                c.beginPath();
                c.moveTo(this.x + 10, this.y + 10);
                c.lineTo(this.x + this.width - 10, this.y + this.height - 10);
                c.closePath();
                c.stroke();

                c.beginPath();
                c.moveTo(this.x + this.width - 10, this.y + 10);
                c.lineTo(this.x + 10, this.y + this.height - 10);
                c.closePath();
                c.stroke();
            } else if (sign == 'o'){
                let cellCenterX = this.x + (this.width) / 2;
                let cellCenterY = this.y + (this.height) / 2;

                c.beginPath();
                c.arc(cellCenterX, cellCenterY, 30, 0, 2 * Math.PI, false);
                c.fillStyle = 'transparent';
                c.fill();
                c.closePath();
                c.stroke();
            } 
        },

        isIntersects: (mousePos) => {
            return true;
        }
    }
}

let steps = 0;
let inactiveColor = 'rgba(0, 0, 0, 0.9)';
let mousePos = { x: -1, y: -1 };
let isClick = false;
let gameWinner = null;
const matrix = [
    [
        getCell(context, 10, 10, 80, 80, inactiveColor),
        getCell(context, 100, 10, 80, 80, inactiveColor),
        getCell(context, 190, 10, 80, 80, inactiveColor)
    ],
    [
        getCell(context, 10, 100, 80, 80, inactiveColor),
        getCell(context, 100, 100, 80, 80, inactiveColor),
        getCell(context, 190, 100, 80, 80, inactiveColor)
    ],
    [
        getCell(context, 10, 190, 80, 80, inactiveColor),
        getCell(context, 100, 190, 80, 80, inactiveColor),
        getCell(context, 190, 190, 80, 80, inactiveColor)
    ],
];

canvas.addEventListener('mousedown', (event) => {
    isClick = true;

    if(gameWinner) {
        alert('winner', gameWinner);
    } else {
        matrix.forEach(line => {
            line.forEach(cell => {
                // console.log(cell);
                if (
                    mousePos.x >= cell.bounds.topLeft.x &&
                    mousePos.y >= cell.bounds.topLeft.y &&
                    mousePos.x <= cell.bounds.bottomRight.x &&
                    mousePos.y <= cell.bounds.bottomRight.y
                ) {
                    cell.color = cell.interactionColor.active;
    
                    if(cell.sign !== 'x' && cell.sign !== 'o' && gameWinner == null) {
                        cell.sign = steps % 2 === 0 ? 'x' : 'o';
                        steps += 1;
    
                        gameWinner = checkTicTacToeWinner(matrix);
                    } 
                }
            });
        });
    }
});

canvas.addEventListener('mouseup', (event) => {
    isClick = false;

    if(gameWinner) {
        alert('winner: '+ gameWinner);
    } else {
        matrix.forEach(line => {
            line.forEach(cell => {
                if (
                    mousePos.x >= cell.bounds.topLeft.x &&
                    mousePos.y >= cell.bounds.topLeft.y &&
                    mousePos.x <= cell.bounds.bottomRight.x &&
                    mousePos.y <= cell.bounds.bottomRight.y
                ) {
                    cell.color = cell.interactionColor.hoverOn;
                }
            });
        });
    }
});

canvas.addEventListener('mousemove', (event) => {
    mousePos = getMousePos(canvas, event);

    matrix.forEach(line => {
        line.forEach(cell => {
            // console.log(cell);
            if (
                mousePos.x >= cell.bounds.topLeft.x &&
                mousePos.y >= cell.bounds.topLeft.y &&
                mousePos.x <= cell.bounds.bottomRight.x &&
                mousePos.y <= cell.bounds.bottomRight.y
            ) {
                if(isClick) {
                    cell.color = cell.interactionColor.active;                    
                } else {
                    cell.color = cell.interactionColor.hoverOn;
                }
                cell.pointer = true;
            } else {
                cell.color = cell.interactionColor.hoverOff;
                cell.pointer = false;
            }
        });
    });
});

const loop = () => {
    requestAnimationFrame(loop);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    fillWithColor(context, 'rgba(0, 0, 0, 0.8)');

    // МНЕ НЕ НРАВИТСЯ ЭТО РЕШЕНИЕ
    let allCellPointerStates = matrix.flat().map(cell => cell.pointer);
    let hasActiveCell = allCellPointerStates.some(item => item === true);

    if (hasActiveCell) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'initial';
    }

    matrix.forEach(line => {
        line.forEach(cell => {
            cell.render();
        });
    });
}

requestAnimationFrame(loop);