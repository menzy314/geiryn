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
	assert.deepEqual( m.keyStates, {}, 'no key states yet' );
	assert.deepEqual( m.answer, 'leery', 'the answer is stored correctly' );
} );

QUnit.test( 'guess', function ( assert ) {
	var m = new geiryn.Model( [ 'b', 'a', 'ch', 'a', 'u' ] );
	m.guess( [ 'i', 'i', 'i', 'l', 'i' ] );
	m.guess( [ 'a', 'ch', 'w', 'y', 'n' ] );
	assert.deepEqual(
		m.guesses,
		[ geiryn.buildLetterScores( [ 'a', 'ch', 'w', 'y', 'n' ], [ 1, 1, 0, 0, 0 ] ) ],
		'only the real word is stored as a guess'
	);
	assert.deepEqual( m.keyStates, { a: 1, ch: 1, w: 0, y: 0, n: 0 }, 'key states are updated' );
	m.guess( [ 'b', 'r', 'e', 'ch', 'u' ] );
	assert.deepEqual(
		m.guesses,
		[
			geiryn.buildLetterScores( [ 'a', 'ch', 'w', 'y', 'n' ], [ 1, 1, 0, 0, 0 ] ),
			geiryn.buildLetterScores( [ 'b', 'r', 'e', 'ch', 'u' ], [ 2, 0, 0, 1, 2 ] )
		],
		'only the real words are stored as a guess'
	);
	assert.deepEqual( m.keyStates, { a: 1, ch: 1, w: 0, y: 0, n: 0, b: 2, r: 0, e: 0, u: 2 }, 'key states are updated' );
	m.guess( [ 'g', 'r', 'a', 'w', 'n' ] );
	assert.deepEqual(
		m.guesses,
		[
			geiryn.buildLetterScores( [ 'a', 'ch', 'w', 'y', 'n' ], [ 1, 1, 0, 0, 0 ] ),
			geiryn.buildLetterScores( [ 'b', 'r', 'e', 'ch', 'u' ], [ 2, 0, 0, 1, 2 ] ),
			geiryn.buildLetterScores( [ 'g', 'r', 'a', 'w', 'n' ], [ 0, 0, 1, 0, 0 ] )
		],
		'only the real words are stored as a guess'
	);
	assert.deepEqual( m.keyStates, { a: 1, ch: 1, w: 0, y: 0, n: 0, b: 2, r: 0, e: 0, u: 2, g: 0 }, 'key states are updated' );
} );

QUnit.test( 'guess (accented)', function ( assert ) {
	var m = new geiryn.Model( [ 'g', 'i', 't', 'â', 'r' ] );
	m.guess( [ 'th', 'e', 'a', 't', 'r' ] );
	m.guess( [ 'a', 'c', 't', 'o', 'r' ] );
	assert.deepEqual(
		m.guesses,
		[
			geiryn.buildLetterScores( [ 'th', 'e', 'a', 't', 'r' ], [ 0, 0, 1, 1, 2 ] ),
			geiryn.buildLetterScores( [ 'a', 'c', 't', 'o', 'r' ], [ 1, 0, 2, 0, 2 ] )
		],
		'letters are scored ignoring accents'
	);
	assert.deepEqual( m.keyStates, { th: 0, e: 0, a: 1, t: 2, r: 2, c: 0, o: 0 }, 'key states are updated ignoring accents' );
} );

QUnit.test( 'pushLetter', function ( assert ) {
	var m = new geiryn.Model( [ 'b', 'a', 'ch', 'a', 'u' ] );
	m.pushLetter( 'rh' );
	assert.deepEqual( m.nextGuess, [ 'rh' ], 'typed rh' );
	m.pushLetter( 'a' );
	m.pushLetter( 'ff' );
	m.pushLetter( 'a' );
	m.pushLetter( 'u' );
	m.pushLetter( 's' );
	assert.deepEqual( m.nextGuess, [ 'rh', 'a', 'ff', 'a', 'u' ], 'cannot type longer than 5 letters' );
} );

QUnit.test( 'popLetter', function ( assert ) {
	var m = new geiryn.Model( [ 'b', 'a', 'ch', 'a', 'u' ] );
	m.pushLetter( 'r' );
	m.popLetter();
	assert.deepEqual( m.nextGuess, [], 'backspaced' );
	m.pushLetter( 'rh' );
	m.popLetter();
	assert.deepEqual( m.nextGuess, [], 'backspaced' );
} );

QUnit.test( 'submitGuess', function ( assert ) {
	var m = new geiryn.Model( [ 'b', 'a', 'ch', 'a', 'u' ] );
	m.pushLetter( 'rh' );
	m.pushLetter( 'a' );
	m.pushLetter( 'ff' );
	m.pushLetter( 'a' );
	m.pushLetter( 'u' );
	m.submitGuess();
	assert.deepEqual( m.nextGuess, [], 'm.nextGuess has been emptied' );
	assert.deepEqual( m.guesses.length, 1, 'guess has been added to m.guesses' );
} );
