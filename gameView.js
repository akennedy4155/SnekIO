const tileSize = 16;
const width = 640;
const height = 480;
const speed = 10;

//TODO ADD A Score thing in the html

// Colors
class Color {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

}

const redColor = new Color(255, 0, 0);
const greenColor = new Color(0, 255, 0);
const whiteColor = new Color(255, 255, 255);

// enum for directions
let Direction = Object.freeze({
    'UP': 0,
    'LEFT': 1,
    'RIGHT': 2,
    'DOWN': 3
});



function setup() {
    // setup/initialization here
    if (width % tileSize !== 0 || height % tileSize !== 0) {
        throw new Error('Either width or height invalid. Must be divisible evenly by the tile size.');
    }

    createCanvas(width, height);
    g = new GameBoard(width, height, tileSize);
    frameRate(speed);
}

function draw() {
    g.draw();
}

function keyPressed() {
    if (keyCode == 38) {
        g.snake.changeDirection(Direction.UP);
    } else if (keyCode == 37) {
        g.snake.changeDirection(Direction.LEFT);
    } else if (keyCode == 39) {
        g.snake.changeDirection(Direction.RIGHT);
    } else if (keyCode == 40) {
        g.snake.changeDirection(Direction.DOWN);
    } else if (keyCode == 32) {
        g.snake.reset();
    }
}

class Tile {
    // TODO: draw the borders on the bottom and right edges of the game board

    constructor(location, size, fillColor) {
        this.location = location;
        this.size = size;
        this.fillColor = fillColor;
    }


    draw() {
        fill(this.fillColor.r, this.fillColor.g, this.fillColor.b);
        rect(this.location.x * this.size,
            this.location.y * this.size,
            this.size,
            this.size
        );
    }

}

class Location {

    // x and y are defined as 0, 0, x horizontal, y vertical
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(otherLoc) {
        return this.x == otherLoc.x && this.y == otherLoc.y;
    }

}

class Snake extends Tile {

    constructor(location) {
        super(location, tileSize);
        this.fillColor = redColor;
        this.direction = Direction.RIGHT;
        // initialize the snake with two pieces of tail
        this.tail = [
            new Tile(new Location(-1, 0), tileSize, redColor),
            new Tile(new Location(-2, 0), tileSize, redColor)
        ];
        this.lastLocation = this.tail[this.tail.length - 1].location;
    }

    move() {
        // move head
        let headPastLocation = this.location;
        this.lastLocation = this.tail[this.tail.length - 1].location;
        switch (this.direction) {
            case Direction.RIGHT:
                this.location = new Location(this.location.x + 1, this.location.y);
                break;
            case Direction.LEFT:
                this.location = new Location(this.location.x - 1, this.location.y);
                break;
            case Direction.UP:
                this.location = new Location(this.location.x, this.location.y - 1);
                break;
            case Direction.DOWN:
                this.location = new Location(this.location.x, this.location.y + 1);
                break;
        }

        // move the tail
        for (let i = this.tail.length - 1; i > 0; i--) {
            this.tail[i].location = this.tail[i - 1].location;
        }
        this.tail[0].location = headPastLocation;
    }

    changeDirection(direction) {
        // if statement to prevent moving backwards.
        // utilizes the numeric values of the enumeration to check for
        // invalid combinations of movements compared to current direction
        if (direction + this.direction != 3)
            this.direction = direction;
    }

    reset() {
        this.location = new Location(0, 0);
        this.direction = Direction.RIGHT;
        this.tail = [
            new Tile(new Location(-1, 0), tileSize, redColor),
            new Tile(new Location(-2, 0), tileSize, redColor)
        ];
        this.lastLocation = this.tail[this.tail.length - 1].location;
    }

    draw() {
        if (this.colliding()) {
            this.reset();
        }
        super.draw();
        for (let i = 0; i < this.tail.length; i++) {
            this.tail[i].draw();
        }
    }

    eat() {
        this.tail.push(new Tile(this.lastLocation, tileSize, redColor));
    }

    colliding() {
        let isCollision = false;
        if (this.location.x < 0 || this.location.x >= (width / tileSize) ||
            this.location.y < 0 || this.location.y >= (height / tileSize)) {
                isCollision = true;
        }
        for (let i = 0; i < this.tail.length; i++) {
            if(this.location.equals(this.tail[i].location)){
                isCollision = true;
                break;
            }
        }
        return isCollision;
    }
}

    class Food extends Tile {

        constructor(snakeTiles) {
            // TODO: what happens if the food spawns under the snake?
            //random x between width
            let x = Math.floor(Math.random() * width / tileSize);
            // random y between height
            let y = Math.floor(Math.random() * height / tileSize);
            super(new Location(x, y), tileSize);
            this.fillColor = greenColor;
        }

    }

    class GameBoard {

        // creates tiles in the grid
        constructor(width, height, tileSize) {
            this.tiles = [];
            for (let x = 0; x < width / tileSize; x++) {
                let row = [];
                for (let y = 0; y < height / tileSize; y++) {
                    row.push(new Tile(
                        new Location(x, y),
                        tileSize,
                        whiteColor));
                }
                this.tiles.push(row);
            }

            // creates the snake and the food
            this.snake = new Snake(new Location(0, 0));
            this.food = new Food();
        }

        draw() {
            this.snake.move();
            // draw all of the tiles
            for (let row in this.tiles) {
                for (let tile in this.tiles[row]) {
                    this.tiles[row][tile].draw();
                }
            }

            // if the head of the snake is on the food. eat the food and make a new food.
            if (this.snake.location.equals(this.food.location)) {
                this.snake.eat();
                this.food = new Food();
            }

            // draw the food and the snake
            this.food.draw();
            this.snake.draw();
        }

    }
