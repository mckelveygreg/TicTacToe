// ui object to hold all functions
var ui = {};

ui.initialControlsVisible = true;

// skipping robot animation thing

// current view?
ui.currentView = "none";

// ui switcher depending on who's turn it is
// @param turn [String]: the player to switch the view to
ui.switchViewTo = function(turn) {

    // not sure what to do here
    console.log("don't know how to switch views");
    function _switch(_turn) {
        ui.currentView = '#' + _turn;
        document.querySelector(".ingame" + ui.currentView).style.display = 'block';
    }
    if(ui.initialControlsVisible) {
        ui.initialControlsVisible = false;

        _switch(turn);
    } else {
        document.querySelector(".ingame" + ui.currentView).style.display = 'none';
        _switch(turn);
    }

};

// places X or O in the correct spots! 
// @param indx [Num]: index in board array to place symbol?
///@param symbol [String]: X or O
ui.insertAt = function(indx, symbol) {
    var board = document.querySelectorAll('.square');
    var targetCell = board[indx];
    //console.log(targetCell.getAttribute('class'));
    if(targetCell.getAttribute('class') !== 'square occupied') {
        targetCell.innerHTML = symbol;
			
			//updateBoard();
			targetCell.setAttribute('class', 'square occupied');
			//board[indx].removeEventListener('click', userClick());
    }
};
