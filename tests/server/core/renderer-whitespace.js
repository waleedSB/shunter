'use strict';

var assert = require('proclaim');
var sinon = require('sinon');

var mockConfig = {
	env: {
		name: 'development'
	},
	path: {
		root: __dirname,
		shunterRoot: __dirname,
		resources: __dirname,
		publicResources: __dirname
	},
	structure: {
		filters: 'filters',
		filtersInput: 'input-filters',
		mincer: 'mincer',
		ejs: 'ejs',
		dust: 'dust',
		fonts: 'fonts',
		images: 'images',
		styles: 'styles',
		scripts: 'scripts'
	},
	modules: []
};

describe('Whitespace Preservation Config', function () {
	it('preserves whitespace in a compiled template given a config option', function (done) {
		mockConfig.argv = {
			'preserve-whitespace': true
		};
		var renderer = require('../../../lib/renderer')(mockConfig);
		// Invoke the code that sets dust.mockConfig.whitespace based on our mockConfig
		require('../../../lib/dust')(renderer.dust, renderer, mockConfig);

		/* eslint-disable no-useless-concat */
		var template = '{#data}{.}  {/data}' + '\n\n';
		var callback = sinon.stub();

		renderer.dust.loadSource(renderer.dust.compile(template, 'test-template'));
		renderer.renderPartial('test-template', {}, {}, {data: ['a', 'b', 'c']}, callback);
		assert.strictEqual(callback.firstCall.args[1], 'a  b  c  ' + '\n\n');
		/* eslint-enable no-useless-concat */

		done();
	});

	it('does not preserve whitespace in compiled template if preserve-whitespace config option is false', function (done) {
		mockConfig.argv = {
			'preserve-whitespace': false
		};
		var renderer = require('../../../lib/renderer')(mockConfig);
		// Invoke the code that sets dust.mockConfig.whitespace based on our mockConfig
		require('../../../lib/dust')(renderer.dust, renderer, mockConfig);

		/* eslint-disable no-useless-concat */
		var template = '{#data}{.}  {/data}' + '\n\n';
		var callback = sinon.stub();

		renderer.dust.loadSource(renderer.dust.compile(template, 'test-template'));
		renderer.renderPartial('test-template', {}, {}, {data: ['a', 'b', 'c']}, callback);
		assert.strictEqual(callback.firstCall.args[1], 'a  b  c  ');
		/* eslint-enable no-useless-concat */

		done();
	});

	it('removes whitespace in a compiled template by default', function (done) {
		mockConfig.argv = {};
		var renderer = require('../../../lib/renderer')(mockConfig);
		// Invoke the code that sets dust.mockConfig.whitespace based on our mockConfig
		require('../../../lib/dust')(renderer.dust, renderer, mockConfig);

		/* eslint-disable no-useless-concat */
		var template = '{#data}{.}  {/data}' + '\n\n';
		var callback = sinon.stub();

		renderer.dust.loadSource(renderer.dust.compile(template, 'test-template'));
		renderer.renderPartial('test-template', {}, {}, {data: ['a', 'b', 'c']}, callback);
		assert.strictEqual(callback.firstCall.args[1], 'a  b  c  ');
		/* eslint-disable no-useless-concat */

		done();
	});
});
