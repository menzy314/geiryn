/**
 * Game view
 *
 * @constructor
 * @param {geiryn.Model} model The model
 */
geiryn.View = function ( model ) {
	this.model = model;

	this.game = document.createElement( 'div' );
	this.game.classList.add( 'geiryn-game' );

	this.board = document.createElement( 'div' );
	this.board.classList.add( 'geiryn-board' );

	this.keyboard = document.createElement( 'div' );
	this.keyboard.classList.add( 'geiryn-keyboard' );

	this.toast = document.createElement( 'div' );
	this.toast.classList.add( 'geiryn-toast' );

	this.game.appendChild( this.board );
	this.game.appendChild( this.keyboard );
	this.game.appendChild( this.toast );

	window.addEventListener( 'keydown', this.onKeyDown.bind( this ) );
	this.keyboard.addEventListener( 'click', this.onClick.bind( this ) );
};

geiryn.View.prototype.onKeyDown = function ( ev ) {
	var noMods = !ev.shiftKey && !ev.ctrlKey && !ev.metaKey;
	if ( this.model.hasWon ) {
		return;
	}
	if ( noMods && ev.key.match( /^[A-Za-z]$/ ) ) {
		this.model.pushLetter( ev.key );
		this.draw();
		ev.preventDefault();
	} else if ( noMods && ev.keyCode === 8 ) {
		// Backspace
		this.model.popLetter();
		this.draw();
		ev.preventDefault();
	} else if ( noMods && ev.keyCode === 13 ) {
		// Enter
		this.submitGuess();
		this.draw();
		ev.preventDefault();
	} else if ( noMods && ev.keyCode === 32 ) {
		// Space
		this.model.maybeDigraph = false;
		this.draw();
		ev.preventDefault();
	}
};

geiryn.View.prototype.onClick = function ( ev ) {
	var keyDiv = ev.target.closest( '.geiryn-keyboard-key' );
	if ( this.model.hasWon || !keyDiv ) {
		return;
	}
	if ( keyDiv.classList.contains( 'geiryn-keyboard-key-enter' ) ) {
		this.submitGuess();
	} else if ( keyDiv.classList.contains( 'geiryn-keyboard-key-backspace' ) ) {
		this.model.popLetter();
	} else {
		// gwnaethon nhw bwyso llythyren
		var letter = keyDiv.innerText;
		this.model.pushLetter( letter );
	}
	this.draw();
};

/**
 * Draw the curent model state
 *
 * @method
 */
geiryn.View.prototype.draw = function () {
	this.board.innerHTML = '';
	this.keyboard.innerHTML = '';
	var i;
	for ( i = 0; i < this.model.guesses.length; i++ ) {
		this.createBoardRow( this.board, this.model.guesses[ i ] );
	}
	this.createKeyboardRow( this.keyboard, [ 'w', 'e', 'r', 'rh', 't', 'th', 'y', 'u', 'i', 'o', 'p' ] );
	this.createKeyboardRow( this.keyboard, [ 'a', 's', 'd', 'dd', 'f', 'ff', 'g', 'h', 'j', 'l', 'll' ] );
	this.createKeyboardRow( this.keyboard, [ 'Enter', 'c', 'ch', 'b', 'n', 'ng', 'm', 'Backspace' ] );
	if ( this.model.hasWon ) {
		for ( i = this.model.guesses.length; i < 6; i++ ) {
			this.createEmptyRow( this.board );
		}
	} else {
		this.createNextGuessRow( this.board, this.model.nextGuess );
		for ( i = this.model.guesses.length + 1; i < 6; i++ ) {
			this.createEmptyRow( this.board );
		}
	}
	window.scrollTo( {
		top: document.body.scrollHeight,
		behavior: 'smooth'
	} );
};

geiryn.View.prototype.createEmptyRow = function ( board ) {
	var emptyRow = document.createElement( 'div' );
	emptyRow.classList.add( 'geiryn-empty-row' );
	board.appendChild( emptyRow );
	for ( var i = 0; i < 5; i++ ) {
		this.createBoardLetter( emptyRow, undefined, undefined, false );
	}
};

geiryn.View.prototype.createBoardRow = function ( board, rowData ) {
	var boardRow = document.createElement( 'div' );
	boardRow.classList.add( 'geiryn-board-row' );
	board.appendChild( boardRow );
	for ( var i = 0; i < rowData.length; i++ ) {
		var item = rowData[ i ];
		this.createBoardLetter( boardRow, item.letter, item.score, false );
	}
};

geiryn.View.prototype.createBoardLetter = function ( row, letter, score, isNext ) {
	var boardLetter = document.createElement( 'div' );
	boardLetter.classList.add( 'geiryn-board-letter' );
	if ( score !== undefined ) {
		boardLetter.classList.add( 'geiryn-board-letter-' + score );
	}
	if ( isNext ) {
		boardLetter.classList.add( 'geiryn-board-letter-next' );
	}
	if ( letter === undefined ) {
		// Set letter to non-breaking space
		letter = '\u00A0';
	}
	row.appendChild( boardLetter );
	boardLetter.innerText = letter;
};

