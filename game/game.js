geiryn.demo = function () {
	var m = new geiryn.Model( 'trash' );
	m.guess( 'sleep' );
	m.guess( 'trade' );
	m.guess( 'union' );
	m.guess( 'flash' );
	var v = new geiryn.View( m );
	v.draw();
};
geiryn.demo();
