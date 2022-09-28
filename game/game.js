geiryn.demo = function () {
	var randomIndex = Math.floor( Math.random() * geiryn.wordlist.length );
	var randomWord = geiryn.wordlist[ randomIndex ];
	var m = new geiryn.Model( randomWord );
	var v = new geiryn.View( m );
	v.draw();
	document.getElementById( 'game' ).appendChild( v.game );
};
geiryn.demo();
