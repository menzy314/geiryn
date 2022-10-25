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
	if ( ev.target.classList.contains( 'geiryn-keyboard-key' ) ) {
		var letter = ev.target.innerText;
		if ( this.model.hasWon ) {
			return;
		}
		if ( letter === '⇦' ) {
			this.model.popLetter();
		} else if ( letter === '↵' ) {
			this.submitGuess();
		} else {
			this.model.pushLetter( letter );
		}
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
	if ( letter === 'Enter' || letter === 'Backspace' ) {
		keyboardKey.classList.add( 'geiryn-keyboard-key-special' );
	}
	if ( letter === 'Backspace' ) {
		keyboardKey.innerHTML = '<img class="geiryn-keyboard-image" src="../res/backspace.png" alt="Del">';
	} else if ( letter === 'Enter' ) {
		keyboardKey.innerHTML = '<img class="geiryn-keyboard-image" src="../res/enter.png" alt="Enter">';
		keyboardKey.classList.add( 'geiryn-keyboard-key-2' );
	} else {
		keyboardKey.innerText = letter;
	}
	keyboardRow.appendChild( keyboardKey );
};

geiryn.View.prototype.showToast = function ( text ) {
	var toast = this.toast;
	toast.innerText = text;
	toast.style.opacity = 1;
	toast.style.zIndex = 2;
	setTimeout( function () {
		toast.style.opacity = 0;
		toast.style.zIndex = -1;
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
	contents.innerHTML = (
		'<p>Dyfala air Cymraeg pump llythyren, er enghraifft:</p>\n' +
		'<img class="geiryn-image" src="../theatr.png">\n' +
		'<p>Mae’r <strong>R</strong> werdd yn golygu bod yr ateb yn cynnwys <strong>R</strong> yn yr un safle.</p>\n' +
		'<p>Mae’r <strong>A</strong> a <strong>T</strong> oren yn golygu bod yr ateb yn cynnwys <strong>A</strong> a <strong>T</strong>, ond ddim yn yr un safle.</p>\n' +
		'<p>Mae’r <strong>TH</strong> a <strong>E</strong> llwyd yn golygu nad yw’r ateb yn cynnwys <strong>TH</strong> neu <strong>E</strong> o gwbl.</p>\n' +
		'<p>Caria ymlaen yn dyfalu geiriau, er enghraifft:<p>\n' +
		'<img class="geiryn-image" src="../actor.png">\n' +
		'<p>Nawr mae <strong>T</strong> a <strong>R</strong> yn y lle cywir, ac mae <strong>A</strong> yn y lle anghywir.\n' +
		'</p>\n' +
		'<img class="geiryn-image" src="../gitar.png">\n' +
		'<p>Cywir! Mae pob un llythyren yn gywir.</p>'
	);
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
			'Sgôr fi:\n' +
			emojis + '\n' +
			'geiryn.com'
		);
		view.showToast( 'Wedi’i gopïo!' );
	} );

	var acknowledgments = document.createElement( 'div' );
	acknowledgments.classList.add( 'geiryn-messageBox-congratulate-acknowledgements' );
	acknowledgments.innerHTML = '<h2>Diolchiadau</h2><p>Uned Technolegau Iaith, Prifysgol Bangor, am ddarparu <a href="https://github.com/techiaith/lecsicon-cymraeg-bangor" target="_blank">Lecsicon Cymraeg Bangor</a>. Mae Geiryn yn cynnwys data o’r lecsicon.</p><p>Gweler y <a href="https://github.com/menzy314/geiryn" target="_blank">cod ar GitHub</a>.</p>';

	contents.appendChild( shareButton );
	var messageBox = geiryn.createMessageBox( 'Sgôr', contents );
	document.body.appendChild( messageBox );
	setTimeout( function () {
		messageBox.style.opacity = '1';
	} );
	contents.appendChild( acknowledgments );
};

geiryn.createMessageBox = function ( headerText, contents ) {
	var dialog = document.createElement( 'div' );
	dialog.classList.add( 'geiryn-dialog' );
	var header = document.createElement( 'h1' );
	header.classList.add( 'geiryn-dialog-header' );
	header.innerText = headerText;
	var closeButton = document.createElement( 'button' );
	closeButton.innerText = '×';
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
