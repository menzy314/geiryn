/*!
 * geiryn tests
 *
 * @copyright 2022 geiryn team and others; see LICENSE.txt for terms
 */

/* global QUnit */

QUnit.module( 'geiryn' );

geiryn.buildLetterScores = function ( guess, numberArray ) {
	var letterScores = [];
	for ( var i = 0; i < numberArray.length; i++ ) {
		var score = numberArray[ i ];
		var letter = guess[ i ];
		letterScores.push( { letter: letter, score: score } );
	}
	return letterScores;
};

QUnit.test( 'isWord', function ( assert ) {
	var result = geiryn.isWord( 'abcde' );
	assert.deepEqual( result, false, 'abcde is not a word' );
	var result2 = geiryn.isWord( 'drums' );
	assert.deepEqual( result2, true, 'drums is a word' );
} );

QUnit.test( 'evaluate', function ( assert ) {
	function check( answer, guess, numberArray ) {
		var result = geiryn.evaluate( answer, guess );
		var expectArray = geiryn.buildLetterScores( guess, numberArray );
		assert.deepEqual( result, expectArray, 'guess "' + guess + '" for answer "' + answer + '"' );
	}

	check( 'trade', 'ddeee', [ 1, 0, 0, 0, 2 ] );
	check( 'force', 'force', [ 2, 2, 2, 2, 2 ] );
	check( 'silly', 'doggo', [ 0, 0, 0, 0, 0 ] );
	check( 'heart', 'hxxxx', [ 2, 0, 0, 0, 0 ] );
	check( 'leery', 'ready', [ 1, 2, 0, 0, 2 ] );
	check( 'leery', 'gleet', [ 0, 1, 2, 1, 0 ] );
	check( 'leery', 'jerry', [ 0, 2, 0, 2, 2 ] );
	check( 'leery', 'rover', [ 1, 0, 0, 1, 0 ] );
	check( 'leery', 'geese', [ 0, 2, 2, 0, 0 ] );
	check( 'leery', 'levee', [ 2, 2, 0, 1, 0 ] );
	check( 'flare', 'drove', [ 0, 1, 0, 0, 2 ] );
	check( 'flare', 'rarer', [ 1, 1, 0, 1, 0 ] );
	check( 'flare', 'reams', [ 1, 1, 2, 0, 0 ] );
} );
