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

QUnit.test( 'findWord', function ( assert ) {
	var result1 = geiryn.findWord( [ 'a', 'b', 'c', 'd', 'e' ] );
	assert.deepEqual( result1, null, 'abcde is not a word' );
	var result2 = geiryn.findWord( [ 'l', 'w', 'c', 'u', 's' ] );
	assert.deepEqual( result2, [ 'l', 'w', 'c', 'u', 's' ], 'lwcus is a word' );
	var result3 = geiryn.findWord( [ 't', 'a', 't', 'w', 'o' ] );
	assert.deepEqual( result3, [ 't', 'a', 't', 'ŵ', 'o' ], 'tatŵo is a word' );
} );

QUnit.test( 'deAccentString', function ( assert ) {
	var result = geiryn.deAccentString( 'âlëíafbnmŷŵ' );
	assert.deepEqual( result, 'aleiafbnmyw' );
} );

QUnit.test( 'evaluate', function ( assert ) {
	function check( answer, guess, numberArray ) {
		var result = geiryn.evaluate( answer, guess );
		var expectArray = geiryn.buildLetterScores( guess, numberArray );
		assert.deepEqual( result, expectArray, 'guess "' + guess + '" for answer "' + answer + '"' );
	}
	check( [ 't', 'r', 'a', 'd', 'e' ], [ 'd', 'd', 'e', 'e', 'e' ], [ 1, 0, 0, 0, 2 ] );
	check( [ 'f', 'o', 'r', 'c', 'e' ], [ 'f', 'o', 'r', 'c', 'e' ], [ 2, 2, 2, 2, 2 ] );
	check( [ 's', 'i', 'l', 'l', 'y' ], [ 'd', 'o', 'g', 'g', 'o' ], [ 0, 0, 0, 0, 0 ] );
	check( [ 'h', 'e', 'a', 'r', 't' ], [ 'h', 'x', 'x', 'x', 'x' ], [ 2, 0, 0, 0, 0 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'r', 'e', 'a', 'd', 'y' ], [ 1, 2, 0, 0, 2 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'g', 'l', 'e', 'e', 't' ], [ 0, 1, 2, 1, 0 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'j', 'e', 'r', 'r', 'y' ], [ 0, 2, 0, 2, 2 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'r', 'o', 'v', 'e', 'r' ], [ 1, 0, 0, 1, 0 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'g', 'e', 'e', 's', 'e' ], [ 0, 2, 2, 0, 0 ] );
	check( [ 'l', 'e', 'e', 'r', 'y' ], [ 'l', 'e', 'v', 'e', 'e' ], [ 2, 2, 0, 1, 0 ] );
	check( [ 'f', 'l', 'a', 'r', 'e' ], [ 'd', 'r', 'o', 'v', 'e' ], [ 0, 1, 0, 0, 2 ] );
	check( [ 'f', 'l', 'a', 'r', 'e' ], [ 'r', 'a', 'r', 'e', 'r' ], [ 1, 1, 0, 1, 0 ] );
	check( [ 'f', 'l', 'a', 'r', 'e' ], [ 'r', 'e', 'a', 'm', 's' ], [ 1, 1, 2, 0, 0 ] );
	check( [ 'rh', 'a', 'ff', 'o', 'dd' ], [ 'a', 'r', 'f', 'd', 'y' ], [ 1, 0, 0, 0, 0 ] );
	check( [ 'a', 'r', 'f', 'd', 'y' ], [ 'rh', 'a', 'ff', 'o', 'dd' ], [ 0, 1, 0, 0, 0 ] );
	check( [ 'a', 'n', 'g', 'a', 'ng' ], [ 'a', 'ng', 'a', 'n', 'g' ], [ 2, 1, 1, 1, 1 ] );
} );
