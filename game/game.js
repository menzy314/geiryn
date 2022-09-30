/* global cyrb53 */

geiryn.fetchDailyText = function () {
	return fetch( 'http://www.floatrates.com/daily/gbp.json', { mode: 'cors' } ).then( function ( request ) {
		return request.text();
	} );
};

geiryn.demo = function ( seed ) {
	var word = geiryn.wordlist[ seed % geiryn.wordlist.length ];
	geiryn.m = new geiryn.Model( word );
	geiryn.v = new geiryn.View( geiryn.m );
	geiryn.v.draw();
	document.getElementById( 'game' ).appendChild( geiryn.v.game );
};

geiryn.fetchDailyText().then( function ( dailyText ) {
	var dailySeed = cyrb53( dailyText );
	geiryn.demo( dailySeed );
} );
