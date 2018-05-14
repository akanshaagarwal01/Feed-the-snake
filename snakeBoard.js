(function () {

    function SnakeBoard(container, id, boardDimension) {
        this._container = container;
        this._id = id || 1;
        this._boardDimension = boardDimension || 350;
        SnakeBoard.prototype.initializeBoard.call(this);
    }

    SnakeBoard.prototype.initializeBoard = function () {
        this.makeBoard();
        this.makePlayBtn();
        this.snakeDimension = this._boardDimension / 50;
        this.snake = new Snake(id, this._boardDimension, this.snakeDimension);
        this.board.append(this.snake.snake);
        this.snake.generateFood();
        this.board.append(this.snake.food);
        this.playBtn.addEventListener("click", this.play.bind(this));
    };

    SnakeBoard.prototype.makePlayBtn = function () {
        this.playBtn = document.createElement('div');
        this.playBtn.id = `playBtn_${this._id}`;
        this.playBtn.className = "playBtn";
        this.board.append(this.playBtn);
    }

    SnakeBoard.prototype.makeBoard = function () {
        this.board = document.createElement('div');
        this.board.id = `board_${this._id}`;
        this.board.className = "board";
        this._container.append(this.board);
        this.board.style.width = `${this._boardDimension}px`;
        this.board.style.height = `${this._boardDimension}px`;
    };

    SnakeBoard.prototype.play = function () {
        this.board.style.opacity = 1;
        this.playBtn.style.display = "none";
        let timer_Id = setInterval(this.snake.move.bind(this.snake), 300);
        this.snake.timer_Id = timer_Id;
        document.addEventListener("keydown", this.snake.changeDirection.bind(this.snake));
    };

    window.SnakeBoard = SnakeBoard;
})();