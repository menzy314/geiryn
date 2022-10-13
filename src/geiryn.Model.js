/**
 * Game logic
 *
 * User enters an unaccented guess. The guess is accepted if it matches a
 * word in geiryn.cyLonglist, ignoring accents. Matched word gets put into
 * the guess list, i.e. including accents if any. The guess gets compared
 * to the answer, ignoring accents. Keystates are updated accordingly,
 * ignoring accents.
 *
 * @constructor
 * @param {string[]} answer The answer
 */
geiryn.Model = function ( answer ) {
	this.guesses = [];
	this.keyStates = {};
	this.answer = answer;
	this.nextGuess = [];
	this.maybeDigraph = false;
};

/**
 * Process user's guess.
 *
 * @method
 * @param {string[]} text The guess (i.e. without accented letters)
 * @return {boolean} Does text match a word?
 */
geiryn.Model.prototype.guess = function ( text ) {
	var foundWord = geiryn.findWord( text );
	if ( foundWord === null ) {
		return false;
	}
	var scoredLetters = geiryn.evaluate( this.answer, foundWord );
	this.guesses.push( scoredLetters );
	for ( var i = 0; i < 5; i++ ) {
		var scoredLetter = scoredLetters[ i ];
		// Mae scoredLetter yn edrych fel hyn:
		// { letter: 'q', score: 2 }
		var deAccentedLetter = geiryn.deAccentCharacter( scoredLetter.letter );
		var pastScore = this.keyStates[ deAccentedLetter ];
		if ( pastScore === undefined || scoredLetter.score > pastScore ) {
			this.keyStates[ deAccentedLetter ] = scoredLetter.score;
		}
	}
	return true;
};

geiryn.Model.prototype.pushLetter = function ( letter ) {
	var lowerLetter = letter.toLowerCase();
	if ( this.maybeDigraph === true ) {
		this.maybeDigraph = false;
		var digraph = this.nextGuess[ this.nextGuess.length - 1 ] + lowerLetter;
		if ( digraph.match( /^(ch|dd|ff|ng|ll|rh|th)$/ ) ) {
			this.nextGuess.pop();
			this.nextGuess.push( digraph );
			return;
		}
	}
	if ( this.nextGuess.length < 5 ) {
		this.nextGuess.push( lowerLetter );
		if ( lowerLetter.match( /^[cdfnlrt]$/ ) ) {
			this.maybeDigraph = true;
		}
	}
};
geiryn.Model.prototype.popLetter = function () {
	this.nextGuess.pop();
	this.maybeDigraph = false;
};
geiryn.Model.prototype.submitGuess = function () {
	var currentGuess = this.nextGuess.slice();
	this.guess( currentGuess );
	this.nextGuess.splice( 0 );
	this.maybeDigraph = false;
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
