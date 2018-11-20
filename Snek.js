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
  'UP': 0,
  'LEFT': 1,
  'RIGHT': 2,
  'DOWN': 3
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

}

class Tile {
  // TODO: draw the borders on the bottom and right edges of the game board

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
    this.food = new Food();
  }

  // all of the game logic here
  playTurn() {
    this.snake.move();
    if (this.snake.location.equals(this.food.location)) {
      this.snake.eat();
      this.food = new Food();
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
  }

  start() {
    this.playing = true;
  }

  move() {
    if (this.playing) {
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
      this.fitness ++;
      // check for collisions
      if (this.colliding()) {
        console.log("score:", this.score, "fitness:", this.fitness);
        this.reset();
      }
    }
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
    // TODO: what happens if the food spawns under the snake?
    //random x between width
    let x = Math.floor(Math.random() * width / tileSize);
    // random y between height
    let y = Math.floor(Math.random() * height / tileSize);
    super(new Location(x, y), tileSize, greenColor);
  }

}
