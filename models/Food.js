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
