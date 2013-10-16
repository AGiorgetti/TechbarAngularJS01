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
                es.savePhoto(1, "Photo Nr 1", "Taken in my last trip to Ireland", "http://flickr.com/");
                es.savePhoto(2, "Photo Nr 2", "Sunset", "http://flickr.com/");
            });
        }
    });
