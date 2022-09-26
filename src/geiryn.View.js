/**
 * Game view
 *
 * @constructor
 * @param {geiryn.Model} model The model
 */
geiryn.View = function ( model ) {
	this.model = model;

	this.game = document.getElementById( 'game' );

	this.board = document.createElement( 'div' );
	this.board.classList.add( 'board' );

	this.keyboard = document.createElement( 'div' );
	this.keyboard.classList.add( 'keyboard' );

	this.game.appendChild( this.board );
	this.game.appendChild( this.keyboard );

	window.addEventListener( 'keydown', this.onKeyDown.bind( this ) );
	this.keyboard.addEventListener( 'click', this.onClick.bind( this ) );
};

geiryn.View.prototype.onKeyDown = function ( ev ) {
	if ( ev.key.match( /^[A-Za-z]$/ ) ) {
		this.model.pushLetter( ev.key );
		this.draw();
	} else if ( ev.keyCode === 8 ) {
		// Backspace
		this.model.popLetter();
		this.draw();
	} else if ( ev.keyCode === 13 ) {
		// Enter
		this.model.submitGuess();
		this.draw();
	}
};

geiryn.View.prototype.onClick = function ( ev ) {
	if ( ev.target.classList.contains( 'keyboard-key' ) ) {
		var letter = ev.target.innerText;
		this.model.pushLetter( letter );
		this.draw();
	}
};

/**
 * Draw the curent model state
 *
 * @method
 */
geiryn.View.prototype.draw = function () {
	this.board.innerHTML = '';
	this.keyboard.innerHTML = '';
	for ( var i = 0; i < this.model.guesses.length; i++ ) {
		this.createBoardRow( this.board, this.model.guesses[ i ] );
	}

	this.createKeyboardRow( this.keyboard, 'qwertyuiop' );
	this.createKeyboardRow( this.keyboard, 'asdfghjkl' );
	this.createKeyboardRow( this.keyboard, 'zxcvbnm' );
	this.createNextGuessRow( this.board, this.model.nextGuess );

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
