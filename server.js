var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);
var Twit = require('twit');
var searches = {};
 
var T = new Twit({
  consumer_key: 'gEFEbGdkVTDfzVgyiiCbzUImi',
  consumer_secret: 'Q4yQ000AiJL110zoNEkBYL0ASl84SUcnaxkCJ01uZzeghqWeXX',
  access_token: '2834545563-3Gp2kIjsN5fFSiph2560NAJanr3WZ6S8pMjzPVU',
  access_token_secret: 'iESkAmBbHXWaCHLrkXN89CUyigMMZ5QHboNYsczUDQLlg'
});
 
app.use(express.static(path.join(__dirname, '')));
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});
 
// Sockets
io.on('connection', function(socket) {
  socket.on('query', function(location) {
    console.log('New Search >>', location);
 
    var stream = T.stream('statuses/filter', {
      track: '#nowplaying',
      locations: location
    });
 
    stream.on('tweet', function(tweet) {
      //console.log(q, tweet.id);
      socket.emit('tweet_streaming', tweet);
    });
 
    stream.on('limit', function(limitMessage) {
      console.log('Limit for User : ' + socket.id + ' on query ' + q + ' has rechead!');
    });
 
    stream.on('warning', function(warning) {
      console.log('warning', warning);
    });
 
    // https://dev.twitter.com/streaming/overview/connecting
    stream.on('reconnect', function(request, response, connectInterval) {
      console.log('reconnect :: connectInterval', connectInterval)
    });
 
    stream.on('disconnect', function(disconnectMessage) {
      console.log('disconnect', disconnectMessage);
    });
  });
 
  socket.on('remove', function(query) {
    console.log('Removed Search >>', query);
  });
 
  socket.on('disconnect', function() {
    console.log('Removed All Search from user >>', socket.id);
  });

  socket.on('get', function(location) {
    T.get('search/tweets', { q: encodeURIComponent('#nowplaying'), geocode: location, count: 5, result_type: 'recent' }, function(err, data, response) {
      socket.emit('tweet', data);
    })
  });

  socket.on('post', function(comment) {
    T.post('statuses/update', { status: comment.text, lat: comment.lat, lon: comment.lon }, function(err, data, response) {
      console.log(data)
    })
  });
 
});
 
server.listen(3000);
console.log('Server listening on port 3000');