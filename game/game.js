/* global cyrb53 */

geiryn.fetchPeriodicText = function () {
	// Text that changes unpredictably every few hours
	return fetch( 'http://www.floatrates.com/daily/gbp.json', { mode: 'cors' } ).then( function ( request ) {
		return request.text();
	} );
};

geiryn.demo = function ( seed ) {
	var spacedWord = geiryn.cyShortlist[ seed % geiryn.cyShortlist.length ];
	var word = spacedWord.split( ' ' );
	geiryn.m = new geiryn.Model( word );
	geiryn.v = new geiryn.View( geiryn.m );
	document.getElementById( 'game' ).appendChild( geiryn.v.game );
	geiryn.v.draw();
	geiryn.v.greet();
};

geiryn.fetchPeriodicText().then( function ( periodicText ) {
	var seed = cyrb53( periodicText );
	geiryn.demo( seed );
} ).catch( function () {
	// Seed that changes every four hours
	var seed = cyrb53( Math.floor( Date.now() / 1000 / 60 / 60 / 4 ) );
	geiryn.demo( seed );
} );
