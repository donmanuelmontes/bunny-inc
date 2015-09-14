(function() {
    'use strict';

    var core = angular.module('bunnyApp.core');

    core.factory('socket', socketFactory);

    function socketFactory() {
    	return io.connect('http://bunny-inc.azurewebsites.net/');
	}
})();