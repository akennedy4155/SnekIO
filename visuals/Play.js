// <editor-fold> MAIN p5 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
  } else if (keyCode == 90) {
    g.playTurn();
  }
}

// </editor-fold> END MAIN p5~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
