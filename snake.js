(function () {

    function Snake(id, boardDimension, snakeDimension) {
        this._id = id;
        this._boardDimension = boardDimension
        this._snakeDimension = snakeDimension;
        this._direction = "right";
        this._length = 1;
        Snake.prototype.makeSnake.call(this);
    }

    Snake.prototype.makeSnake = function () {
        this.snake = document.createElement('div');
        this.snake.id = `snake_${this._id}`;
        this.snake.className = "snake";
        let snakeHead = document.createElement('div');
        snakeHead.id = `snakeHead_${this._id}`;
        snakeHead.style.width = `${this._snakeDimension}px`;
        snakeHead.style.height = `${this._snakeDimension}px`;
        this.snake.append(snakeHead);
        let { x, y } = this.randomizePosition();
        this.currPos = { x, y };
        this.snake.style.left = x;
        this.snake.style.top = y;
    };

    Snake.prototype.generateFood = function () {
        if (!this.food) {
            this.food = document.createElement('div');
            this.food.id = `food_${this._id}`;
            this.food.className = "food";
            this.food.style.width = `${this._snakeDimension}px`;
            this.food.style.height = `${this._snakeDimension}px`;
        }
        let { x, y } = this.randomizePosition();
        this.food.currPos = { x, y };
        this.food.style.left = x;
        this.food.style.top = y;
		/*let food_timer = setInterval(function(){
			if(this.food.style.visibility === "hidden") {
				this.food.style.visibility = "visible";
			}
			else
				this.food.style.visibility = "hidden";
			}
			,300); */
    };

    Snake.prototype.randomizePosition = function () {
        let randX = Math.floor(Math.random() * 50);
        let randY = Math.floor(Math.random() * 50);
        let x = randX * this._snakeDimension;
        let y = randY * this._snakeDimension;
        return { x, y };
    }

    Snake.prototype.move = function () {
        switch (this._direction) {
            case "left": this.moveLeft();
                break;
            case "right": this.moveRight();
                break;
            case "up": this.moveUp();
                break;
            case "down": this.moveDown();
                break;
        }
        this.snake.style.left = this.currPos.x;
        this.snake.style.top = this.currPos.y;
        this.checkIfFed();
    };

    Snake.prototype.changeDirection = function (event) {
        switch (event.code) {
            case "ArrowLeft": this.moveLeft();
                this._direction = "left";
                break;
            case "ArrowRight": this.moveRight();
                this._direction = "right";
                break;
            case "ArrowUp": this.moveUp();
                this._direction = "up";
                break;
            case "ArrowDown": this.moveDown();
                this._direction = "down";
                break;
        }
        this.snake.style.left = this.currPos.x;
        this.snake.style.top = this.currPos.y;
        this.checkIfFed();
    };

    Snake.prototype.moveLeft = function () {
        this.currPos.x = this.currPos.x - this._snakeDimension;
        this.currPos.y = this.currPos.y;
        this.calcIfDead();
    };

    Snake.prototype.moveRight = function () {
        this.currPos.x = this.currPos.x + this._snakeDimension;
        this.currPos.y = this.currPos.y;
        this.calcIfDead();
    };

    Snake.prototype.moveUp = function () {
        this.currPos.x = this.currPos.x;
        this.currPos.y = this.currPos.y - this._snakeDimension;
        this.calcIfDead();
    };

    Snake.prototype.moveDown = function () {
        this.currPos.x = this.currPos.x;
        this.currPos.y = this.currPos.y + this._snakeDimension;
        this.calcIfDead();
    };

    Snake.prototype.calcIfDead = function () {
        if (this.currPos.x < 0 || this.currPos.x === this._boardDimension || this.currPos.y < 0 || this.currPos.y === this._boardDimension) {
            clearInterval(this.timer_Id);
            alert("Game Over !!");
            location.reload();
        }
    };

    Snake.prototype.checkIfFed = function () {
        if (this.currPos.x === this.food.currPos.x && this.currPos.y === this.food.currPos.y) {
            this.feed();
            this._length++;
            this.generateFood();

        }
    }

    Snake.prototype.feed = function () {
        let toAdd = document.createElement('div');
        //toAdd.id = `toAdd_${this._id}_${this._length}`;
        toAdd.className = "toAdd";
        toAdd.style.width = `${this._snakeDimension}px`;
        toAdd.style.height = `${this._snakeDimension}px`;
        this.snake.append(toAdd);
    }

    window.Snake = Snake;

})();
