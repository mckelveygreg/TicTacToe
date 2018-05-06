
// ------------- AI Action Construct
//// ------------- AI Action Construct
// @param pos [num]: the cell position the ai would take its action in
var AIAction = function (pos) {

	this.movePosition = pos;

	// the minimax value of the state that the action leads to when applied
	this.minimaxVal = 0;

	//applies action to state to get the next state
	this.applyTo = function (state) {
		var next = new State(state);

		next.board[this.movePosition] = state.turn;

		if (state.turn === "O") {
			next.oMovesCount++;
		}
		next.advanceTurn();

		return next;
	};
};

// Pairwise sort
AIAction.ASCENDING = function (firstAction, secondAction) {
	if (firstAction.minimaxVal < secondAction.minimaxVal)
		return -1; // makes first go before second
	else if (firstAction.minimaxVal > secondAction.minimaxVal)
		return 1;
	else
		return 0;
};

AIAction.DESCENDING = function (firstAction, secondAction) {
	if (firstAction.minimaxVal > secondAction.minimaxVal)
		return -1; // makes first go before second
	else if (firstAction.minimaxVal < secondAction.minimaxVal)
		return 1;
	else
		return 0;
};



// --------------- AI Player Construct ---------------
// @param Level [string]: desired level of intel
var AI = function (level) {

	//
	var levelOFIntel = level;

	var game = {};



	// Minimax function
	function minimaxValue(state) {
		// recursive base case
		if (state.isTerminal()) {
			return Game.score(state);
		}
		else {
			var stateScore;

			if (state.turn === 'X')
				// X-maximizes initializes score to value smaller than any possible score
				stateScore = -1000;
			else
				// O-minimizes
				stateScore = 1000;

			var availablePositions = state.emptyCells();

			//enumerates next available states using info from available positions
			var availableNextStates = availablePositions.map(function (pos) {
				var action = new AIAction(pos);
				var nextState = action.applyTo(state);

				return nextState;
			});

			availableNextStates.forEach(function (nextState) {
				//recursive call
				var nextScore = minimaxValue(nextState);

				if (state.turn === 'X') {
					// X wants to maximize -- update if nextScore is larger
					if (nextScore > stateScore)
						stateScore = nextScore;
				}
				else {
					//O wants to minimize -- update if next is smaller
					if (nextScore < stateScore)
						stateScore = nextScore;
				}
			});

			//backup the minimax value
			return stateScore;
		}
	}


	// choose optimal minimax decision
	// @param turn [String]: the player to play, either X or O

	function takeAMasterMove(turn) {
		var available = game.currentState.emptyCells();

		// Enumerate and calculate the score for each available actions to the ai player
		var availableActions = available.map(function (pos) {
			var action = new AIAction(pos); // create the action object

			// get the next state by appling the action
			var next = action.applyTo(game.currentState);

			// calculate and set the actions minimax value
			action.minimaxVal = minimaxValue(next);
			return action;
		});

		// sort the enumerated actions list by score
		if (turn === 'X')
			// X maxes --> largest minimax first
			availableActions.sort(AIAction.DESCENDING);
		else
			// O minimizes --> smallest minimax first
			availableActions.sort(AIAction.ASCENDING);

		// Take the first action
		var chosenAction = availableActions[0];
		var next = chosenAction.applyTo(game.currentState);

		// adds X or an O at the chosen position
		ui.insertAt(chosenAction.movePosition, turn);

		// take game to next state
		game.advanceTo(next);
	}

	// Novice Move
	// same as optimal, but with a 40% chance of just doing a rando move
	// @param turn [String]: the player to play, either X or O

	function takeANoviceMove(turn) {
		var available = game.currentState.emptyCells();

		// Enumerate and calculate the score for each available actions to the ai player
		var availableActions = available.map(function (pos) {
			var action = new AIAction(pos); // create the action object

			// get the next state by appling the action
			var next = action.applyTo(game.currentState);

			// calculate and set the actions minimax value
			action.minimaxVal = minimaxValue(next);
			return action;
		});

		// sort the enumerated actions list by score
		if (turn === 'X')
			// X maxes --> largest minimax first
			availableActions.sort(AIAction.DESCENDING);
		else
			// O minimizes --> smallest minimax first
			availableActions.sort(AIAction.ASCENDING);

		//---- novice part
		// 40% chance of a good move
		var chosenAction;
		if (Math.random() * 100 <= 40) {
			chosenAction = availableActions[0];
		}
		else {
			if (availableActions.length >= 2) {
				// if there are 2 or more chose the first sub optimal
				chosenAction = availableActions[1];
			}
			else {
				// choose the only available action
				chosenAction = availableAction[0];
			}
		}

		var next = chosenAction.applyTo(game.currentState);

		// adds X or an O at the chosen position
		ui.insertAt(chosenAction.movePosition, turn);

		// take game to next state
		game.advanceTo(next);
	}


	// blindmove, completely random
	// @param turn [String]: the player to play, either X or O
	function takeABlindMove(turn) {
		var available = game.currentState.emptyCells();
		var randomCell = available[Math.floor(Math.random() * available.length)];
		var action = new AIAction(randomCell);

		var next = action.applyTo(game.currentState);

		ui.insertAt(randomCell, turn);

		game.advanceTo(next);
	}


	//public method to specify the game the ai player will play
	this.plays = function (_game) {
		game = _game;
	};

	//notify the ai to take it's turn
	this.notify = function (turn) {
		switch (levelOFIntel) {
			case 'blind': takeABlindMove(turn); break;
			case 'novice': takeANoviceMove(turn); break;
			case 'master': takeAMasterMove(turn); break;
		}
	};
};

