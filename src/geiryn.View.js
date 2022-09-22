/**
 * Game view
 *
 * @constructor
 * @param {geiryn.Model} model The model
 */
geiryn.View = function ( model ) {
	this.model = model;
};
/**
 * Draw the curent model state
 *
 * @method
 */
geiryn.View.prototype.draw = function () {
	var game = document.getElementById( 'game' );
	var board = document.createElement( 'div' );
	board.classList.add( 'board' );
	game.appendChild( board );

	for ( var i = 0; i < this.model.guesses.length; i++ ) {
		this.createRow( board, this.model.guesses[ i ] );
	}
};

geiryn.View.prototype.createRow = function ( board, rowData ) {
	var boardRow = document.createElement( 'div' );
	boardRow.classList.add( 'board-row' );
	board.appendChild( boardRow );
	for ( var i = 0; i < rowData.length; i++ ) {
		var item = rowData[ i ];
		this.createLetter( boardRow, item.letter, item.score );
	}
};

geiryn.View.prototype.createLetter = function ( row, letter, score ) {
	var boardLetter = document.createElement( 'div' );
	boardLetter.classList.add( 'board-letter' );
	boardLetter.classList.add( 'board-letter-' + score );
	row.appendChild( boardLetter );
	boardLetter.innerText = letter;
};
