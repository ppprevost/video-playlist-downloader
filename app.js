var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


var youtubedl = require('youtube-dl');
var ytdl = require('youtube-dl');
var fs = require('fs');
/*var url1 = 'http://www.youtube.com/watch?v=WKsjaOqDXgg';
var url2 = 'http://www.youtube.com/watch?v=90AiXO1pAiA';
youtubedl.getInfo([url1, url2], function(err, info) {
  if (err) throw err;

  console.log('title for the url1:', info[0].title);
  console.log('title for the url2:', info[1].title);
});*/
/*var video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });

// Will be called when the download starts.
video.on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info._filename);
  console.log('size: ' + info.size);
});
video.on('end', function() {
  console.log('finished downloading!');
});

video.pipe(fs.createWriteStream('myvideo.mp4'));*/


function playlist(url) {

  'use strict';
  var video = ytdl(url);

  video.on('error', function error(err) {
    console.log('error 2:', err);
  });

  var size = 0;
  video.on('info', function(info) {
    const webpageURL = info.webpage_url
    ytdl.exec(webpageURL, ['-x', '--audio-format', 'mp3', '-f', 'bestaudio', '-o', "~/Desktop/test/%(title)s.%(ext)s"], {}, function exec(err, output) {
      'use strict';
      if (err) {
        throw err;
      }
      console.log(output.join('\n'));
    });
  });

  var pos = 0;
  video.on('data', function data(chunk) {
    pos += chunk.length;
    // `size` should not be 0 here.
    if (size) {
      var percent = (pos / size * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + '%');
    }
  });

  video.on('end', function() {
    console.log('finished downloading the file!');
  });

  video.on('next', playlist);

}

playlist('https://www.youtube.com/playlist?list=PL5hJHQYnvenenvvXSUqoDoHpMod4t6p9a')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
