geiryn = {};

/**
 * Find the word corresponding to the deaccented text, if any
 *
 * @param {string[]} deAccentedText The deaccented text to check
 * @return {string[]|null} The word (with any accents), or null if not found
 */
geiryn.findWord = function ( deAccentedText ) {
	geiryn.buildCyLonglistDeAccented();
	// deAccentedText is like [ 'c', 'o', 'ff', 'a', 'd' ]
	// geiryn.cyLonglistDeAccented is like [ ..., 'c o ff a d', ... ]
	// geiryn.cyLonglist is like [ ..., 'c o ff â d', ... ]

	var spacedText = deAccentedText.join( ' ' ); // e.e. 'c o ff a d'
	var index = geiryn.cyLonglistDeAccented.indexOf( spacedText );
	if ( index === -1 ) {
		return null;
	} else {
		var accentedWord = geiryn.cyLonglist[ index ].split( ' ' );
		return accentedWord;
	}
};

geiryn.deAccentString = function ( text ) {
	var deAccentedArray = [];
	for ( var i = 0; i < text.length; i++ ) {
		var character = text[ i ];
		var deAccentedCharacter = geiryn.deAccentCharacter( character );
		deAccentedArray.push( deAccentedCharacter );
	}
	return deAccentedArray.join( '' );
};

geiryn.deAccentCharacter = function ( ch ) {
	if ( ch === 'â' || ch === 'ä' || ch === 'á' || ch === 'à' ) {
		return 'a';
	}
	if ( ch === 'ê' || ch === 'ë' || ch === 'é' || ch === 'è' ) {
		return 'e';
	}
	if ( ch === 'î' || ch === 'ï' || ch === 'í' || ch === 'ì' ) {
		return 'i';
	}
	if ( ch === 'ô' || ch === 'ö' || ch === 'ó' || ch === 'ó' ) {
		return 'o';
	}
	if ( ch === 'û' || ch === 'ü' || ch === 'ú' || ch === 'ù' ) {
		return 'u';
	}
	if ( ch === 'ŵ' || ch === 'ẅ' || ch === 'ẃ' || ch === 'ẁ' ) {
		return 'w';
	}
	if ( ch === 'ŷ' || ch === 'ÿ' || ch === 'ý' || ch === 'ỳ' ) {
		return 'y';
	}
	return ch;
};

geiryn.cyLonglistDeAccented = undefined;
geiryn.buildCyLonglistDeAccented = function () {
	if ( geiryn.cyLonglistDeAccented !== undefined ) {
		return;
	}
	geiryn.cyLonglistDeAccented = [];
	for ( var i = 0; i < geiryn.cyLonglist.length; i++ ) {
		var word = geiryn.cyLonglist[ i ];
		var deAccentedWord = geiryn.deAccentString( word );
		geiryn.cyLonglistDeAccented.push( deAccentedWord );
	}
};

/**
 * Evaluate a guess
 *
 * Returns an array with 0, 1 or 2 for each letter position.
 * 2 means the letter is correct
 * 1 means the letter is present but in the wrong place
 * 0 means the letter is completely absent
 *
 * XXX explain exactly how 1 works in the case of doubled letters
 *
 * @param {string[]} accentedAnswer The answer to find; must be five letters
 * @param {string[]} accentedGuess The guess; must be five letters
 * @return {object[]} array like [ { letter: 'x', score: 1 }, ... ]
 */
geiryn.evaluate = function ( accentedAnswer, accentedGuess ) {
	var deAccentedAnswer = geiryn.deAccentString( accentedAnswer.join( ' ' ) ).split( ' ' );
	var deAccentedGuess = geiryn.deAccentString( accentedGuess.join( ' ' ) ).split( ' ' );
	var scores = [ null, null, null, null, null ];

	// Find exact matches, and set matching letters to null
	var i;
	for ( i = 0; i < deAccentedAnswer.length; i++ ) {
		if ( deAccentedAnswer[ i ] === deAccentedGuess[ i ] ) {
			scores[ i ] = { letter: accentedGuess[ i ], score: 2 };
			deAccentedAnswer[ i ] = null;
			deAccentedGuess[ i ] = null;
		}
	}

	// Test each letter in deAccentedGuess for partial match
	for ( i = 0; i < deAccentedGuess.length; i++ ) {
		var deAccentedLetter = deAccentedGuess[ i ];
		var accentedLetter = accentedGuess[ i ];
		if ( deAccentedLetter === null ) {
			continue;
		}
		var letterIndex = deAccentedAnswer.indexOf( deAccentedLetter );
		if ( letterIndex !== -1 ) {
			scores[ i ] = { letter: accentedLetter, score: 1 };
			deAccentedAnswer[ letterIndex ] = null;
		} else {
			scores[ i ] = { letter: accentedLetter, score: 0 };
		}
	}
	return scores;
};

/**
 * Copy text to clipboard
 *
 * @param {string} text The text to copy
 * @return {boolean} Whether the copy succeeded
 */
geiryn.copyToClipboard = function ( text ) {
	var copyTextArea = document.getElementById( 'geiryn-copy-textarea' );
	if ( !copyTextArea ) {
		copyTextArea = document.createElement( 'textarea' );
		document.body.appendChild( copyTextArea );
	}
	copyTextArea.value = text;
	copyTextArea.focus();
	copyTextArea.select();
	try {
		var successful = document.execCommand( 'copy' );
		return successful;
	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.error( 'Copy failed', err );
		return false;
	}
};
