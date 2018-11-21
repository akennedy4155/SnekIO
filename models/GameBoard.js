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
    // move snake
    this.snake.move(this);
    // snake eats
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
