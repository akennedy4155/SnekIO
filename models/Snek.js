//TODO ADD A Score thing in the html
// <editor-fold> UTILITIES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Color {

  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

}

let Direction = Object.freeze({
  'UP': {
    "x" : 0,
    "y" : -1
  },
  'LEFT': {
    "x" : -1,
    "y" : 0
  },
  'RIGHT': {
    "x" : 1,
    "y" : 0
  },
  'DOWN': {
    "x" : 0,
    "y" : 1
  }
});

class Location {

  // x and y are defined as (0, 0) top left, x horizontal, y vertical
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(otherLoc) {
    return this.x == otherLoc.x && this.y == otherLoc.y;
  }

  add(otherLoc) {
    return new Location(this.x + otherLoc.x, this.y + otherLoc.y);
  }
}

class Tile {

  constructor(location, size, fillColor = redColor) {
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
// </editor-fold> END UTILITIES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// <editor-fold> CONSTANTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const tileSize = 16;
const width = 640;
const height = 480;
const speed = 10;

const redColor = new Color(255, 0, 0);
const greenColor = new Color(0, 255, 0);
const whiteColor = new Color(255, 255, 255);
const grayColor = new Color(220, 220, 220);

// </editor-fold> END CONSTANTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class GameBoard {

  // creates tiles in the grid
  constructor(width, height, tileSize) {
    let white = true;
    this.tiles = [];
    for (let x = 0; x < width / tileSize; x++) {
      let row = [];
      (x % 2 == 1) ? white = false : white = true;
      for (let y = 0; y < height / tileSize; y++) {
        let color = whiteColor;
        if (!white)
          color = grayColor;
        row.push(new Tile(
          new Location(x, y),
          tileSize,
          color));
        white = !white;
      }
      this.tiles.push(row);
    }

    // creates the snake and the food
    this.snake = new Snake(new Location(0, 0));
    this.food = new Food(this.getSnakeTiles(this.snake));
  }

  getSnakeTiles(snek) {
    let snakeHeadLoc = [snek.location];
    let snakeTailLocs = [];
    for(let i = 0; i < snek.tail.length; i++) {
      snakeTailLocs.push(snek.tail[i].location);
    }
    return snakeHeadLoc.concat(snakeTailLocs);
  }

  // all of the game logic here
  playTurn() {
    this.snake.move();
    if (this.snake.location.equals(this.food.location)) {
      this.snake.eat();
      this.food = new Food(this.getSnakeTiles(this.snake));
    }
  }

  draw() {
    // draw all of the tiles
    noStroke();
    for (let row in this.tiles) {
      for (let tile in this.tiles[row]) {
        this.tiles[row][tile].draw();
      }
    }

    stroke(0);
    // draw the food and the snake
    this.food.draw();
    this.snake.draw();
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
    this.fitness = 0;
    this.score = 0;
    this.playing = false;
    this.brain = new NeuralNetwork(7,6,4);
    this.sensors = [];
  }

  start() {
    this.playing = true;
  }

  sense() {
    // get all of the inputs:
    // 1. distance to dying forward
    // 2. distance to dying left
    // 3. distance to dying right
    // 4. distance to dying forward left
    // 5. distance to dying forward right
    // 6. x to food
    // 7. y to food
    this.sensors = [];
    // forward sensor
    // check the distance to the wall
  }

  move() {
    if (this.playing) {
      // move head
      let headPastLocation = this.location;
      this.lastLocation = this.tail[this.tail.length - 1].location;
      this.location = this.location.add(this.direction);

      // move the tail
      for (let i = this.tail.length - 1; i > 0; i--) {
        this.tail[i].location = this.tail[i - 1].location;
      }
      this.tail[0].location = headPastLocation;
      this.fitness ++;
      // check for collisions
      if (this.colliding()) {
        console.log("score:", this.score, "fitness:", this.fitness);
        this.reset();
      }
    }
  }

  changeDirection(direction) {
    // if statement to prevent moving backwards
    if (!(this.direction.x + direction.x == 0 && this.direction.y + direction.y == 0))
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
    this.score = 0;
    this.fitness = 0;
    this.playing = false;
  }

  draw() {
    if (this.playing) {
      super.draw();
      for (let i = 0; i < this.tail.length; i++) {
        this.tail[i].draw();
      }
    }
  }

  eat() {
    this.tail.push(new Tile(this.lastLocation, tileSize, redColor));
    this.score ++;
    this.fitness += 100;
  }

  colliding() {
    let isCollision = false;
    if (this.location.x < 0 || this.location.x >= (width / tileSize) ||
      this.location.y < 0 || this.location.y >= (height / tileSize)) {
      isCollision = true;
    }
    for (let i = 0; i < this.tail.length; i++) {
      if (this.location.equals(this.tail[i].location)) {
        isCollision = true;
        break;
      }
    }
    return isCollision;
  }
}

class Food extends Tile {

  constructor(snakeTiles) {
    let x = Math.floor(Math.random() * width / tileSize);
    // random y between height
    let y = Math.floor(Math.random() * height / tileSize);
    let loc = new Location(x, y);
    let valid = true;
    print(snakeTiles);
    for(let i = 0; i < snakeTiles.length; i++) {
      if(loc.equals(snakeTiles[i])) {
        valid = false;
        break;
      }
    }
    while(!valid) {
      console.log("wasn't valid...");
      x = Math.floor(Math.random() * width / tileSize);
      // random y between height
      y = Math.floor(Math.random() * height / tileSize);
      loc = new Location(x, y);
      valid = true;
      for(let i = 0; i < snakeTiles.length; i++) {
        if(loc.equals(snakeTiles[i]))
          valid = false;
      }
    }
    super(new Location(x, y), tileSize, greenColor);
  }
}