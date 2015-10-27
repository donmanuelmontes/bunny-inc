'use strict';

describe('bunnyApp.nowplaying module', function() {

  beforeEach(module('bunnyApp.nowplaying'));

  describe('bunnyApp.nowplaying', function(){
    var scope, ctrl, $httpBackend, socketMock;

    beforeEach(inject(function(_$httpBackend_,  $rootScope, $controller) {
      $httpBackend = _$httpBackend_;

      // Mock the browser navigator.geolocation
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
         var position = { coords: { latitude: 32, longitude: -96 } };
         arguments[0](position);
      });
      
      // Mock the Google Maps city name resolution
      $httpBackend.expectGET('https://maps.googleapis.com/maps/api/geocode/json?latlng=32,-96&key=AIzaSyAze6EnFoGG_itfAkhqKqGH5X6lmY_45sU')
        .respond({ results: [{ address_components: [{ long_name: 'Bogota' }]}, { address_components: [{ long_name: 'Colombia' }]}] });

      // Simple socket Mock
      socketMock = new sockMock($rootScope);

      scope = $rootScope.$new();
      scope.$digest();
      ctrl = $controller('NowPlaying', {$scope: scope, socket: socketMock});
    }));    

    it('should create "city" model with name fetched from xhr', function() {  
      expect(scope.city).toBe('');

      $httpBackend.flush(); 
      expect(scope.city).toEqual('Bogota');
    });
    
    it('should create "tweets" model with tweets fetched from socket', function() {
      expect(scope.tweets).toEqual([]);
      
      socketMock.receive('tweet', { statuses: 'Tweet'});
      expect(scope.tweets).toBe('Tweet');
    });
  });
});

var sockMock = function($rootScope){
  this.events = {};
  this.emits = {};

  // Intercept 'on' calls and capture the callbacks
  this.on = function(eventName, callback) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    } 

    this.events[eventName].push(callback);
  };

  // Intercept 'emit' calls from the client and record them to assert against in the test
  this.emit = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(!this.emits[eventName]) {
      this.emits[eventName] = [];
    }

    this.emits[eventName].push(args);
  };

  // Simulate an inbound message to the socket from the server (only called from the test)
  this.receive = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(this.events[eventName]){
      angular.forEach(this.events[eventName], function(callback){
        callback.apply(this, args);
      });
    };
  };

};