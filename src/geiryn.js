geiryn = {};

/**
 * Check whether some text is in the long wordlist
 *
 * @param {string[]} text The text to check
 * @return {boolean} Whether the text is in the long wordlist
 */
geiryn.isWord = function ( text ) {
	// text is like [ 'b', 'a', 'ch', 'a', 'u' ]
	// but geiryn.cyLongList is like [ ..., 'b a ch a u', ... ]
	var spacedText = text.join( ' ' );
	if ( geiryn.cyLonglist.indexOf( spacedText ) !== -1 ) {
		return true;
	} else {
		return false;
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
 * @param {string[]} word The word to find; must be five letters
 * @param {string[]} guess The guess; must be five letters
 * @return {object[]} array like [ { letter: 'x', score: 1 }, ... ]
 */
geiryn.evaluate = function ( word, guess ) {
	var wordArray = word.slice();
	var guessArray = guess.slice();
	var scores = [ null, null, null, null, null ];
	// Find exact matches, and set matching letters to null
	var i;
	for ( i = 0; i < wordArray.length; i++ ) {
		if ( wordArray[ i ] === guessArray[ i ] ) {
			scores[ i ] = { letter: wordArray[ i ], score: 2 };
			wordArray[ i ] = null;
			guessArray[ i ] = null;
		}
	}
	// Test each letter in guessArray for partial match
	for ( i = 0; i < guessArray.length; i++ ) {
		var letter = guessArray[ i ];
		if ( letter === null ) {
			continue;
		}
		var letterIndex = wordArray.indexOf( letter );
		if ( letterIndex !== -1 ) {
			scores[ i ] = { letter: letter, score: 1 };
			wordArray[ letterIndex ] = null;
		} else {
			scores[ i ] = { letter: letter, score: 0 };
		}
	}
	return scores;
};
