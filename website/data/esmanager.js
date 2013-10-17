angular.module('esmngr', ['ngRoute'])
    /*
     .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
     $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://localhost:9200/**']);
     }])
     */
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/search', {
                    templateUrl: 'partials/search.html',
                    controller: 'searchCtrl'
                }).
                when('/add', {
                    templateUrl: 'partials/add.html',
                    controller: 'addCtrl'
                }).
                when('/settings', {
                    templateUrl: 'partials/settings.html',
                    controller: 'settingsCtrl'
                }).
                otherwise({
                    redirectTo: '/search'
                });
        }])
    .service('es', function ($http, $q, $log) {
        var _endpoint = 'http://localhost:9200';

        this.createIndex = function () {
            var deferred = $q.defer();

            var _create = function () {

                $http.put(_endpoint + '/images', {
                    "settings": {
                        "number_of_shards": 1
                    },
                    "mappings": {
                        "photo": {
                            "_source": { "enabled": true },
                            "properties": {
                                "title": { "type": "string", "index": "not_analyzed" },
                                "description": { "type": "string", "index": "not_analyzed" },
                                "url": { "type": "string", "index": "not_analyzed" }
                            }
                        }
                    }
                }).then(function (response) {
                        $log.log('create index response', response);
                        deferred.resolve('created');
                    }, function (error) {
                        $log.log('create index error', error);
                        deferred.reject(error);
                    });
            }

            $http.delete(_endpoint + '/images').then(_create, _create);

            return deferred.promise;
        };

        this.getStatus = function () {
            return $http.get(_endpoint);
        };

        this.savePhoto = function (id, title, description, url) {
            return $http.put(_endpoint + '/images/photo/' + id, {
                "title": title,
                "description": description,
                "url": url
            });
        }

        this.search = function (text) {
            var deferred = $q.defer();

            $http.get(_endpoint + '/images/photo/_search?q=' + text).then(function (response) {
                $log.log('response is', response);
                var results = [];
                angular.forEach(response.data.hits.hits, function (hit) {
                    results.push(hit._source);
                });

                deferred.resolve(results);
            });

            return deferred.promise;
        }
    })
    .controller('settingsCtrl', function ($scope, $log, es) {
        es.getStatus().then(function (status) {
            $log.log('connected to ' + status.data.name);
        });
        $scope.createIndex = function () {
            es.createIndex().then(function () {
                es.savePhoto(1, "Inverno", "Pian grande, Castelluccio di Norcia", "http://farm8.staticflickr.com/7030/6655446883_5f6a85fed9.jpg");
                es.savePhoto(2, "Autunno", "Rosso Conero, Fattoria le Terrazze. Sulla strada tra Castelfidardo e Sirolo", "http://farm8.staticflickr.com/7159/6453186083_da35497b6b.jpg");
                es.savePhoto(3, "Nebbia", "Loreto vista da Castelfidardo poco dopo l'alba", "http://farm6.staticflickr.com/5082/5378313461_5f1ffc1d4b.jpg");
                es.savePhoto(4, "Sassotetto", "Strada che conduce da Sassotetto a Bolognola ", "http://farm6.staticflickr.com/5250/5254415685_019348b088.jpg");
            });
        }
    })
    .controller('addCtrl', function ($scope, es) {
        $scope.add = function (id, title, description, url) {
            es.savePhoto(id, title, description, url);
        }
    })
    .controller('searchCtrl', function ($scope, es) {
        $scope.searchText = '';

        $scope.search = function () {
            $scope.photos = es.search($scope.searchText);
        }
    });
