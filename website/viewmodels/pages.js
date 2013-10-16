var app = angular.module('myApp');
app.controller('page1', ['$scope',
    function ($scope) {
        $scope.title = 'page 1';
    } ]);
app.controller('page2', ['$scope',
    function ($scope) {
        $scope.title = 'page 2';
    } ]);