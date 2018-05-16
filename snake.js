(function () {

    function Snake(id, board, boardDimension, snakeDimension) {
        this._id = id;
		this._board = board;
        this._boardDimension = boardDimension
        this._snakeDimension = snakeDimension;
        Snake.prototype.makeSnake.call(this);
    }

    Snake.prototype.makeSnake = function () {
        let snakeHead = document.createElement('div');
        snakeHead.id = `snakeHead_${this._id}`;
		snakeHead.className = `snakeHead`;
        snakeHead.style.width = `${this._snakeDimension}px`;
        snakeHead.style.height = `${this._snakeDimension}px`;
        let { x, y } = this.randomizePosition();
		this.snakeObj = {
			snakeLength : 0,
			followers : [],
			turnPoints : []
		}
		this.snakeHeadObj = {
			node : snakeHead,
			direction : "right"
		}
        this._board.append(this.snakeHeadObj.node);
		this.snakeObj.followers.push(this.snakeHeadObj);
		this.snakeObj.snakeLength++;
        this.snakeHeadObj.node.style.left = x;
        this.snakeHeadObj.node.style.top = y;
		this.snakeTailObj = this.snakeHeadObj;
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
        function blinkFood() {
            if(this.food.style.visibility === "hidden") {
				this.food.style.visibility = "visible";
			}
			else
				this.food.style.visibility = "hidden";
        }
        let food_timer = setInterval(blinkFood.bind(this),500); 
    }
		

    Snake.prototype.randomizePosition = function () {
        let randX = Math.floor(Math.random() * 40);
        let randY = Math.floor(Math.random() * 40);
        let x = randX * this._snakeDimension;
        let y = randY * this._snakeDimension;
        return { x, y };
    }

    Snake.prototype.move = function () {
        for(let follower of this.snakeObj.followers) {
			followerX = parseInt(getComputedStyle(follower.node).left);
			followerY = parseInt(getComputedStyle(follower.node).top);
			let tp = this.snakeObj.turnPoints.find(item => parseInt(item.x) === followerX && parseInt(item.y) === followerY);
			if(tp) {
				this.makeTurn(follower,tp);
				if(follower === this.snakeTailObj) {
					let index = this.snakeObj.turnPoints.indexOf(tp);
					this.snakeObj.turnPoints.splice(index,1);
				}
			}
			else {
				let pos;
				switch(follower.direction) {
					case "left" : pos = parseInt(follower.node.style.left) - this._snakeDimension;
									follower.node.style.left = pos;
									break;
					case "right" : pos = parseInt(follower.node.style.left) + this._snakeDimension;
									follower.node.style.left = pos;
									break;
					case "up" : pos = parseInt(follower.node.style.top) - this._snakeDimension;
									follower.node.style.top = pos;
									break;
					case "down" : pos = parseInt(follower.node.style.top) + this._snakeDimension;
									follower.node.style.top = pos;
									break;
				}
			}
		}
		this.calcIfDead();
        this.checkIfFed();
    };

	
	Snake.prototype.makeTurn = function(follower,tp) {
		if(tp.dir === "left") {
			follower.node.style.left = parseInt(follower.node.style.left) - this._snakeDimension;
		}
		else if(tp.dir === "right") {
			follower.node.style.left = parseInt(follower.node.style.left) + this._snakeDimension;
		}
		else if(tp.dir === "up") {
			follower.node.style.top = parseInt(follower.node.style.top) - this._snakeDimension;
		}
		else if(tp.dir === "down") {
			follower.node.style.top = parseInt(follower.node.style.top) + this._snakeDimension;
		}
		follower.direction = tp.dir;
	};
	
    Snake.prototype.changeDirection = function(event) {
        if(event.code === "ArrowLeft" || event.code === "ArrowRight" 
        || event.code === "ArrowUp" || event.code === "ArrowDown") {
            let dir = this.snakeHeadObj.direction;
		    if((dir === "left" && event.code !== "ArrowRight" && event.code !== "ArrowLeft")
			    ||(dir === "right" && event.code !== "ArrowLeft" && event.code !== "ArrowRight")||
		        (dir === "up" && event.code !== "ArrowDown" && event.code !== "ArrowUp")||
		        (dir === "down" && event.code !== "ArrowUp" && event.code !== "ArrowDown")) {
			    let tp = {
				    x :  this.snakeHeadObj.node.style.left,
				    y :  this.snakeHeadObj.node.style.top,
			    };
			    switch (event.code) {
				    case "ArrowLeft": tp.dir = "left";
							break;
			    	case "ArrowRight":  tp.dir = "right";
							break;
				    case "ArrowUp":  tp.dir = "up";
							break;
			    	case "ArrowDown":  tp.dir = "down";
							break;
			    }
			    this.snakeObj.turnPoints.push(tp);
	    	}
        }
	};
	
	
    Snake.prototype.calcIfDead = function () {
		let headLeft = parseInt(this.snakeHeadObj.node.style.left);
		let headTop = parseInt(this.snakeHeadObj.node.style.top);
		function borderHit() {
			if (headLeft < 0 || headLeft === this._boardDimension || headTop < 0 || headTop === this._boardDimension)
				return true;
			return false;
		}
		let checkBorderHit = borderHit.call(this);
		function selfDestroy() {
			if(this.snakeObj.snakeLength > 1) {
				for(let i = 0; i < this.snakeObj.snakeLength; i++) {
					for(let j = i; j < this.snakeObj.snakeLength; j++) {
						if(i!==j && this.snakeObj.followers[i].node.style.left === this.snakeObj.followers[j].node.style.left 
							&& this.snakeObj.followers[i].node.style.top === this.snakeObj.followers[j].node.style.top) {
							return true;	
						}
					}
				}
			}
			return false;
		}
		let checkSelfDestroy = selfDestroy.call(this);
        if (checkBorderHit || checkSelfDestroy) {
            clearInterval(this.timer_Id);
            alert("Game Over !!");
            location.reload();
        }
    }; 

    Snake.prototype.checkIfFed = function () {
        if (parseInt(this.snakeHeadObj.node.style.left) === parseInt(this.food.currPos.x) 
		&& parseInt(this.snakeHeadObj.node.style.top) === parseInt(this.food.currPos.y)) {
			this.feed();
            this.generateFood();
        }
    } 

    Snake.prototype.feed = function () {
        let toAdd = document.createElement('div');
        toAdd.className = "toAdd";
        toAdd.style.width = `${this._snakeDimension}px`;
        toAdd.style.height = `${this._snakeDimension}px`;
		switch(this.snakeTailObj.direction) {
			case "left" : toAdd.style.left = `${parseInt(this.snakeTailObj.node.style.left) + this._snakeDimension}px`;
						toAdd.style.top = this.snakeTailObj.node.style.top;
						break;
			case "right" : toAdd.style.left = `${parseInt(this.snakeTailObj.node.style.left) - this._snakeDimension}px`;
						toAdd.style.top = this.snakeTailObj.node.style.top;
						break;
			case "up" : toAdd.style.left = this.snakeTailObj.node.style.left;
						toAdd.style.top = `${parseInt(this.snakeTailObj.node.style.top) + this._snakeDimension}px`;
						break;
			case "down" :  toAdd.style.left = this.snakeTailObj.node.style.left;
						toAdd.style.top = `${parseInt(this.snakeTailObj.node.style.top) - this._snakeDimension}px`;
						break;
		}
		let toAddObj = {
			node : toAdd,
			direction : this.snakeTailObj.direction
		}
        this._board.append(toAddObj.node);
		this.snakeTailObj = toAddObj;
		this.snakeObj.followers.push(toAddObj);
		this.snakeObj.snakeLength++;
    } 

    window.Snake = Snake;

})();