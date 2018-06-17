var express = require('express');
var router = express.Router();
var ytdl = require('youtube-dl');

function playlist(url) {

  'use strict';
  var video = ytdl(url);

  video.on('error', function error(err) {
    console.log('error 2:', err);
  });

  var size = 0;
  video.on('info', function (info) {
    const webpageURL = info.webpage_url;
    console.log(info)
    ytdl.exec(webpageURL, ['-x', '--audio-format', 'mp3', '-f', 'bestaudio', '-o', "~/Desktop/" + info.playlist_title + "/%(title)s.%(ext)s"], {}, function exec(err, output) {
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

  video.on('end', function () {
    console.log('finished downloading the file!');
  });

  video.on('next', playlist);

}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.post('/api/playlist', function (req, res, next) {
  const endpoint = req.body['input-playlist']
  console.log('Registrando usuario: ', req.body['input-playlist'])
  console.log('respond with a resource');
  playlist(endpoint)
});

module.exports = router;
