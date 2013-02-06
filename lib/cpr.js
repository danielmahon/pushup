// cpr - copy directory and its entire subtree to S3

var Reader = require('fstream').Reader;
var cop = require('cop');
var pushup = require('../index.js');
var relative = require('path').relative;

module.exports = function(props, path, options) {
	process.chdir(path);

	var reader = new Reader({
		path: '.',
		filter: function(entry) {
			return !entry.basename.match(/^\./);
		}
	});

	return reader.pipe(cop(relate)).pipe(pushup(props, options)).pipe(process.stdout);
};

function relate(obj) {
	var isFile = obj.type === 'File';
	return isFile ? relative(process.cwd(), obj.path) : undefined;
}
