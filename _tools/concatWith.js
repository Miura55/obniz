'use strict';

var through = require('through2');
var path = require('path');
var File = require('vinyl');
var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'concatWith';

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  if (!file) {
    throw new Error('gulp-concat: Missing file option');
  }
  opt = opt || {};

  if (typeof opt.header !== 'string') {
    opt.header = '';
  }

  if (typeof opt.separator !== 'string') {
    opt.separator = '';
  }
  if (typeof opt.footer !== 'string') {
    opt.footer = '';
  }

  var fileName;
  var latestFile;
  var latestMod;
  var stringList = [];

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new Error('gulp-concat: Missing path in file options');
  }

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // we don't do streams (yet)
    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams not supported!')
      );
      cb();
      return;
    }

    if (!latestMod || (file.stat && file.stat.mtime > latestMod)) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    stringList.push(String(file.contents));
    cb();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (stringList.length == 0 || !latestFile) {
      cb();
      return;
    }

    var joinedFile;

    if (typeof file === 'string') {
      joinedFile = latestFile.clone({ contents: false });
      joinedFile.path = path.join(latestFile.base, file);
    } else {
      joinedFile = new File(file);
    }

    joinedFile.contents = new Buffer(
      opt.header + stringList.join(opt.separator) + opt.footer
    );

    this.push(joinedFile);

    cb();
  }

  return through.obj(bufferContents, endStream);
};
