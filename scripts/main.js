const numColumns = 100;
const numRows = 100;
const cellwidth = 20;
const cellheight = 20;
const speed = 200;


class Cell {


    constructor(context, gridX, gridY, width, height) {

        this.context = context;

        // Store the position of this cell in the grid
        this.gridX = gridX;
        this.gridY = gridY;

        this.width = width;
        this.height = height;

        // Make random cells alive
        this.alive = 0;//Math.random() > 0.5;
    }

    draw() {
        // Draw a simple square


        //this.context.fillStyle = '#303030'; 
        //this.context.rect(this.gridX * this.width, this.gridY * this.height, this.width, this.height);
        //this.context.fill()
        if (this.alive) {
            this.context.beginPath();
            this.context.fillStyle = '#8080ff';
            this.context.arc(this.gridX * this.width, this.gridY * this.height, this.width / 2, 0, 2 * Math.PI);
            this.context.fill()
        }


    }
}

class GameWorld {



    constructor(canvasId, numColumns, numRows, cellwidth, cellheight) {

        this.numColumns = numColumns;
        this.numRows = numRows;

        console.log(this.numColumns + ":" + this.numRows);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.gameObjects = [];

        this.createGrid(cellwidth, cellheight);

        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request
        window.requestAnimationFrame(() => this.gameLoop());
    }

    createGrid(cellwidth, cellheight) {
        for (let y = 0; y < this.numRows; y++) {
            for (let x = 0; x < this.numColumns; x++) {
                this.gameObjects.push(new Cell(this.context, x, y, cellwidth, cellheight));
            }
        }
    }

    isAlive(x, y) {
        if (x < 0 || x >= this.numColumns || y < 0 || y >= this.numRows) {
            return false;
        }

        return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
    }

    gridToIndex(x, y) {
        return x + (y * this.numColumns);
    }

    checkSurrounding() {
        // Loop over all cells
        for (let x = 0; x < this.numColumns; x++) {
            for (let y = 0; y < this.numRows; y++) {

                // Count the nearby population
                let numAlive = this.isAlive(x - 1, y - 1) + this.isAlive(x, y - 1) + this.isAlive(x + 1, y - 1) + this.isAlive(x - 1, y) + this.isAlive(x + 1, y) + this.isAlive(x - 1, y + 1) + this.isAlive(x, y + 1) + this.isAlive(x + 1, y + 1);
                let centerIndex = this.gridToIndex(x, y);


                if (numAlive == 2) {
                    // Do nothing
                    this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
                } else if (numAlive == 3) {
                    // Make alive
                    if (!pause) {
                        this.gameObjects[centerIndex].nextAlive = true;
                    }
                } else if (this.gameObjects[centerIndex].clicked) {
                    this.gameObjects[centerIndex].nextAlive = true;
                    this.gameObjects[centerIndex].clicked = false;
                }

                else {
                    // Make dead
                    if (!pause) {
                        this.gameObjects[centerIndex].nextAlive = false;
                    }
                }
            }
        }

        // Apply the new state to the cells
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
        }
    }

    gameLoop() {
        // Check the surrounding of each cell

        this.checkSurrounding();


        // Clear the screen
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all the gameobjects
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        // The loop function has reached it's end, keep requesting new frames
        setTimeout(() => {
            window.requestAnimationFrame(() => this.gameLoop());
        }, speed)
    }
}






const init = () => {
    console.log("initilising");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameWorld = new GameWorld('canvas', numRows, numColumns, cellwidth, cellheight);
}
var gameWorld;
const canvas = document.querySelector("canvas");

window.addEventListener('resize', init)
window.addEventListener('load', init)

window.addEventListener('mousemove', mouseClick)
window.addEventListener('mousedown', mouseDown)
window.addEventListener('mouseup', mouseUp)


let pause = false;
function mouseUp(evt) {
    pause = false;
}
function mouseDown(evt) {
    pause = true;
}

function mouseClick(evt) {
    //console.log(evt.clientX/cellwidth+":"+evt.clientY/cellheight);

    if (evt.buttons > 0) {
        var gridpoint = getMousePos(evt);
        console.log(gridpoint);
        let centerIndex = gameWorld.gridToIndex(gridpoint.x, gridpoint.y);
        console.log(centerIndex);

        if (gameWorld.gameObjects[centerIndex].alive) {

            gameWorld.gameObjects[centerIndex].clicked = false;
        } else {
            console.log("here");
            gameWorld.gameObjects[centerIndex].clicked = true;
        }
    }
}


function getMousePos(evt) {

    return {
        x: Math.floor(evt.clientX / cellwidth),   // scale mouse coordinates after they have
        y: Math.floor(evt.clientY / cellheight)     // been adjusted to be relative to element
    }
}