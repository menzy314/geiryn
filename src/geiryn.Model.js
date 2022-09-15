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
