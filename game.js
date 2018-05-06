
// State Class

var State = function (old) {

	this.turn = '';

	// # of moves of ai
	this.oMovesCount = 0;

	// result of game running in this state
	this.result = 'still running';

	this.board = [];
    //console.log(old);
	//begin object construction
	//-- skipping old board copying over because it is already in updateBoard()
                            
	if (typeof old !== "undefined") {
		//updateBoard();
        //console.log(old);
        var len = old.board.length;
        this.board = new Array(len);
        
        for(var itr = 0; itr < len; itr++) {
            this.board[itr] = old.board[itr];
        }

		this.oMovesCount = old.oMovesCount;
		this.result = old.result;
		this.turn = old.turn;
	}

	//-- board replacement
// updateBoard() function is up above
	//@return updated board

	//advances turn ------------------------------> replace with variables later? like innerText or userX
	this.advanceTurn = function () {
		this.turn = this.turn === 'X' ? 'O' : 'X';
	};

	// get emptyCells ----------------------> double check to see if it will work with ''
	this.emptyCells = function () {
		var indxs = [];
		for (var i = 0; i < 9; i++) {
			if (this.board[i] === '') {
				indxs.push(i);
			}
		}
		return indxs;
	};

	//checks if terminal, returns boolean
	this.isTerminal = function () {
		var B = this.board;

		// check rows
		for (var i = 0; i <= 6; i = i + 3) {
			if (B[i] !== '' && B[i] === B[i + 1] && B[i + 1] === B[i + 2]) {
				this.result = B[i] + "-won";
				return true;
			}
		}
		// Check columns
		for (var i = 0; i < 2; i++) {
			if (B[i] !== '' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
				this.result = B[i] + "-won";
				return true;
			}
		}
		// Check Diagonals (0,4,8) or (2,4,6)
		for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
			if (B[i] !== '' && B[i] === B[i + j] && B[i + j] === B[i + 2 * j]) {
				this.result = B[i] + "-won";
				return true;
			}
		}
		// Draw
		if (B.filter(empty => empty == '').length == 0) {
			this.result = B[i] + "draw";
			return true;
		}
		else {
			return false;
		}
	};
};


// Contructs a game object to be played!
//@param autoPlayer [AIPlayer]: the ai to play

var Game = function (autoPlayer) {

	//initialize the ai player for this game
	this.ai = autoPlayer;

	//initialize the game current state to empty board config
	this.currentState = new State();

	// empty board (i'm using my functions!)
	this.currentState.board = updateBoard();

	// X plays first
	this.currentState.turn = 'X';

	//starts at the beginning... obviously?
	this.status = 'beginning';

	//
	this.advanceTo = function (_state) {
		this.currentState = _state;
		if (_state.isTerminal()) {
			this.status = 'ended';

			if (_state.result === 'X-won')
				ui.switchViewTo('won');
			else if (_state.result === 'O-won')
				ui.switchViewTo('lost');
			else
				ui.switchViewTo('draw');
		}
		else {
			// game is still running
			if (this.currentState.turn === 'X') {
				ui.switchViewTo('human');
			}
			else {
				ui.switchViewTo('robot');
				// notify ai of its turn
				this.ai.notify('O');
			}
		}
	};

	this.start = function () {
		if (this.status === 'beginning') {
			// invoke advanceTo with the initial state
			this.advanceTo(this.currentState);
			this.status = 'running';
		}
	};

};

Game.score = function (_state) {
	if (_state.result !== 'still running') {
		if (_state.result === 'X-won') {
			return 10 - _state.oMovesCount;
		}
		else if (_state.result === 'O-won') {
			return -10 + _state.oMovesCount;
		}
		else {
			// its a draw
			return 0;
		}
	}
};