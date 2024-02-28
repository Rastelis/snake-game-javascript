function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const gameBoard = document.querySelector(".game-board");

let stop = false;
let direction = "down";
let interval;
let gOverInterval;
let directionBuffer = direction;
const initialLength = 5;
let speed = 250;
const headSize = 8;
const boardWidht = 400;
r = document.querySelector(":root");
r.style.setProperty("--head-size", headSize + "px");
r.style.setProperty("--board-width", boardWidht + "px");

//const width = gameBoard.offsetWidth;
const gOver = document.querySelector(".game-over");
const snakeHead = document.createElement('div');
snakeHead.classList.add('snake-head');
gameBoard.append(snakeHead);

snakeHead.style.width = headSize
snakeHead.style.height = headSize
const food = document.querySelector(".food");
//const headWidth = snakeHead.offsetWidth;
const boardScale = boardWidht / headSize;
let headPos = [];
let foodPos = [];
let body = [];
let grow = false
let swallowedFood = [];
initialise();


function initialise() {
    direction = "down"
    headPos = [boardScale / 2 * headSize, boardScale / 2 * headSize];
    snakeHead.style.top = headPos[0] + "px";
    snakeHead.style.left = headPos[1] + "px";
    clearInterval(interval);
    clearInterval(gOverInterval);

    for (let i = 0; i < body.length; i++) {
        const bodyPart = document.querySelector('.part_' + i);
        gameBoard.removeChild(bodyPart)
    }
    body = [];
    for (let i = 0; i < initialLength; i++) {
        body.push([boardScale / 2 * headSize, boardScale / 2 * headSize])
        addBoddyPart()
    }
    grow = false;
    swallowedFood = [];
    gOver.style.display = "none"
}

document.querySelector(".restart").addEventListener('click', initialise)
document.querySelector(".start").addEventListener('click', start)

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            if (directionBuffer === "right") break;
            direction = "left";
            break;
        case "ArrowRight":
            if (directionBuffer === "left") break;
            direction = "right";
            break;
        case "ArrowUp":
            if (directionBuffer === "down") break;
            direction = "up";
            break;
        case "ArrowDown":
            if (directionBuffer === "up") break;
            direction = "down";
            break;

    }
});

function gameOver() {
    clearInterval(interval)
    gOver.style.display = "block";
    gOverInterval = setInterval(() => {
        if (gOver.style.display === "none") gOver.style.display = "block";
        else gOver.style.display = "none";
    }, 1000)

}

function headMove(direction) {
    let posTransfer = [...headPos];
    switch (direction) {
        case "down":
            headPos[0] += headSize;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "up":
            headPos[0] -= headSize;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "left":
            headPos[1] -= headSize;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "right":
            headPos[1] += headSize;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
    }
    directionBuffer = direction;
    if (headPos[0] < 0 || headPos[1] < 0 || headPos[0] > boardWidht - headSize || headPos[1] > boardWidht - headSize) gameOver();
    if (body.length > 1)
        for (let i = 0; i < body.length; i++) {
            if (body[i][0] == headPos[0] && body[i][1] == headPos[1]) gameOver();
            if (swallowedFood.length > 0) {
                const bodyPart = document.querySelector('.part_' + i);
                console.log("full-belly");
                console.log(swallowedFood);
                for (let j = 0; j < swallowedFood.length; j++) {
                    if (body[i][0] == swallowedFood[j][0] && body[i][1] == swallowedFood[j][1]) bodyPart.classList.add('full-belly');
                    else if (bodyPart.classList.contains("full-belly")) bodyPart.classList.remove("full-belly")
                }
            }
        }
    if (body.length > 0 && swallowedFood.length > 0) {
        if (body[body.length - 1][0] == swallowedFood[swallowedFood.length - 1][0] && body[body.length - 1][1] == swallowedFood[swallowedFood.length - 1][1]) grow = true;
    }
    if (grow) {
        if (body.length > 0) {
            const bodyPart = document.querySelector('.part_' + (body.length - 1));
            bodyPart.classList.remove("full-belly")
        }
        body.push(swallowedFood.pop())
        grow = false;
        addBoddyPart();
    }
    if (foodPos[0] === headPos[0] && foodPos[1] === headPos[1]) eatFood();
}

function addBoddyPart() {
    const newPart = document.createElement('div');
    newPart.classList.add('body', 'part_' + (body.length - 1));
    gameBoard.append(newPart);
    newPart.style.top = body[body.length - 1][0] + "px";
    newPart.style.left = body[body.length - 1][1] + "px";
}

function bodyMove(pos) {
    for (let i = 0; i < body.length; i++) {
        const bodyPart = document.querySelector('.part_' + i);
        const bufferTop = bodyPart.style.top.match(/\d+/g);
        const bufferLeft = bodyPart.style.left.match(/\d+/g);
        bodyPart.style.top = pos[0] + "px";
        bodyPart.style.left = pos[1] + "px";
        body[i][0] = pos[0];
        body[i][1] = pos[1];
        pos[0] = bufferTop;
        pos[1] = bufferLeft;
    }
}

function eatFood() {
    food.style.display = "none"
    if (body.length === 0) {
        grow = true;
        swallowedFood.push(foodPos);
    }
    else swallowedFood.push(foodPos);
    generateFood();
}

function start() {
    generateFood();
    interval = setInterval(() => headMove(direction), speed)
}

function generateFood() {
    foodPos = [rand(0, (boardScale - 1)) * headSize, (rand(0, boardScale - 1)) * headSize]
    // foodPos = [(boardScale / 2 + 5) * 5, boardScale / 2 * 5]
    food.style.top = foodPos[0] + "px"
    food.style.left = foodPos[1] + "px"
    food.style.display = "block"
}