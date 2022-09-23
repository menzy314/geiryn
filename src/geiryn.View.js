/**
 * Game view
 *
 * @constructor
 * @param {geiryn.Model} model The model
 */
geiryn.View = function ( model ) {
	this.model = model;
	window.addEventListener( 'keydown', this.onKeyDown.bind( this ) );
};

geiryn.View.prototype.onKeyDown = function ( ev ) {
	if ( ev.key.match( /^[A-Za-z]$/ ) ) {
		this.model.nextGuess.push( ev.key );
		this.draw();
	} else if ( ev.keyCode === 8 ) {
		// Backspace
		this.model.nextGuess.pop();
		this.draw();
	} else if ( ev.keyCode === 13 ) {
		// Enter
		var currentGuess = this.model.nextGuess.join( '' );
		this.model.guess( currentGuess );
		this.model.nextGuess.splice( 0 );
		this.draw();
	}
};

/**
 * Draw the curent model state
 *
 * @method
 */
geiryn.View.prototype.draw = function () {
	var game = document.getElementById( 'game' );
	game.innerHTML = '';
	// Create board
	var board = document.createElement( 'div' );
	board.classList.add( 'board' );
	for ( var i = 0; i < this.model.guesses.length; i++ ) {
		this.createBoardRow( board, this.model.guesses[ i ] );
	}
	// Create keyboard
	var keyboard = document.createElement( 'div' );
	keyboard.classList.add( 'keyboard' );

	this.createKeyboardRow( keyboard, 'qwertyuiop' );
	this.createKeyboardRow( keyboard, 'asdfghjkl' );
	this.createKeyboardRow( keyboard, 'zxcvbnm' );
	this.createNextGuessRow( board, this.model.nextGuess );

	// Attach to the top-level game div
	game.appendChild( board );
	game.appendChild( keyboard );
};

geiryn.View.prototype.createBoardRow = function ( board, rowData ) {
	var boardRow = document.createElement( 'div' );
	boardRow.classList.add( 'board-row' );
	board.appendChild( boardRow );
	for ( var i = 0; i < rowData.length; i++ ) {
		var item = rowData[ i ];
		this.createBoardLetter( boardRow, item.letter, item.score );
	}
};

geiryn.View.prototype.createBoardLetter = function ( row, letter, score ) {
	var boardLetter = document.createElement( 'div' );
	boardLetter.classList.add( 'board-letter' );
	if ( score !== undefined ) {
		boardLetter.classList.add( 'board-letter-' + score );
	}
	row.appendChild( boardLetter );
	boardLetter.innerText = letter;
};

geiryn.View.prototype.createNextGuessRow = function ( board, letters ) {
	var nextGuessRow = document.createElement( 'div' );
	nextGuessRow.classList.add( 'next-guess-row' );
	board.appendChild( nextGuessRow );
	for ( var i = 0; i < 5; i++ ) {
		var item = letters[ i ];
		if ( item === undefined ) {
			item = '\u00A0';
		}
		this.createBoardLetter( nextGuessRow, item, undefined );
	}
};

geiryn.View.prototype.createKeyboardRow = function ( keyboard, rowLetters ) {
	var keyboardRow = document.createElement( 'div' );
	keyboardRow.classList.add( 'keyboard-row' );
	keyboard.appendChild( keyboardRow );
	for ( var i = 0; i < rowLetters.length; i++ ) {
		var letter = rowLetters[ i ];
		this.createKeyboardKey( keyboardRow, letter );
	}
};

geiryn.View.prototype.createKeyboardKey = function ( keyboardRow, letter ) {
	var keyboardKey = document.createElement( 'div' );
	var score = this.model.keyStates[ letter ];
	keyboardKey.classList.add( 'keyboard-key' );
	if ( score !== undefined ) {
		keyboardKey.classList.add( 'keyboard-key-' + score );
	}
	keyboardRow.appendChild( keyboardKey );
	keyboardKey.innerText = letter;

};
