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
    "x": 0,
    "y": -1
  },
  'LEFT': {
    "x": -1,
    "y": 0
  },
  'RIGHT': {
    "x": 1,
    "y": 0
  },
  'DOWN': {
    "x": 0,
    "y": 1
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

  // returns the distance in grid units from this location to the function input
  distanceTo(otherLoc) {
      let xDist = otherLoc.x - this.x;
      let yDist = otherLoc.y - this.y;
      return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
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