geiryn.View.prototype.createNextGuessRow = function ( board, letters ) {
	var nextGuessRow = document.createElement( 'div' );
	nextGuessRow.classList.add( 'geiryn-next-guess-row' );
	board.appendChild( nextGuessRow );
	for ( var i = 0; i < 5; i++ ) {
		var letter = letters[ i ];
		var isNext;
		if ( !this.model.maybeDigraph ) {
			isNext = ( i === letters.length );
		} else {
			isNext = ( i === letters.length - 1 );
		}
		this.createBoardLetter( nextGuessRow, letter, undefined, isNext );
	}
};

geiryn.View.prototype.createKeyboardRow = function ( keyboard, rowLetters ) {
	var keyboardRow = document.createElement( 'div' );
	keyboardRow.classList.add( 'geiryn-keyboard-row' );
	keyboard.appendChild( keyboardRow );
	for ( var i = 0; i < rowLetters.length; i++ ) {
		var letter = rowLetters[ i ];
		this.createKeyboardKey( keyboardRow, letter );
	}
};

geiryn.View.prototype.createKeyboardKey = function ( keyboardRow, letter ) {
	var keyboardKey = document.createElement( 'div' );
	var score = this.model.keyStates[ letter ];
	keyboardKey.classList.add( 'geiryn-keyboard-key' );
	if ( score !== undefined ) {
		keyboardKey.classList.add( 'geiryn-keyboard-key-' + score );
	}
	if ( letter === 'Backspace' ) {
		keyboardKey.innerHTML = '<img class="geiryn-keyboard-image" src="../res/backspace.png" alt="Del">';
		keyboardKey.classList.add( 'geiryn-keyboard-key-backspace' );
	} else if ( letter === 'Enter' ) {
		keyboardKey.innerHTML = '<img class="geiryn-keyboard-image" src="../res/enter.png" alt="Enter">';
		keyboardKey.classList.add( 'geiryn-keyboard-key-enter' );
	} else {
		keyboardKey.innerText = letter;
	}
	keyboardRow.appendChild( keyboardKey );
};

geiryn.View.prototype.showToast = function ( text ) {
	var toast = this.toast;
	toast.innerText = text;
	toast.style.opacity = 1;
	setTimeout( function () {
		toast.style.opacity = 0;
	}, 3000 );
};

/**
 * Submit the guess
 *
 * Congratulate if correct
 */
geiryn.View.prototype.submitGuess = function () {
	var view = this;
	this.model.submitGuess();
	if ( this.model.hasWon ) {
		setTimeout( function () {
			requestAnimationFrame( function () {
				view.congratulate();
			} );
		}, 500 );
	}
};

geiryn.View.prototype.greet = function () {
	var contents = document.createElement( 'div' );
	contents.classList.add( 'geiryn-messageBox-greet-contents' );
	fetch( '../res/greet.html' ).then( function ( response ) {
		return response.text();
	} ).then( function ( html ) {
		contents.innerHTML = html;
	} );
	var messageBox = geiryn.createMessageBox( 'Sut i chwarae', contents );
	document.body.appendChild( messageBox );
	setTimeout( function () {
		messageBox.style.opacity = '1';
	} );
};

geiryn.View.prototype.congratulate = function () {
	var view = this;
	var contents = document.createElement( 'div' );
	contents.classList.add( 'geiryn-messageBox-congratulate-contents' );

	var emojis = this.model.getScoreEmojis();
	var emojisDiv = document.createElement( 'p' );
	emojisDiv.classList.add( 'geiryn-messageBox-congratulate-emojis' );
	emojisDiv.innerText = emojis;
	contents.appendChild( emojisDiv );

	var shareButton = document.createElement( 'button' );
	shareButton.innerHTML = '<img class="geiryn-share-image" src="../res/share.png" alt="">Rhannu';
	shareButton.classList.add( 'geiryn-dialog-contents-shareButton' );
	shareButton.addEventListener( 'click', function ( ev ) {
		ev.preventDefault();
		geiryn.copyToClipboard(
			'Sg??r fi:\n' +
			emojis + '\n' +
			'geiryn.com'
		);
		view.showToast( 'Wedi???i gop??o!' );
	} );

	var acknowledgments = document.createElement( 'div' );
	acknowledgments.classList.add( 'geiryn-messageBox-congratulate-acknowledgements' );

	fetch( '../res/congratulate.html' ).then( function ( response ) {
		return response.text();
	} ).then( function ( html ) {
		acknowledgments.innerHTML = html;
	} );

	contents.appendChild( shareButton );
	contents.appendChild( acknowledgments );
	var messageBox = geiryn.createMessageBox( 'Sg??r', contents );
	document.body.appendChild( messageBox );
	setTimeout( function () {
		messageBox.style.opacity = '1';
	} );
};

geiryn.createMessageBox = function ( headerText, contents ) {
	var dialog = document.createElement( 'div' );
	dialog.classList.add( 'geiryn-dialog' );
	var header = document.createElement( 'h1' );
	header.classList.add( 'geiryn-dialog-header' );
	header.innerText = headerText;
	var closeButton = document.createElement( 'button' );
	closeButton.innerText = '??';
	closeButton.classList.add( 'geiryn-dialog-header-closeButton' );
	closeButton.addEventListener( 'click', function () {
		document.body.removeChild( dialog );
	} );
	document.body.addEventListener( 'keydown', function ( ev ) {
		if ( ev.keyCode === 27 ) {
			// escape
			if ( dialog.parentNode ) {
				dialog.parentNode.removeChild( dialog );
			}
		}
	} );
	dialog.appendChild( header );
	header.appendChild( closeButton );
	dialog.appendChild( contents );
	return dialog;
};
