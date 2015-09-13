'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Bunny App', function() {

  describe('NowPlaying view', function() {
    beforeEach(function() {
      browser.get('index.html');
      
      browser.driver.sleep(5000);
    });

    it('should render city name based on browser location', function() {
      browser.executeScript(mockGeo(4.649812, -74.050417));

      browser.waitForAngular();

      expect(element(by.css('h1')).getText()).toBe('#nowplaying in Bogotá');
    });
    
    it('should get five or more tweets', function() {
      var tweets = element.all(by.repeater('tweet in tweets'));

      expect(tweets.count()).toBeGreaterThan(4);
    });

  });
});

// Mock the browser navigator.geolocation
var mockGeo = function (lat, lon) {
  return 'navigator.geolocation.getCurrentPosition = '
    + 'function (success, error) {'
    + 'var position = { "coords" : { "latitude": ' + lat + ', ' + '"longitude": ' + lon + ' } };'
    + 'success(position);'
    + '}';
    }
