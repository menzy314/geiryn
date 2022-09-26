/**
 * Game logic
 *
 * @constructor
 * @param {string} answer The answer
 */
geiryn.Model = function ( answer ) {
	this.guesses = [];
	this.keyStates = {};
	this.answer = answer;
	this.nextGuess = [];
};

/**
 * Process user's guess.
 *
 * @method
 * @param {string} text The guess
 * @return {boolean} Is text a word
 */
geiryn.Model.prototype.guess = function ( text ) {
	if ( geiryn.isWord( text ) === false ) {
		return false;
	}
	var scoredLetters = geiryn.evaluate( this.answer, text );
	this.guesses.push( scoredLetters );
	for ( var i = 0; i < 5; i++ ) {
		var scoredLetter = scoredLetters[ i ];
		// Mae scoredLetter yn edrych fel hyn:
		// { letter: 'q', score: 2 }
		var pastScore = this.keyStates[ scoredLetter.letter ];
		if ( pastScore === undefined || scoredLetter.score > pastScore ) {
			this.keyStates[ scoredLetter.letter ] = scoredLetter.score;
		}
	}
	return true;
};

geiryn.Model.prototype.pushLetter = function ( letter ) {
	if ( this.nextGuess.length < 5 ) {
		this.nextGuess.push( letter );
	}
};
geiryn.Model.prototype.popLetter = function () {
	this.nextGuess.pop();
};
geiryn.Model.prototype.submitGuess = function () {
	var currentGuess = this.nextGuess.join( '' );
	this.guess( currentGuess );
	this.nextGuess.splice( 0 );
};
