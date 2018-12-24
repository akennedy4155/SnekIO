***
# SnekIO - A beginner's project for learning neural networks that evolve with genetic algorithms to control a basic snake game.

## Programmer's Logs
### 12/19/18
- made blue color and changed the head of the snake to blue
- added distanceTo(otherLoc) to the location utility
- refactored snake.colliding to take a location and determine if that location is intersecting a wall or a snake tile
    - this could be moved to the location utility and passed the snake, width, and height of the board as arguments
- added support for sensing in the forward direction and the sensor can be verbose and log the data to the console
- WORKING ON NOW: getting the inputs to the neural network
- QUESTIONS:
    - Do the inputs need to be normalized?
    - How to choose the direction based on the output classification
### 12/20/18
- sensors get all of the normalized inputs
- makes a prediction based on these inputs
### 12/24/18
- change snake order to sense -> predict -> move
- ready to start working on the collection of the snake population
- replay system, player controlled for testing
***
