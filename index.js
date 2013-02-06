module.exports = pushup

var validateProps = require('./lib/validateProps.js');
var es = require('event-stream');
var knox = require('knox');
var Stream = require('stream').Stream;
var join = require('path').join;

function pushup(props, options, callback) {
	if ( typeof options === 'function') {
		callback = options;
		options = {};
	}
	var stream = new Stream();
	var client = knox.createClient(props);
	var error = validateProps(props);
	var ended = false;
	var paused = false;
	var files = null;
	var count = 0;

	if (error) {
		callback && callback(error);
		return error;
	}

	stream.readable = true;
	stream.writable = true;

	stream.resume = function() {
		if (ended) {
			throw new Error('Resume after ended');
		}
		paused = false;
		upload();
		stream.emit('resume');
	};

	stream.pause = function() {
		if (ended) {
			throw new Error('Pause after ended');
		}
		paused = true;
		stream.emit('pause');
	};

	stream.end = function() {
		if (count) {
			return;
		}
		ended = true;
		stream.emit('end');
		callback && callback(error);
	};

	stream.write = function(data) {
		if (!files) {
			count = 0;
			files = [];
		}

		files.push(data);

		upload();

		return true;
	}
	function upload() {
		if (!files.length && !count) {
			stream.end();
			return;
		}

		stream.pause();

		var file = files.shift();

		if (!file) {
			return;
		}

		var entry = client.putFile(file, (options.path || '') + '/' + file, responseHandler);

		count++;

		function responseHandler(err, res) {
			count--;
			if (err) {
				error = err;
				stream.emit('error', err);
				if (!ended) {
					stream.resume();
				}
				return;
			}
			stream.emit('data', res.socket._httpMessage.url + '\n');
			if (!ended) {
				stream.resume();
			}
		}


		entry.name = file;

		stream.emit('entry', entry);
	}

	return stream;
}
