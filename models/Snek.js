//TODO ADD A Score thing in the html

// <editor-fold> CONSTANTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const tileSize = 32;
const width = 160;
const height = 160;
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
      (x % 2 == 1) ? white = false: white = true;
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
    this.food = new Food(this.snake.getFullLocation());
  }

  // all of the game logic here
  playTurn() {
    this.snake.move(this);
    if (this.snake.location.equals(this.food.location)) {
      this.snake.eat();
      this.food = new Food(this.snake.getFullLocation());
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

  // <editor-fold> BUTTON OPERATIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // function for the click of the start button
  start() {
    this.snake.playing = true;
  }

  // reset the snake to the starting position
  reset() {
    this.snake.respawn();
  }
  // </editor-fold> END BUTTON OPERATIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

class Snake extends Tile {

  constructor(location) {
    super(location, tileSize, redColor);
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
    // random brain
    this.brain = new Brain(7, 6, 4);
    this.sensors = [];
    this.directionChangedThisTurn = false;
  }

  // <editor-fold> PHYSICAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // move the snake on the gameboard, once per frame
  move() {
    if (this.playing) {
      // move head
      let headPastLocation = this.location;
      // set the end location of the snake so you know where to add the last segment if you eat
      this.lastLocation = this.tail[this.tail.length - 1].location;
      // move the snake's head in direction moving
      this.location = this.location.add(this.direction);

      // move the tail
      for (let i = this.tail.length - 1; i > 0; i--) {
        this.tail[i].location = this.tail[i - 1].location;
      }
      // move the last piece of the tail to the last location of the head
      this.tail[0].location = headPastLocation;
      // increment fitness
      this.fitness++;
      // check for collisions
      // if colliding, reset the snake and print the score
      if (this.colliding()) {
        console.log("score:", this.score, "fitness:", this.fitness);
        this.respawn();
      }
      // reset the direction changed boolean
      this.directionChangedThisTurn = false;
    }
  }

  // change the direction of the snake
  changeDirection(direction) {
    // only change direction IF:
    // 1. direction isn't the opposite that the snake is facing and
    // 2. direction hasn't already changed this turn
    if (!(this.direction.x + direction.x == 0 && this.direction.y + direction.y == 0) && !this.directionChangedThisTurn) {
      // if the direction isn't the same that it's already travelling, then you have used up your one allotted move for this turn
      // and the direction changed bool will be flipped
      if (!(this.direction.x == direction.x && this.direction.y == direction.y)) {
        this.directionChangedThisTurn = true;
      }
      this.direction = direction;
    }
  }

  // eat a food tile
  eat() {
    // add a new segment to the end of the snake
    this.tail.push(new Tile(this.lastLocation, tileSize, redColor));
    // increment score and fitness
    this.score++;
    this.fitness += 100;
  }

  // determines if the snake is going to collide with a wall or another part of the snake
  colliding() {
    let isCollision = false;
    // if snake's head is off the screen then collision
    if (this.location.x < 0 || this.location.x >= (width / tileSize) ||
      this.location.y < 0 || this.location.y >= (height / tileSize)) {
      isCollision = true;
    }
    // if head collides with any other part of the tail then collision
    for (let i = 0; i < this.tail.length; i++) {
      if (this.location.equals(this.tail[i].location)) {
        isCollision = true;
        break;
      }
    }
    return isCollision;
  }

  // </editor-fold> END PHYSICAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // <editor-fold> SENSOR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // populate the sensors with 7 data points that are input to the brain
  sense(food) {
    // get the distances from dying in cardinal directions (8 directions)
    // UP
    // DOWN
    // LEFT
    // RIGHT
    // UP-RIGHT
    // UP-LEFT
    // DOWN-RIGHT
    // DOWN-LEFT
    // get all of the inputs:
    // 1. distance to dying forward
    // 2. distance to dying left
    // 3. distance to dying right
    // 4. distance to dying forward left
    // 5. distance to dying forward right
    // 6. x to food
    this.sensors.push(food.location.x - this.location.x);
    // 7. y to food
    this.sensors.push(food.location.y - this.location.y);
    // forward sensor
    // check the distance to the wall
  }

  // get the nearest obstacle in 1/8 of the directions (omni-directional)
  getNearestObstacleInDirection(d) {

  }

  // </editor-fold> END SENSOR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // <editor-fold> UTILITY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // get the locations that the snake is occupying
  getFullLocation() {
    print([this.location].concat(this.tail.map(t => t.location)));
    return [this.location].concat(this.tail.map(t => t.location));
  }

  // respawn the snake with default settings
  respawn() {
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

  // draw the snake
  draw() {
    // if playing, draw the head and then draw each tile of the tail
    if (this.playing) {
      super.draw();
      for (let i = 0; i < this.tail.length; i++) {
        this.tail[i].draw();
      }
    }
  }

  // </editor-fold> END UTILITY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}

class Food extends Tile {
  constructor(snakeTiles) {
    let valid = false;
    let x, y, loc;
    // keep making food until it spawns in a valid location
    while (!valid) {
      // pick random x and y and make a location out of it
      x = Math.floor(Math.random() * width / tileSize);
      y = Math.floor(Math.random() * height / tileSize);
      loc = new Location(x, y);
      // default valid to true
      valid = true;
      // check all of the tiles of the snake to see if the food is under
      for (let i = 0; i < snakeTiles.length; i++) {
        if (loc.equals(snakeTiles[i]))
          valid = false;
      }
    }
    // create the food
    super(new Location(x, y), tileSize, greenColor);
  }
}
