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

	var rowData1 = [
		{ letter: 'n', score: 1 },
		{ letter: 'o', score: 2 },
		{ letter: 'o', score: 0 },
		{ letter: 'k', score: 0 },
		{ letter: 's', score: 2 }
	];
	var rowData2 = [
		{ letter: 'c', score: 2 },
		{ letter: 'o', score: 2 },
		{ letter: 'i', score: 2 },
		{ letter: 'n', score: 2 },
		{ letter: 's', score: 2 }
	];

	geiryn.createRow( board, rowData1 );
	geiryn.createRow( board, rowData2 );
};
geiryn.demo();
