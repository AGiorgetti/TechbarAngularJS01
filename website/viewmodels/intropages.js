var app = angular.module('myApp');

app.controller('homeController', ['$scope',
    function ($scope) {
        $scope.title = 'Techbar';
    } ]);

app.controller('aboutusController', ['$scope',
    function ($scope) {
        $scope.title = 'About Us';
        $scope.guys = [
            {
                name: 'Andrea Balducci',
                twitter: '',
                twitterUrl: '',
                facebook: '',
                facebookUrl: '',
                email: ''
            },
            {
                name: 'Alessandro Giorgetti',
                twitter: '@agiorgetti',
                twitterUrl: '@agiorgetti',
                facebook: 'Alessandro Giorgetti',
                facebookUrl: 'https://www.facebook.com/giorgetti.alessandro',
                email: 'alessandro.giorgetti@live.com'
            }
        ];
    } ]);

app.controller('linksController', ['$scope',
    function ($scope) {
        $scope.title = 'Links Utili';
        $scope.links = [
        {
            desc: 'How Javascript Works',
            url: 'http://misko.hevery.com/2010/07/14/how-javascript-works/'
        },
        {
            desc: 'AngularJS Documentation',
            url: 'http://angularjs.org/'
        },
        {
            desc: 'AngularJS Fundamentals In 60-ish Minutes',
            url: 'http://www.youtube.com/watch?v=i9MHigUZKEM'
        },
        {
            desc: 'Egghead.IO tutorials',
            url: 'http://egghead.io/lessons'
        },
        ];
    } ]);