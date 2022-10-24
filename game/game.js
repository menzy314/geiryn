/* global cyrb53 */

geiryn.fetchDailyText = function () {
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

geiryn.fetchDailyText().then( function ( dailyText ) {
	var dailySeed = cyrb53( dailyText );
	geiryn.demo( dailySeed );
} );
