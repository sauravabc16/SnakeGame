class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.context = this.canvas.getContext('2d');
    this.dx = 10;
    this.dy = 10;
    this.score = 0;
    this.food = this.initFood();
    this.scoreBox = document.getElementById("score");
    this.moving = false;
    this.motion = null;
    this.speed = 250;
    this.newDx = -1 * this.dx;
    this.newDy = 0 * this.dy;
    this.direction = "RIGHT";
    this.snake = this.snakeInit();
  }
  
  clearCanvas() {
    const c = this.canvas;
    this.context.clearRect(0,0, c.width, c.height);
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, c.width, c.height);  
    this.context.strokeRect(0, 0, c.width, c.height);
  }
  
  drawSnake() {
    this.snake.forEach((snakePart)=>{
      this.context.fillStyle = 'yellow';
      this.context.fillRect(snakePart.x, snakePart.y, 10, 10); 
      this.context.strokestyle = 'red';     
      this.context.strokeRect(snakePart.x, snakePart.y, 10, 10);
    })
  }
  
  initFood() {
    const setRandomPoint = () => Math.round((Math.random()*(300-10)+10)/10)*10;
    return {
      x: setRandomPoint(), 
      y: setRandomPoint()
    }
  }
  
  initGame() {
    this.clearCanvas();
    this.initFood();
    this.placeFood();
    this.drawSnake();
  }
 
  placeFood() {
    this.context.fillStyle = 'green';
    this.context.fillRect(this.food.x, this.food.y, 10, 10);
  }
  
  snakeInit() {
    return [
      {x: 150, y: 150}, 
      {x: 140, y: 150},
      {x: 130, y: 150}
    ];
  }
//when the user eats a slice of pizza, update the score  
  updateScore() {
    this.score += 1;
    this.scoreBox.innerText = this.score;
  }
  
}

let gameState = null;

function startGame(gs) {
  gameState = new Game();
  gameState.initGame();
}

startGame(gameState);

// Move the snake
function advanceSnake(sX,sY){    
    const head = {
        x: gameState.snake[0].x + sX, 
        y: gameState.snake[0].y + sY
    }
    
    // CONDITIONS FOR GAME OVER

    // x = 290
    // y = 290
    // x = 0
    // y = 0

    if(head.y === 0 || head.x === 0 || head.x === 290 || head.y ===290 ){  
        console.log("game over");  
        clearInterval(gameState.motion);
        gameState.snake.unshift(head);
        gameState.snake.pop(); 
      
        // SHOW GAME OVER MESSAGE
        gameState.clearCanvas();
        startGame();
        
    } else { 
        gameState.snake.unshift(head);
        gameState.snake.pop();    
    }   

    if(gameState.snake[0].x=== gameState.food.x
       && gameState.snake[0].y=== gameState.food.y) {
        console.log("WIN");
        gameState.snake.unshift(head);
        //update score
        gameState.food = gameState.initFood();
        gameState.updateScore();

        // INCREASE SPEED INCASE THE SNAKE GRABS FoOD
        clearInterval(gameState.motion);

        gameState.speed -= 19;
        gameState.motion = setInterval(startMoving, gameState.speed);
    }           
}

// Add event listener to arrow keys
document.addEventListener("keydown", direction)

// ON KEYDOWN Get new coordinates to call advance function
function direction(event) {
  
  const updateDirection = (nx, ny, direction) => {
    gameState.newDx = nx;
    gameState.newDy = ny;
    gameState.direction = direction;
  }

	if(event.keyCode === 40 && gameState.direction != "UP") {
    updateDirection(0, gameState.dy, "DOWN");
	} else if(event.keyCode === 39 && gameState.direction != "LEFT") {
    updateDirection(gameState.dx, 0, "RIGHT");
	} else if(event.keyCode === 38 && gameState.direction != "DOWN") {
    updateDirection(0, gameState.dy * -1, "UP");
	} else if(event.keyCode === 37 && gameState.direction != "RIGHT") {
    updateDirection(gameState.dx * -1 , 0, "LEFT");
  }	
  
  if(!gameState.moving) {//
    gameState.moving = !gameState.moving;
    gameState.motion = setInterval(startMoving, gameState.speed);
    console.log("moving", gameState.moving);
  } else {
    console.log("moving", gameState.moving);
  }  
  console.log(gameState);
}

function startMoving(){
  if(!!gameState) {
    const c = gameState.canvas;
    advanceSnake(gameState.newDx, gameState.newDy);
    gameState.context.clearRect(0,0, c.width, c.height);
    gameState.context.fillStyle = 'white';
    gameState.context.fillRect(0, 0, c.width, c.height);
    // draw the border
    gameState.context.strokeStyle = 'black';
    gameState.context.lineWidth = 5;
    gameState.context.strokeRect(0, 0, c.width, c.height);
    gameState.placeFood();
    gameState.drawSnake();
  }
}
