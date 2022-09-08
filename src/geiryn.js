geiryn = {};

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
	var scores = [ null, null, null, null, null ];
	for ( var i = 0; i < word.length; i++ ) {
		if ( word[ i ] === guess[ i ] ) {
			scores[ i ] = 2;
		} else {
			scores[ i ] = 0;
		}
	}
	return scores;
};
