(function() {
    'use strict';

    angular
        .module('bunnyApp.projects')
        .controller('Projects', Projects);

    Projects.$inject = ['$scope', '$http'];

    function Projects($scope, $http) {
        var project = new Object(),
            projects = []
        project.script = '';
        project.title = '';

        $scope.project = project;

        $scope.postSpeedy = function() {
            $http.post(
                'https://53257:48510529eb505e6f35aec0c4bcad0e48@api.local.voicebunny.com/projects/addSpeedy',
                project
            ).success(function(data) {
                alert('Success');
            })
            .error(function(repsonse) {
                alert('Error');
            });
        };

        activate();

        function activate() {
            getProjects();
        }

        function getProjects() {
            $http.get(
                'https://53257:48510529eb505e6f35aec0c4bcad0e48@api.local.voicebunny.com/projects'
            ).success(function(data) {
                projects = data;
                alert('Success');
            })
            .error(function(response) {
                alert('Error');
            });
        }
    }
})();
