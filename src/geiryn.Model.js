/**
 * Game logic
 *
 * @constructor
 * @param {string[]} answer The answer
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
 * @param {string[]} text The guess
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
	var currentGuess = this.nextGuess.slice();
	this.guess( currentGuess );
	this.nextGuess.splice( 0 );
};

geiryn.Model.prototype.getScoreEmojis = function () {
	var emojis = '';
	for ( var i = 0; i < this.guesses.length; i++ ) {
		var guess = this.guesses[ i ];
		for ( var j = 0; j < guess.length; j++ ) {
			var letter = guess[ j ];
			var emoji;
			if ( letter.score === 0 ) {
				emoji = '⬜';
			} else if ( letter.score === 1 ) {
				emoji = '🟨';
			} else {
				emoji = '🟩';
			}
			// console.log( emoji );
			emojis += emoji;
		}
		emojis += '\n';
	}
	return emojis;
};
