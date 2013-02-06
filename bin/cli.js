#!/usr/bin/env node

// var getProps = require('../lib/getProps.js')();
var program = require('commander');
var push = require('../lib/push.js');
var statIsGit = require('../lib/statIsGit.js');
var cp = require('../lib/cp.js');
var cpr = require('../lib/cpr.js');
var statSync = require('fs').statSync;
var pjson = require('../package.json');

program.version(pjson.version).option('-p, --path [value]', 'Set an path for upload').option('-k, --key [value]', 'AWS Key').option('-s, --secret [value]', 'AWS Secret Key').option('-b, --bucket [value]', 'AWS S3 Bucket').parse(process.argv);

(function() {
	var options = {};
	var props = require('../lib/getProps.js')(program);
	var path = program.args[0] || process.cwd();

	if (program.path) {
		options.path = program.path;
	}

	if (statIsGit(path)) {
		push(props, path);
	} else if (statSync(path).isFile()) {
		cp(props, program.args);
	} else {
		cpr(props, path, options);
	}
})();
