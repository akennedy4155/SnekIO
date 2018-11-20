const tileSize = 32;
const width = 640;
const height = 480;
const speed = 10;

// Colors
class Color {

  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

}

const redColor = new Color(255,0,0);
const greenColor = new Color(0,255,0);
const whiteColor = new Color(255, 255, 255);

// enum for directions
let Direction = Object.freeze({
  'UP': 0,
  'DOWN': 1,
  'LEFT': 2,
  'RIGHT': 3
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

  constructor(location, size, fillColor){
    this.location = location;
    this.size = size;
    this.fillColor = whiteColor;
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
  // TODO: I just want to die!

  constructor(location) {
    super(location, tileSize);
    this.fillColor = redColor;
    this.direction = Direction.RIGHT;
    // initialize the snake with two pieces of tail
    this.tail = [new Tile(new Location(-1, 0), tileSize, redColor),
      new Tile(new Location(-2, 0), tileSize, redColor)
    ];
  }

  move() {
    // TODO: what happens when the snake moves off of the screen?
    // TODO: why can I move backwards???
    // head moving
    let headPastLocation = this.location;
    switch(this.direction) {
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
    for(let i = this.tail.length - 1; i > 0; i--) {
      this.tail[i].location = this.tail[i - 1].location;
    }
    this.tail[0].location = headPastLocation;
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  reset() {
    // TODO: this isn't going to work when there's tail pieces on there
    this.location = new Location(-1,0);
    this.direction = Direction.RIGHT;
  }

  draw() {
    this.move();
    super.draw();
    for(let i = 0; i < this.tail.length; i++){
      this.tail[i].draw();
    }
  }

  eat() {
    // add a tail piece

  }
}

class Food extends Tile {

  constructor() {
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
    for (let x = 0; x < width / tileSize; x++){
      let row = [];
      for(let y = 0; y < height / tileSize; y++){
        row.push(new Tile(
          new Location(x, y),
          tileSize,
          whiteColor)
        );
      }
      this.tiles.push(row);
    }

    // creates the snake and the food
    this.snake = new Snake(new Location(0, 0));
    this.food = new Food();
  }

  draw() {
    // draw all of the tiles
    for (let row in this.tiles) {
      for (let tile in this.tiles[row]) {
        this.tiles[row][tile].draw();
      }
    }

    // if the head of the snake is on the food. eat the food and make a new food.
    if(this.snake.location.equals(this.food.location)) {
      this.snake.eat();
      this.food = new Food();
    }

    // draw the food and the snake
    this.food.draw();
    this.snake.draw();

  }

}
