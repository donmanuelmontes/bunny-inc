(function() {
    'use strict';

    var core = angular.module('bunnyApp.core');

    var config = {
        appErrorPrefix: '[bunnyApp Error] ', //Configure the exceptionHandler decorator
        appTitle: '#nowplaying',
        version: '0.0.1'
    };

    core.value('config', config);

//     core.config(configure);
// 
//     configure.$inject = ['$logProvider', '$routeProvider', 'routeHelperConfigProvider', 'exceptionHandlerProvider'];
// 
//     function configure ($logProvider, $routeProvider, routeHelperConfigProvider, exceptionHandlerProvider) {
//         // turn debugging off/on (no info or warn)
//         if ($logProvider.debugEnabled) {
//             $logProvider.debugEnabled(true);
//         }
// 
//         // Configure the common route provider
//         routeHelperConfigProvider.config.$routeProvider = $routeProvider;
//         routeHelperConfigProvider.config.docTitle = 'Competitions: ';
// 
//         var resolveAlways = {
//              ready: ['dataservice', function (dataservice) {
//                 return dataservice.ready();
//              }]
//         };
//         routeHelperConfigProvider.config.resolveAlways = resolveAlways;
// 
//         // Configure the common exception handler
//         exceptionHandlerProvider.config.appErrorPrefix = config.appErrorPrefix;
//     }
})();