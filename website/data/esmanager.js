angular.module('esmngr', [])
    /*
     .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
     $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://localhost:9200/**']);
     }])
     */
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
                                "url" : { "type": "string", "index": "not_analyzed" }
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

        this.savePhoto = function(id, title, description, url){
            return $http.put(_endpoint+'/images/photo/'+id, {
                "title": title,
                "description": description,
                "url":url
            });
        }
    })
    .controller('mainCtrl', function ($scope, $log, $http, es) {
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

        $scope.add = function(id, title, url){
            es.savePhoto(id, title, url);
        }
    });
