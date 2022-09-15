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
	assert.deepEqual( m.letterStates, {}, 'no letter states yet' );
	assert.deepEqual( m.answer, 'leery', 'the answer is stored correctly' );
} );

QUnit.test( 'guess', function ( assert ) {
	var m = new geiryn.Model( 'leery' );
	var result1 = m.guess( 'iiili' );
	assert.deepEqual( result1, false, 'non-word is rejected' );
	var result2 = m.guess( 'bread' );
	assert.deepEqual( result2, true, 'word is accepted' );
	assert.deepEqual( m.guesses, [ 'bread' ], 'only the real word is stored as a guess' );
	assert.deepEqual( m.letterStates, { b: 0, r: 1, e: 2, a: 0, d: 0 }, 'letter states are updated' );
	var result3 = m.guess( 'levee' );
	assert.deepEqual( result3, true, 'word is accepted' );
	assert.deepEqual( m.guesses, [ 'bread', 'levee' ], 'only the real words are stored as a guess' );
	assert.deepEqual( m.letterStates, { b: 0, r: 1, e: 2, a: 0, d: 0, l: 2, v: 0 }, 'letter states are updated' );
	var result4 = m.guess( 'grape' );
	assert.deepEqual( result4, true, 'word is accepted' );
	assert.deepEqual( m.guesses, [ 'bread', 'levee', 'grape' ], 'only the real words are stored as a guess' );
	assert.deepEqual( m.letterStates, { b: 0, r: 1, e: 2, a: 0, d: 0, l: 2, v: 0, g: 0, p: 0 }, 'letter states are updated' );
} );
