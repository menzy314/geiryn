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
	this.hasWon = false;
};

/**
 * Process user's guess.
 *
 * @method
 * @param {string[]} text The guess (i.e. without accented letters)
 */
geiryn.Model.prototype.guess = function ( text ) {
	var foundWord = geiryn.findWord( text );
	if ( foundWord === null ) {
		return;
	}
	var scoredLetters = geiryn.evaluate( this.answer, foundWord );
	this.guesses.push( scoredLetters );
	var correctLetters = 0;
	for ( var i = 0; i < 5; i++ ) {
		var scoredLetter = scoredLetters[ i ];
		if ( scoredLetter.score === 2 ) {
			correctLetters += 1;
		}
		// Mae scoredLetter yn edrych fel hyn:
		// { letter: 'q', score: 2 }
		var deAccentedLetter = geiryn.deAccentCharacter( scoredLetter.letter );
		var pastScore = this.keyStates[ deAccentedLetter ];
		if ( pastScore === undefined || scoredLetter.score > pastScore ) {
			this.keyStates[ deAccentedLetter ] = scoredLetter.score;
		}
	}

	if ( correctLetters === 5 ) {
		this.hasWon = true;
	}
};

/**
 * Append letter to nextGuess
 *
 * Automatically joins digraphs
 *
 * @param {string} letter The letter to append
 */
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
			// Usually ng is a double letter, but there are some exceptions, below.
			// In these exceptions we don't set maybeDigraph to true, so that the
			// player can easily type the exceptional words with separate n+g.
			// In cyShortlist:
			// 'b i n g o',
			// 'j y n g l',
			// 'm a n g o',
			// 't a n g o',
			// 'u n g e ll'
			// There happen to be no words starting with b i ng, j y ng, m a ng, t a ng, or u ng.
			// In cyLonglist (not including shortlist ones):
			// 'd a n g o',
			// 'e n g l o',
			// 'f a n g o',
			// 'f i n g o',
			// 'i n g o t',
			// 'j i n g o',
			// 'm i n g o',
			// 'th a n g o',
			// There are no words starting with f a ng, f i ng, j i ng, m i ng, or th a ng
			// But the words d a ng o s, e ng l y n, and i ng o e dd exist, so we set
			// maybeDigraph to true as normal if the user typed d a n, e n, or i n.
			// TODO: unit test this logic!
			if ( !this.nextGuess.join( '' ).match( /^(bin|fan|fin|jin|jyn|man|min|tan|than|un)$/ ) ) {
				this.maybeDigraph = true;
			}
		}
	}
};

/**
 * Remove last letter from nextGuess
 */
geiryn.Model.prototype.popLetter = function () {
	this.nextGuess.pop();
	this.maybeDigraph = false;
};
/**
 * Submit nextGuess
 */
geiryn.Model.prototype.submitGuess = function () {
	var currentGuess = this.nextGuess.slice();
	this.nextGuess.splice( 0 );
	this.maybeDigraph = false;
	this.guess( currentGuess );
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
			emojis += emoji;
		}
		emojis += '\n';
	}
	return emojis;
};
