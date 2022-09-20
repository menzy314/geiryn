/*!
 * Grunt file
 *
 * @package geiryn
 */

/* eslint-env node, es6 */

module.exports = function ( grunt ) {
	var modules = grunt.file.readJSON( 'build/modules.json' );
	var moduleUtils = require( './build/moduleUtils' );
	var testFiles = moduleUtils.makeBuildList( modules, [ 'geiryn.test' ] ).scripts;

	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-karma' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		eslint: {
			options: {
				extensions: [ '.js', '.json' ],
				cache: true
			},
			main: [
				'{src,game,tests}/**/*.{js,json}',
				'!package-lock.json',
				'!node_modules/**'
			]
		},
		stylelint: {
			all: [
				'**/*.css',
				'!lib/**',
				'!node_modules/**'
			]
		},
		karma: {
			options: {
				files: testFiles,
				frameworks: [ 'qunit' ],
				reporters: [ 'dots' ],
				singleRun: true,
				browserDisconnectTimeout: 5000,
				browserDisconnectTolerance: 2,
				browserNoActivityTimeout: 30000,
				autoWatch: false
			},
			main: {
				browsers: [ 'ChromeHeadless' ]
			}
		}
	} );
	grunt.registerTask( 'lint', [ 'eslint', 'stylelint' ] );
	grunt.registerTask( 'unit', [ 'karma:main' ] );
	grunt.registerTask( 'test', [ 'lint', 'unit' ] );
	grunt.registerTask( 'default', 'test' );
};
