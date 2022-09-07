/*!
 * geiryn tests
 *
 * @copyright 2022 geiryn team and others; see LICENSE.txt for terms
 */

/* global QUnit */

QUnit.module( 'geiryn' );

QUnit.test( 'evaluate', function ( assert ) {
	var cases = [
		{ word: 'abcde', guess: 'vwyxz', expect: [ 0, 0, 0, 0, 0 ] },
		{ word: 'abcde', guess: 'abcde', expect: [ 2, 2, 2, 2, 2 ] },
		{ word: 'abcde', guess: 'eezzz', expect: [ 1, 0, 0, 0, 0 ] }
	];
	for ( var i = 0; i < cases.length; i++ ) {
		var test = cases[ i ];
		var result = geiryn.evaluate( test.word, test.guess );
		assert.deepEqual(
			result,
			test.expect,
			'guess ' + test.guess + ' for ' + test.word
		);
	}
} );
