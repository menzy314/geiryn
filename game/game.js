geiryn.createLetter = function ( row, letter, score ) {
	var boardLetter = document.createElement( 'div' );
	boardLetter.classList.add( 'board-letter' );
	boardLetter.classList.add( 'board-letter-' + score );
	row.appendChild( boardLetter );
	boardLetter.innerText = letter;
};

geiryn.createRow = function ( board, rowData ) {
	var boardRow = document.createElement( 'div' );
	boardRow.classList.add( 'board-row' );
	board.appendChild( boardRow );
	for ( var i = 0; i < rowData.length; i++ ) {
		var item = rowData[ i ];
		geiryn.createLetter( boardRow, item.letter, item.score );
	}
};

geiryn.demo = function () {
	var game = document.getElementById( 'game' );
	var board = document.createElement( 'div' );
	board.classList.add( 'board' );
	game.appendChild( board );

	var q = new geiryn.Model( 'trash' );
	q.guess( 'sleep' );
	q.guess( 'trade' );
	q.guess( 'union' );

	for ( var i = 0; i < q.guesses.length; i++ ) {
		geiryn.createRow( board, q.guesses[ i ] );
	}
};
geiryn.demo();
