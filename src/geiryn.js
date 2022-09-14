geiryn = {};

/**
 * Check whether some text is in the word list
 *
 * @param {string} text The text to check
 * @return {boolean} Whether the text is in the word list
 */
geiryn.isWord = function ( text ) {
	if ( geiryn.wordlist.indexOf( text ) !== -1 ) {
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
 * @param {string} word The word to find; must be five letters
 * @param {string} guess The guess; must be five letters
 * @return {number[]} score for each letter, e.g. [ 0, 1, 2, 0, 0 ]
 */
geiryn.evaluate = function ( word, guess ) {
	var wordArray = word.split( '' );
	var guessArray = guess.split( '' );
	var scores = [ null, null, null, null, null ];
	// Find exact matches, and set matching letters to null
	var i;
	for ( i = 0; i < wordArray.length; i++ ) {
		if ( wordArray[ i ] === guessArray[ i ] ) {
			scores[ i ] = 2;
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
			scores[ i ] = 1;
			wordArray[ letterIndex ] = null;
		} else {
			scores[ i ] = 0;
		}
	}
	return scores;
};

/**
 * Game logic
 *
 * @constructor
 * @param {string} answer The answer
 */
geiryn.Model = function ( answer ) {
	this.guesses = [];
	this.letterStates = {};
	this.answer = answer;
};

/**
 * Process user's guess.
 *
 *
 * @method
 * @param {string} text The guess
 * @return {boolean} Is text a word
 */
geiryn.Model.prototype.guess = function ( text ) {
	if ( geiryn.isWord( text ) === false ) {
		return false;
	}
	this.guesses.push( text );
	var scores = geiryn.evaluate( this.answer, text );
	for ( var i = 0; i < 5; i++ ) {
		var letter = text[ i ];
		var score = scores[ i ];
		var pastScore = this.letterStates[ letter ];
		if ( pastScore === undefined || score > pastScore ) {
			this.letterStates[ letter ] = score;
		}
	}
	return true;
};
