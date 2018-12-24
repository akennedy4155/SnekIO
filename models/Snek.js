//TODO ADD A Score thing in the html
class Snake extends Tile {

    constructor(location) {
        super(location, tileSize, blueColor);
        // random brain
        this.brain = new Brain(7, 6, 3);
        this.directionChangedThisTurn = false;
        // initialize snake with fresh settings
        this.respawn();
    }

    makeTail(lenTail) {
        let newTail  = [];
        for(let i = 0; i < lenTail; i++){
            newTail.push(new Tile(new Location(-1 - i, 0), tileSize, redColor));
        }
        return newTail;
    }

    // <editor-fold> PHYSICAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // move the snake on the gameboard, once per frame
    move(food) {
        // get sensor values of snake
        this.sensors = this.sense(food, true);
        this.predict();
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
            // move the first piece of the tail to the last location of the head
            this.tail[0].location = headPastLocation;
            // increment fitness
            this.fitness++;
            // check for collisions
            // if colliding, reset the snake and print the score
            if (this.location.colliding(this, width, height)) {
                console.log("score:", this.score, "fitness:", this.fitness);
                this.respawn(food);
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



    // </editor-fold> END PHYSICAL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // <editor-fold> SENSOR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // populate the sensors with 7 data points that are input to the brain
    sense(food, verbose = false) {
        let sensorData = {};
        const maxStraightDist = width / tileSize;
        const maxDiagDist = Math.sqrt(Math.pow((width / tileSize),2) + Math.pow((height / tileSize), 2));
        // get the distances from dying in cardinal directions (8 directions)
        // get all of the inputs:
        // 1. distance to dying forward - normalized
        let realFDist = this.getNearestObstacleInDirection(this.direction);
        sensorData['f'] = map(realFDist, 1, maxStraightDist, 0, 1);
        // 2. distance to dying left
        let realLDist = this.getNearestObstacleInDirection(Direction[this.direction['l']]);
        sensorData['l'] = map(realLDist, 1, maxStraightDist, 0, 1);
        // 3. distance to dying right
        let realRDist = this.getNearestObstacleInDirection(Direction[this.direction['r']]);
        sensorData['r'] = map(realRDist, 1, maxStraightDist, 0, 1);
        // 4. distance to dying forward left
        // make F-left object

        let realFLDist = this.getNearestObstacleInDirection(this.addDirection(Direction[this.direction['l']]));
        sensorData['fl'] = map(realFLDist, 1, maxDiagDist, 0, 1);
        // 5. distance to dying forward right
        let realFRDist = this.getNearestObstacleInDirection(this.addDirection(Direction[this.direction['r']]));
        sensorData['fr'] = map(realFRDist, 1, maxDiagDist, 0, 1);
        // 6. x to food
        sensorData['foodX'] = map(food.location.x, 0, width / tileSize - 1, 0, 1);
        // // 7. y to food
        sensorData['foodY'] = map(food.location.y, 0, width / tileSize - 1, 0, 1);
        if (verbose) {
            console.log(sensorData);
        }
        return sensorData;
    }

    predict(){
        let prediction = this.brain.predict(Object.values(this.sensors));
        let chosenDirection = prediction.indexOf(Math.max(...prediction));
        switch (chosenDirection) {
            case 0:
                this.changeDirection(Direction[this.direction['l']]);
                break;
            case 1:
                break;
            case 2:
                this.changeDirection(Direction[this.direction['r']]);
                break;
            default:
                throw new Error("Error in chosen direction switch statement...");
        }
        console.log(prediction);
    }

    // get the nearest obstacle in 1/8 of the directions (omni-directional)
    getNearestObstacleInDirection(d) {
        // current tile that you're checking for obstacles == death
        let checkLocation = this.location;
        // distance to the current check tile
        let dist = 0;
        while (!checkLocation.colliding(this, width, height)) {
            checkLocation = checkLocation.add(d);
            dist = this.location.distanceTo(checkLocation);
        }
        return dist;
    }

    // </editor-fold> END SENSOR ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // <editor-fold> UTILITY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // get the locations that the snake is occupying
    getFullLocation() {
        return [this.location].concat(this.tail.map(t => t.location));
    }

    // respawn the snake with default settings
    respawn() {
        this.location = new Location(0, 0);
        this.direction = Direction.RIGHT;
        this.tail = this.makeTail(4);
        this.lastLocation = this.tail[this.tail.length - 1].location;
        this.score = 0;
        this.fitness = 0;
        this.playing = true;
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

    // add directions
    addDirection(d) {
        return {
            'x': this.direction.x + d.x,
            'y': this.direction.y + d.y
        }
    }

    // </editor-fold> END UTILITY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}
