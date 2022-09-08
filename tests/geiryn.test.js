/*!
 * geiryn tests
 *
 * @copyright 2022 geiryn team and others; see LICENSE.txt for terms
 */

/* global QUnit */

QUnit.module( 'geiryn' );

QUnit.test( 'evaluate', function ( assert ) {
	function check( answer, guess, expect ) {
		var result = geiryn.evaluate( answer, guess );
		assert.deepEqual( result, expect, 'guess "' + guess + '" for answer "' + answer + '"' );
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
