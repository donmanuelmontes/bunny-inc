// Dependencies
var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(server);
var Twit = require('twit');
var searches = {};

// Twitter client config 
var T = new Twit({
  consumer_key: 'gEFEbGdkVTDfzVgyiiCbzUImi',
  consumer_secret: 'Q4yQ000AiJL110zoNEkBYL0ASl84SUcnaxkCJ01uZzeghqWeXX',
  access_token: '2834545563-3Gp2kIjsN5fFSiph2560NAJanr3WZ6S8pMjzPVU',
  access_token_secret: 'iESkAmBbHXWaCHLrkXN89CUyigMMZ5QHboNYsczUDQLlg'
});
 
// Set the app folder as a static folder
app.use(express.static(path.join(__dirname, '\app')));

// Set default route to index.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});
 
// Set Sockets to start listening for a new connection.
io.on('connection', function(socket) {
  // Streaming query event
  socket.on('query', function(location) {
    console.log('New Search: ', location);
 
    var stream = T.stream('statuses/filter', {
      track: '#nowplaying',
      locations: location
    });
 
    // Send new tweet
    stream.on('tweet', function(tweet) {
      socket.emit('tweet_streaming', tweet);
    });
 
    // Stream limit has been reached
    stream.on('limit', function(limitMessage) {
      console.log('Limit for User : ' + socket.id + ' on query ' + location + ' has rechead!');
    });
 
    stream.on('warning', function(warning) {
      console.log('warning', warning);
    });
 
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

  // First tweet load
  socket.on('get', function(location) {
    T.get('search/tweets', { q: encodeURIComponent('#nowplaying'), geocode: location, count: 5, result_type: 'recent' }, function(err, data, response) {
      socket.emit('tweet', data);
    })
  });

  // Tweet post
  socket.on('post', function(comment) {
    T.post('statuses/update', { status: comment.text, lat: comment.lat, lon: comment.lon }, function(err, data, response) {
      console.log(data)
    })
  });
 
});

// server.listen(3000);
server.listen(process.env.PORT);
console.log('Server listening on port 3000');
