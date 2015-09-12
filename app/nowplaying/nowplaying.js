(function() {
    'use strict';

    angular
        .module('bunnyApp.nowplaying')
        .controller('NowPlaying', NowPlaying);

    NowPlaying.$inject = ['$q'];

    function NowPlaying($q) {
        var vm = this;

        activate();

        function activate() {
            var promises = [getCompetition(id), getSubcompetitions(id), getOfficials(id), getMatches(id), getRankings(id), getScorers(id), getTeams(id), getPlayers(id)];

            // Using a resolver on all routes or dataservice.ready in every controller
            return $q.all(promises).then(function() {
                logger.info('Activated Competition View');
            });
        }
    }
})();
