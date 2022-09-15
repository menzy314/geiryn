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
