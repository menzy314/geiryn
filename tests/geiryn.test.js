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

	check( 'trade', 'ddeee', [ 1, 0, 0, 0, 1 ] );
	check( 'force', 'force', [ 2, 2, 2, 2, 2 ] );
	check( 'silly', 'doggo', [ 0, 0, 0, 0, 0 ] );
	check( 'heart', 'hxxxx', [ 2, 0, 0, 0, 0 ] );
} );
