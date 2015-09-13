(function() {
    'use strict';

    angular
        .module('bunnyApp.nowplaying')
        .controller('NowPlaying', NowPlaying);

    NowPlaying.$inject = ['$scope', '$http', 'socket'];

    function NowPlaying($scope, $http, socket) {
        var latitude, longitude;
        
        $scope.city = '';
        $scope.tweets = [];
        $scope.url = '';
        $scope.comment = '';
        
        $scope.tweet = function() {
            socket.emit('post', { text: $scope.comment + ' ' + $scope.video + ' #NowPlaying', lat: latitude, lon: longitude } );
        };
 
        activate();

        function activate() {
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;

                    var location = latitude + ',' + longitude +',10mi';
                    var radius = 0.05;
                    var city = [ (longitude - radius).toString(), (latitude - radius).toString(), (longitude + radius).toString(), (latitude + radius).toString()];
                    
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyAze6EnFoGG_itfAkhqKqGH5X6lmY_45sU')
                    .success(function(data) {
                        $scope.city = data.results[data.results.length - 2].address_components[0].long_name;
                    });

                    socket.emit('get', location);
                    
                    socket.on('tweet', function(tweets){
                        $scope.tweets = tweets.statuses;
                        $scope.$apply();
                    });

                    socket.emit('query', city);

                    socket.on('tweet_streaming', function(tweet) {                        
                        $scope.tweets = $scope.tweets.concat(tweet);
                        $scope.$apply();
                    });
                });
            }
        }
    }
})();
