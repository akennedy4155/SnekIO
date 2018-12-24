// <editor-fold> UTILITIES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

const Direction = Object.freeze({
  'UP': {
    "x": 0,
    "y": -1,
    'l': 'LEFT',
    'r': 'RIGHT'
  },
  'LEFT': {
    "x": -1,
    "y": 0,
    'l' : 'DOWN',
    'r' : 'UP'
  },
  'RIGHT': {
    "x": 1,
    "y": 0,
    'l' : 'UP',
    'r' : 'DOWN'
  },
  'DOWN': {
    "x": 0,
    "y": 1,
    'l' : 'RIGHT',
    'r' : 'LEFT'
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

  // add either another location or a direction to the location
  add(otherLoc) {
    return new Location(this.x + otherLoc.x, this.y + otherLoc.y);
  }

  // returns the distance in grid units from this location to the function input
  distanceTo(otherLoc) {
      let xDist = otherLoc.x - this.x;
      let yDist = otherLoc.y - this.y;
      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  // determines if the location is intersecting a wall or another part of the snake
  colliding(snake, width, height) {
    let isCollision = false;
    // if snake's head is off the screen then collision
    if (this.x < 0 || this.x >= (width / tileSize) ||
       this.y < 0 || this.y >= (height / tileSize)) {
      isCollision = true;
    }
    // if head collides with any other part of the tail then collision
    for (let i = 0; i < snake.tail.length; i++) {
      if (this.equals(snake.tail[i].location)) {
        isCollision = true;
        break;
      }
    }
    return isCollision;
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
