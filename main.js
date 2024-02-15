function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const gameBoard = document.querySelector(".game-board");

let stop = false;
let direction = "down"
let interval;
let gOverInterval;
const speed = 500
const width = gameBoard.offsetWidth;
const height = gameBoard.offsetHeight;
const gOver = document.querySelector(".game-over")
const snakeHead = document.createElement('div')
snakeHead.classList.add('snake-head');
gameBoard.append(snakeHead);
const food = document.querySelector(".food");
const headWidth = snakeHead.offsetWidth;
const boardScale = width / headWidth;
let headPos = [];
let foodPos = [];
let body = [];
let grow = false
let swallowedFood = [];
initialise();


function initialise() {
    direction = "down"
    headPos = [boardScale / 2 * 5, boardScale / 2 * 5];
    snakeHead.style.top = headPos[0] + "px";
    snakeHead.style.left = headPos[1] + "px";
    clearInterval(interval);
    clearInterval(gOverInterval);
    for (let i = 0; i < body.length; i++) {
        const bodyPart = document.querySelector('.part_' + i);
        gameBoard.removeChild(bodyPart)
    }

    body = [];
    grow = false;
    swallowedFood = [];
    gOver.style.display = "none"
}

document.querySelector(".restart").addEventListener('click', initialise)
document.querySelector(".start").addEventListener('click', start)

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowLeft":
            if (direction === "right") break;
            direction = "left";
            break;
        case "ArrowRight":
            if (direction === "left") break;
            direction = "right";
            break;
        case "ArrowUp":
            if (direction === "down") break;
            direction = "up";
            break;
        case "ArrowDown":
            if (direction === "up") break;
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
            headPos[0] += headWidth;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            //bodyMove(posTransfer)
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "up":
            headPos[0] -= headWidth;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            //bodyMove(posTransfer)
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "left":
            headPos[1] -= headWidth;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            //bodyMove(posTransfer)
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
        case "right":
            headPos[1] += headWidth;
            snakeHead.style.top = headPos[0] + "px";
            snakeHead.style.left = headPos[1] + "px";
            //bodyMove(posTransfer)
            body.length > 0 ? bodyMove(posTransfer) : "";
            break;
    }
    if (headPos[0] < 0 || headPos[1] < 0 || headPos[0] > width - headWidth || headPos[1] > width - headWidth) gameOver();
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
        const newPart = document.createElement('div');
        newPart.classList.add('body', 'part_' + (body.length - 1));
        gameBoard.append(newPart);
        newPart.style.top = body[body.length - 1][0] + "px";
        newPart.style.left = body[body.length - 1][1] + "px";
    }
    if (foodPos[0] === headPos[0] && foodPos[1] === headPos[1]) eatFood();
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
    foodPos = [rand(0, (boardScale)) * 5, (rand(0, boardScale)) * 5]
    // foodPos = [(boardScale / 2 + 5) * 5, boardScale / 2 * 5]
    food.style.top = foodPos[0] + "px"
    food.style.left = foodPos[1] + "px"
    food.style.display = "block"
}