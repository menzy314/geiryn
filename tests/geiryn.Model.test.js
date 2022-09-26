/*!
 * geiryn model tests
 *
 * @copyright 2022 geiryn team and others; see LICENSE.txt for terms
 */

/* global QUnit */

QUnit.module( 'geiryn.Model' );

QUnit.test( 'constructor', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	assert.deepEqual( m.guesses, [], 'nothing guessed yet' );
	assert.deepEqual( m.keyStates, {}, 'no letter states yet' );
	assert.deepEqual( m.answer, 'leery', 'the answer is stored correctly' );
} );

QUnit.test( 'guess', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	var result1 = m.guess( 'iiili' );
	assert.deepEqual( result1, false, 'non-word is rejected' );
	var result2 = m.guess( 'bread' );
	assert.deepEqual( result2, true, 'word is accepted' );
	assert.deepEqual(
		m.guesses,
		[ geiryn.buildLetterScores( 'bread', [ 0, 1, 2, 0, 0 ] ) ],
		'only the real word is stored as a guess'
	);
	assert.deepEqual( m.keyStates, { b: 0, r: 1, e: 2, a: 0, d: 0 }, 'letter states are updated' );
	var result3 = m.guess( 'levee' );
	assert.deepEqual( result3, true, 'word is accepted' );
	assert.deepEqual(
		m.guesses,
		[
			geiryn.buildLetterScores( 'bread', [ 0, 1, 2, 0, 0 ] ),
			geiryn.buildLetterScores( 'levee', [ 2, 2, 0, 1, 0 ] )
		],
		'only the real words are stored as a guess'
	);
	assert.deepEqual( m.keyStates, { b: 0, r: 1, e: 2, a: 0, d: 0, l: 2, v: 0 }, 'letter states are updated' );
	var result4 = m.guess( 'grape' );
	assert.deepEqual( result4, true, 'word is accepted' );
	assert.deepEqual(
		m.guesses,
		[
			geiryn.buildLetterScores( 'bread', [ 0, 1, 2, 0, 0 ] ),
			geiryn.buildLetterScores( 'levee', [ 2, 2, 0, 1, 0 ] ),
			geiryn.buildLetterScores( 'grape', [ 0, 1, 0, 0, 1 ] )
		],
		'only the real words are stored as a guess'
	);
	assert.deepEqual( m.keyStates, { b: 0, r: 1, e: 2, a: 0, d: 0, l: 2, v: 0, g: 0, p: 0 }, 'letter states are updated' );
} );

QUnit.test( 'pushLetter', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	m.pushLetter( 'r' );
	assert.deepEqual( m.nextGuess, [ 'r' ], 'typed r' );
	m.pushLetter( 'e' );
	m.pushLetter( 'a' );
	m.pushLetter( 'd' );
	m.pushLetter( 'y' );
	m.pushLetter( 's' );
	assert.deepEqual( m.nextGuess, [ 'r', 'e', 'a', 'd', 'y' ], 'cannot type longer than 5 letters' );
} );

QUnit.test( 'popLetter', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	m.pushLetter( 'r' );
	m.popLetter();
	assert.deepEqual( m.nextGuess, [], 'backspaced' );
} );

QUnit.test( 'submitGuess', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	m.pushLetter( 'r' );
	m.pushLetter( 'e' );
	m.pushLetter( 'a' );
	m.pushLetter( 'd' );
	m.pushLetter( 'y' );
	m.submitGuess();
	assert.deepEqual( m.nextGuess, [], 'm.nextGuess has been emptied' );
	assert.deepEqual( m.guesses.length, 1, 'guess has been added to m.guesses' );
} );
