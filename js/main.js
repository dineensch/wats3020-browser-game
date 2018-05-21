/* WATS 3020 Browser Game project */
/* tic tac toe game for two players. */

class Player {
    constructor(token){
        this.token = token;
    }
}

// Tic Tac Toe Game Class
class TicTacToe {
    constructor(){
        // The "token" can be set to a Glyphicon icon name
        this.player1 = new Player('remove');
        this.player2 = new Player('ok');

        // Track game progress.
        this.currentPlayer = null;
        this.gameStatus = null;
        this.winner = null;
        this.moveCount = 0;

        // DOM elements / Class properties
        this.startPrompt = document.querySelector('#start-prompt');
        this.movePrompt = document.querySelector('#move-prompt');
        this.currentPlayerToken = document.querySelector('#player-token');
        this.gameboard = document.querySelector('#gameboard');
        this.winScreen = document.querySelector('#win-screen');
        this.winnerToken = document.querySelector('#winner-token');
        this.drawScreen = document.querySelector('#draw-screen');

        // Starting state of the game board.
        this.gameState = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        // Array of Win States
        this.winStates = [
          [[0,0],[0,1],[0,2]],
          [[1,0],[1,1],[1,2]],
          [[2,0],[2,1],[2,2]],
          [[0,0],[1,0],[2,0]],
          [[0,1],[1,1],[2,1]],
          [[0,2],[1,2],[2,2]],
          [[0,0],[1,1],[2,2]],
          [[0,2],[1,1],[2,0]]
        ];
    }

    // Checking for winner
    checkForWinner(){
        console.log('Checking for winner');
        for (let condition of this.winStates){
            let winningCondition = true;
            for (let position of condition){
                if (this.gameState[position[0]][position[1]] != this.currentPlayer.token) {
                    winningCondition = false;
                }
            }
            if (winningCondition) {
                console.log('We have a winner!');
                console.log(`Condition is: ${condition}`);
                this.gameStatus = 'won';
                this.winner = this.currentPlayer;

                // Dispatches signal "win".
                let winEvent = new Event('win');
                document.dispatchEvent(winEvent);
                return true;
            }
        }

        this.moveCount++;
        console.log(`Reviewed move ${this.moveCount}.`)
        if (this.moveCount >= 9) {
            console.log(`This game is a draw at ${this.moveCount} moves.`);
            this.gameStatus = 'draw';

            // Dispatches the signal "draw".
            let drawEvent = new Event('draw');
            document.dispatchEvent(drawEvent);
        }
    }

    recordMove(event){
        console.log('Recording move.');
        // This method handles recording a move in the `this.gameState` property.
        // To record a move, we must accmoplish the following:

        let tileX = event.target.dataset.x;
        let tileY = event.target.dataset.y
        /* here you can put a conditional to return 'false' if this tile is already taken' So, this value would be 'null' until we set it to a value. so if it is not 'null' it has alrady been placed */
        this.gameState[tileX][tileY] = this.currentPlayer.token;
        
         
        // Display player's token class
        event.target.setAttribute('class', `tile played glyphicon glyphicon-${this.currentPlayer.token}`);
    }
    switchPlayer(){
        console.log('Switching Player');
        // This method handles switching between players after each move.
        if (this.currentPlayer === this.player1) {
           this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        } 

        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }
    setUpTileListeners(){
        console.log('Setting up Tile Listeners')
        // Set up event listeners for tiles
        let tileElements = document.querySelectorAll('.tile');

        for (let tile of tileElements){
            tile.addEventListener('click', handleMove);
        }
    }
    showWinScreen(){
        // Displays end game screen for a Win.
        this.winScreen.setAttribute('class', 'show');
        this.winnerToken.setAttribute('class', `glyphicon ${this.winner.token}`);
    }
    showDrawScreen(){
        // Displays end game screen for a Draw
        this.drawScreen.setAttribute('class', 'show');
    }

    //Clear content from gameboard
    setUpBoard(){
        console.log('Setting up gameboard');
        this.gameboard.innerHTML = '';

        for (let i=0; i<3; i++){
            let newRow = document.createElement('div');
            newRow.setAttribute('class', 'row');
          
            for (let j=0; j<3; j++) {
            
                let newCol = document.createElement('div');
                newCol.setAttribute('class', 'col-xs-3');
                
                let newTile = document.createElement('span');
                newTile.setAttribute('class', 'tile glyphicon glyphicon-question-sign')
            
                newTile.dataset.x = i;
                newTile.dataset.y = j; 

                newCol.appendChild(newTile);
                newRow.appendChild(newCol);

            } // Second `for` loop ends here.

            this.gameboard.appendChild(newRow);

        } // First `for` loop ends here

        this.setUpTileListeners();
    }

    initializeMovePrompt(){
        // Prompts player to make move
        console.log('Initializing Move Prompt.')
        this.startPrompt.setAttribute('class', 'hidden');

        this.movePrompt.setAttribute('class', '');
        this.currentPlayer = this.player1;
        this.currentPlayerToken.setAttribute('class', `glyphicon glyphicon-${this.currentPlayer.token}`);
    }

    start(){
        // Create new game
        console.log('Starting game.');
        this.setUpBoard();
        this.initializeMovePrompt();

    }
} // End of the Tic Tac Toe Class definition.


let game;

document.addEventListener('DOMContentLoaded', function(event){ 

// Start Button
    let startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', function(event) {
        game = new TicTacToe();
        game.start();       
    }); // NOTE: End of the `startButton` event listener here.  
    
}); // NOTE: End DOMContentLoaded Event Listener



// 'win' event signal
document.addEventListener('win', function(event){
    console.log('Detected win event.');
    game.showWinScreen();
}); //NOTE: End of the "win" event listener.


// 'draw' event signal
document.addEventListener('draw', function(event){
    console.log('Detected draw event.');
    game.showDrawScreen();
}); // NOTE: End of the "draw" event listener.

// External function for event listeners
function handleMove(event){
    console.log('Handling Player move');
    // Record the move for the current player.
    game.recordMove(event);

    // Check to see if the last move was a winning move.
    game.checkForWinner();

    // Rotate players.
    game.switchPlayer();
}
