var gameboard = document.querySelector('#gameboard');

var startScreen = document.querySelector('#startScreen');
var userXbtn = document.querySelector('#x');
var userObtn = document.querySelector('#o');
var levels = document.querySelectorAll('.level');
var start = document.querySelector('#start');
var user;
var reset = document.querySelector('#reset');

var globals = {};

boardSetup();

// Startscreen
// userXbtn.addEventListener('click', function () {
// 	user = '<p>X</p>';
// 	startScreenHide();
// });

// userObtn.addEventListener('click', function () {
// 	user = '<p>O</p>';
// 	startScreenHide();
// });

levels.forEach(function (level) {
	level.addEventListener('click', function (e) {

		
		levels.forEach(function (level) {
			level.setAttribute('class', 'level not-selected');
		});
		e.target.setAttribute('class', 'level selected');
		//ai.level = e.target.getAttribute('id');
	});
});

start.addEventListener('click', function () {
	var selectedDifficulty = document.querySelector('.selected').getAttribute('id');
	console.log(selectedDifficulty);
	if (typeof selectedDifficulty !== 'undefined') {
		var aiPlayer = new AI(selectedDifficulty);
		console.log(aiPlayer);
		globals.game = new Game(aiPlayer);

		aiPlayer.plays(globals.game);

		globals.game.start();
		startScreenHide();
		clicked();
	}
});

function boardSetup() {

	while(gameboard.firstChild) {
		gameboard.removeChild(gameboard.firstChild);
	}
	for (var i = 0; i < 9; i++) {
		var square = document.createElement('div');
		square.setAttribute('class', 'square');
		gameboard.appendChild(square);
	}
	
}

function clicked() {
	document.querySelectorAll('.square').forEach(function (square, indx) {
		if(globals.game.status === 'running' && globals.game.currentState.turn === "X" && !square.hasAttribute('square occupied')) {

		square.addEventListener('click', function userClick() {
			// square.innerHTML = user;
			//e.target.setAttribute('class', 'square clicked');
			//updateBoard();
			//e.target.removeEventListener(e.type, arguments.callee);
			
			
			
			var next = new State(globals.game.currentState);
		
			next.board[indx] = 'X';
			ui.insertAt(indx, 'X');
			next.advanceTurn();
		
			globals.game.advanceTo(next);
			square.removeEventListener('click', userClick);
		});
	}
	});
}

function removeListener() {
	document.querySelectorAll('.square').forEach(function (square, indx) {
		console.log(arguments.callee);
		square.removeEventListener('click', clicked);
	});
}
function startScreenShow() {
	startScreen.style.display = 'block';
}

function startScreenHide() {
	startScreen.style.display = 'none';
}

// Reset
reset.addEventListener('click', function () {

	//boardErase();
	boardSetup();
	startScreenShow();
	//updateBoard();
	//clicked();
	//globals = [];
});



function boardErase() {
	var board = [];
	document.querySelectorAll('.square').forEach(function (square) {
		square.innerHTML = '';
		board.push(square.innerHTML);
		square.setAttribute('class', 'square');
		//square.removeEventListener('click', userClick);
	});
	return board;
}

function updateBoard() {
	var B = [];
	for (var i = 0; i < gameboard.childNodes.length; i++) {
		B[i] = gameboard.childNodes[i].innerText;
	}
	return B;
}


