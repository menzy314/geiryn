function main() {
	// Words not in Geiriadur Prifysgol Cymru, that are also troublesome for rh/ng
	var stoplist = [ 'rhangor' ];
	var fs = require( 'fs' );
	
	var lexiconLines = fs.readFileSync( 'lecsicon_cc0.txt' ).toString().split( /\r?\n/ );
	var forms = new Set();
		var lemmasAndPlurals = new Set();
	for ( i = 0; i < lexiconLines.length; i++ ) {
		var line = lexiconLines[ i ];
		if ( line === '' ) {
			continue;
		}
		// One line looks like: form<TAB>lemma<TAB>part of speech<TAB>tags
		var fields = line.split( '\t' );
		// fields looks like: "poeraf\tpoeri\tVERB\tMood=Ind|Number=Sing|Person=1|Tense=Fut"

		var form = fields[ 0 ];
		var lemma = fields[ 1 ];
		var partOfSpeech = fields[ 2 ];
		var tags = fields[ 3 ];
		
		if ( !form.match( /^[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ]*$/ ) ) {
			console.log( 'Rejecting:', form );
			continue;
		}
		if ( stoplist.indexOf( lemma ) > -1 ) {
			continue;
		}
		var letters = getWelshLetters( form, lemma );
		if ( letters.length !== 5 ) {
			continue;
		}

		if ( form === lemma || ( partOfSpeech === 'NOUN' && tags === 'Number=Plur' ) ) {
			lemmasAndPlurals.add( letters.join( ' ' ) );
		};
		forms.add( letters.join( ' ' ) );

	};
	var formsArray = Array.from( forms );
	formsArray.sort();
	console.log( 'formsArray.length:', formsArray.length );

	var lemmasAndPluralsArray = Array.from( lemmasAndPlurals );
	lemmasAndPluralsArray.sort();
	console.log( 'lemmasAndPluralsArray.length:', lemmasAndPluralsArray.length );

	var longlistCode = '/**\n' +
		' * Five-letter wordforms, extracted from Lecsicon Cymraeg Bangor\n' +
		' */\n' +
		'geiryn.cyLonglist = [\n\t' + formsArray.map( function ( form ) {
			return '\'' + form + '\'';
		} ).join( ',\n\t' ) + '\n];\n';
	var shortlistCode = '/**\n' +
		' * Five-letter lemmas and plurals, extracted from Lecsicon Cymraeg Bangor\n' +
		' * TODO: hand-pick most frequent words from this\n' +
		' */\n' +
		'geiryn.cyShortlist = [\n\t' + lemmasAndPluralsArray.map( function ( form ) {
			return '\'' + form + '\'';
		} ).join( ',\n\t' ) + '\n];\n';
	fs.writeFileSync( 'geiryn.cyLonglist.js', longlistCode );
	fs.writeFileSync( 'geiryn.cyShortlist.js', shortlistCode );

};
/**
 * Split a word into an array of Welsh letters
 *
 * TODO: treat ng and rh differently
 * @param {string} form The word to split, e.g. 'ffenestri'
 * @param {string} lemma The root form of the word, e.g. 'ffenestr'
 * @return {string[]} The letters, e.g. [ 'ff', 'e', 'n', 'e', 's', 't', 'r', 'i' ]
 */
function getWelshLetters( form, lemma ) {
	// Lemmas for which rh/ng should be split
	var rhng = [ 'arholi', 'bingo', 'byrhau', 'cwango', 'dengar', 'dyfrhau', 'genglo', 'glingam', 'gorhoffi', 'gwarhau', 'hwyrhau', 'ingot', 'jingo', 'jyngl', 'lingri', 'llengar', 'llengig', 'llwfrhau', 'manglo', 'mango', 'mawrhau', 'mingam', 'parhad', 'parhau', 'pengoch', 'rhangor', 'sarhad', 'sarhau', 'sbangl', 'sicrhau', 'siwrhau', 'tango', 'ungell', 'ungnwd', 'ungorn' ];
	if ( !form.match( /^[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ]*$/ ) ) {
		throw new Error( 'bad character: ' + word );
	}
	var letters;
	if ( rhng.indexOf( lemma ) > -1 ) {
		letters = form.match( /ch|dd|ff|ll|ph|th|[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ]/g );
	} else {
		letters = form.match( /ch|dd|ff|ng|ll|ph|rh|th|[a-zâêîôûŵŷäëïöüẅÿáéíóúẃýàèìòùẁỳ]/g );
	}
	return letters;
}

main();
